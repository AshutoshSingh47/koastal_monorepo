import { Status } from "@workspace/database";
import type { User } from "@workspace/database";
import { auth } from "../lib/auth";
import { db } from "../lib/prisma";
import { DEFAULT_ADMIN_PERMISSIONS } from "../lib/resources";
import {
  createUser,
  findUserByEmail,
  findUserById,
  updateStatus,
} from "../repositories/user.repository";
import { BadRequestError, NotFoundError } from "../utils/http-exception";

export async function getUser({
  id,
  email,
}: {
  id?: string;
  email?: string;
}): Promise<User> {
  if (!id && !email) {
    throw new BadRequestError(
      "Provide either a user id path param or an email query param",
    );
  }

  const user = id ? await findUserById(id) : await findUserByEmail(email!);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return user;
}

export async function inviteAdmin({ email }: { email: string }): Promise<User> {
  const existing = await findUserByEmail(email);

  if (existing) {
    if (existing.emailVerified) {
      // Already logged in at least once — they have full access, no need to re-invite
      throw new BadRequestError(
        "This account is already active. The user can sign in via OTP or magic link directly.",
      );
    }

    // Never logged in — invite expired or not clicked yet, resend it
    await auth.api.signInMagicLink({
      body: {
        email,
        callbackURL:
          process.env.ADMIN_APP_URL ?? "http://localhost:3001/dashboard",
      },
      headers: new Headers({
        "x-internal-invite": process.env.INTERNAL_INVITE_SECRET!,
      }),
    });

    return existing;
  }

  const user = await createUser(email);

  await db.permission.createMany({
    data: DEFAULT_ADMIN_PERMISSIONS.map(({ resource, actions }) => ({
      userId: user.id,
      resource,
      actions,
    })),
  });

  // await auth.api.signInMagicLink({
  //   body: {
  //     email,
  //     callbackURL:
  //       process.env.ADMIN_APP_URL ?? "http://localhost:3001/dashboard",
  //   },
  //   headers: new Headers({
  //     "x-internal-invite": process.env.INTERNAL_INVITE_SECRET!,
  //   }),
  // });

  return user;
}

export async function createAdmin(
  email: string,
  firstName?: string,
  lastName?: string,
): Promise<User> {
  const existing = await findUserByEmail(email);

  if (existing) {
    throw new BadRequestError("This account already exists!");
  } else {
    const user = await createUser(email, firstName, lastName);
    await db.permission.createMany({
      data: DEFAULT_ADMIN_PERMISSIONS.map(({ resource, actions }) => ({
        userId: user.id,
        resource,
        actions,
      })),
    });
    return user;
  }

  // Never logged in — invite expired or not clicked yet, resend it
  // await auth.api.signInMagicLink({
  //   body: {
  //     email,
  //     callbackURL:
  //       process.env.ADMIN_APP_URL ?? "http://localhost:3001/dashboard",
  //   },
  //   headers: new Headers({
  //     "x-internal-invite": process.env.INTERNAL_INVITE_SECRET!,
  //   }),
  // });

  // await auth.api.signInMagicLink({
  //   body: {
  //     email,
  //     callbackURL:
  //       process.env.ADMIN_APP_URL ?? "http://localhost:3001/dashboard",
  //   },
  //   headers: new Headers({
  //     "x-internal-invite": process.env.INTERNAL_INVITE_SECRET!,
  //   }),
  // });
}

const VALID_TRANSITIONS: Partial<Record<Status, Status[]>> = {
  [Status.PENDING]: [Status.ACTIVE, Status.BLOCKED, Status.DEACTIVATED],
  [Status.ACTIVE]: [Status.BLOCKED, Status.DEACTIVATED],
  [Status.BLOCKED]: [Status.ACTIVE, Status.DEACTIVATED],
  [Status.DEACTIVATED]: [Status.ACTIVE],
};

export async function updateUserStatus({
  id,
  status,
  requesterId,
}: {
  id: string;
  status: Status;
  requesterId: string;
}): Promise<User> {
  if (id === requesterId) {
    throw new BadRequestError("Cannot change your own status.");
  }

  const user = await findUserById(id);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const allowed = VALID_TRANSITIONS[user.status];
  if (!allowed?.includes(status)) {
    throw new BadRequestError(
      `Cannot transition from ${user.status} to ${status}`,
    );
  }

  if (user.status === Status.PENDING && status === Status.ACTIVE) {
    await auth.api.signInMagicLink({
      body: {
        email: user.email,
        name: user.name,
        callbackURL:
          process.env.ADMIN_APP_URL ?? "http://localhost:3001/dashboard",
      },
      headers: new Headers({
        "x-internal-invite": process.env.INTERNAL_INVITE_SECRET!,
      }),
    });
  }

  if (status === Status.DEACTIVATED) {
    await db.session.deleteMany({ where: { userId: id } });
    await db.permission.deleteMany({ where: { userId: id } });
  }

  return updateStatus(id, status);
}
