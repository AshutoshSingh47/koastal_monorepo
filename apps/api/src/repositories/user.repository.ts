import type { Prisma, User } from "@workspace/database";
import { Status } from "@workspace/database";
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
  const { status, search, role, limit = 10, offset = 0 } = filters;
  const where: Prisma.UserWhereInput = {
    status: status,
    role: role ?? undefined,
    ...(search && {
      OR: [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  const [users, total] = await Promise.all([
    db.user.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { createdAt: "desc" },
    }),
    db.user.count({ where }),
  ]);

  return {
    users,
    meta: {
      total,
      page: Math.floor(offset / limit) + 1,
      pageSize: limit,
      totalPage: Math.ceil(total / limit),
    },
  };
}

export async function updateStatus(id: string, status: Status) {
  return db.user.update({ where: { id }, data: { status } });
}
