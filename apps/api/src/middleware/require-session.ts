import type { NextFunction, Request, Response } from "express";
import { auth } from "../lib/auth";
import { db } from "../lib/prisma";
import type { Action, Resource } from "../lib/resources";
import { ForbiddenError, UnauthorizedError } from "../utils/http-exception";

export async function requireSession(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const session = await auth.api.getSession({
    headers: req.headers as unknown as Headers,
  });

  if (!session) {
    return next(new UnauthorizedError("No active session"));
  }

  res.locals.session = session;
  next();
}

export async function requireSuperAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const session =
    res.locals.session ??
    (await auth.api.getSession({ headers: req.headers as unknown as Headers }));

  if (!session) {
    return next(new UnauthorizedError("No active session"));
  }

  if (session.user.role !== "SUPER_ADMIN") {
    return next(new ForbiddenError("Super admin access required"));
  }

  res.locals.session = session;
  next();
}

// Factory: call as requirePermission('admin', 'create') — returns an Express middleware
export function requirePermission(resource: Resource, action: Action) {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Reuse session already fetched earlier in the chain, or fetch it now
    const session =
      res.locals.session ??
      (await auth.api.getSession({
        headers: req.headers as unknown as Headers,
      }));

    if (!session) {
      return next(new UnauthorizedError("No active session"));
    }

    res.locals.session = session;

    // Check live status from DB — cookie cache can hold stale ACTIVE status
    // for up to 60s after a block, so we never trust the cached value here
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { status: true },
    });

    if (!user || user.status !== "ACTIVE") {
      return next(new ForbiddenError("Account is not active"));
    }

    // Look up this user's permission row for the requested resource
    const permission = await db.permission.findUnique({
      where: {
        userId_resource: {
          userId: session.user.id,
          resource,
        },
      },
    });

    // No row at all → user has no access to this resource
    if (!permission) {
      return next(
        new ForbiddenError(`No permission for resource: ${resource}`),
      );
    }

    // Row exists but the specific action isn't in their actions array
    if (!permission.actions.includes(action)) {
      return next(
        new ForbiddenError(`Missing permission: ${resource}:${action}`),
      );
    }

    next();
  };
}
