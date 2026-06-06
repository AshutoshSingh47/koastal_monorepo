import { Role, Status } from "@workspace/database";
import type { Request } from "express";

export interface CreateAdminBody {
  firstName?: string;
  lastName?: string;
  email: string;
}

export interface UpdateStatusBody {
  status: Status;
}

export interface GetUserQuery {
  email?: string | string[];
}

export interface GetUsersFilters {
  status?: Status;
  search?: string;
  role?: Role;
  limit?: number;
  offset?: number;
}

export type GetUserRequest = Request<{ id?: string }, any, any, GetUserQuery>;
export type CreateAdminRequest = Request<any, any, CreateAdminBody>;
export type UpdateStatusRequest = Request<
  { id: string },
  any,
  UpdateStatusBody
>;
export type GetUsersQuery = {
  status?: string;
  search?: string;
  role?: string;
  limit?: string;
  offset?: string;
};

export type GetUsersRequest = Request<any, any, any, GetUsersQuery>;
