import type { NextFunction, Request, Response } from "express";
import { getUsers } from "../repositories/user.repository";
import {
  createAdmin,
  getUser,
  updateUserStatus,
} from "../services/user.service";
import {
  CreateAdminRequest,
  GetUserRequest,
  GetUsersFilters,
  GetUsersRequest,
  UpdateStatusRequest,
} from "../types/user";

export async function getUserHandler(
  req: GetUserRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const emailQuery = req.query.email;
    const email =
      typeof emailQuery === "string"
        ? emailQuery
        : Array.isArray(emailQuery)
          ? emailQuery.find(
              (value): value is string => typeof value === "string",
            )
          : undefined;

    const user = await getUser({
      id: req.params.id,
      email,
    });

    return res.status(200).json({ data: user });
  } catch (error) {
    next(error);
  }
}

export async function createAdminHandler(
  req: CreateAdminRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const { firstName, lastName, email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await createAdmin(email, firstName, lastName);

    return res.status(201).json({ data: user });
  } catch (error) {
    next(error);
  }
}

export async function getAllUsersHandler(
  req: GetUsersRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const { status, search, role, limit, offset } = req.query;

    const users = await getUsers({
      status: status as GetUsersFilters["status"],
      search,
      role: role as GetUsersFilters["role"],
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    });

    return res.status(200).json({ data: users });
  } catch (error) {
    next(error);
  }
}

export async function updateStatusHandler(
  req: UpdateStatusRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const requesterId = res.locals.session.user.id;
    const user = await updateUserStatus({ id, status, requesterId });

    return res.status(200).json({ data: user });
  } catch (error) {
    next(error);
  }
}
