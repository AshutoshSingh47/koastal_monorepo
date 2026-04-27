import type { User } from "@prisma/client";
import { Status } from "@prisma/client";
import { db } from "../lib/prisma";
import { GetUsersFilters } from "../types/user";

export async function findUserById(id: string): Promise<User | null> {
  return db.user.findUnique({ where: { id } });
}

export async function findUserByEmail(email: string): Promise<User | null> {
  return db.user.findUnique({ where: { email } });
}

export async function createUser(
  email: string,
  firstName?: string,
  lastName?: string,
): Promise<User> {
  return db.user.create({
    data: {
      email: email,
      name: [firstName, lastName].filter(Boolean).join(" ") ?? "New User",
      firstName: firstName ?? "New",
      lastName: lastName ?? "User",
      role: "ADMIN",
      emailVerified: false,
    },
  });
}

export async function getUsers(filters: GetUsersFilters) {
  const { status, search, role, limit, offset } = filters;
  return db.user.findMany({
    where: {
      status: status ?? { not: Status.DEACTIVATED },
      role: role ?? undefined,
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      }),
    },
    take: limit,
    skip: offset,
    orderBy: { createdAt: "desc" },
  });
}

export async function updateStatus(id: string, status: Status) {
  return db.user.update({ where: { id }, data: { status } });
}
