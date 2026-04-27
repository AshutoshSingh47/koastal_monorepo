import { Router } from "express";
import {
  createAdminHandler,
  getAllUsersHandler,
  getUserHandler,
  updateStatusHandler,
} from "../controllers/user.controller";
import {
  requirePermission,
  requireSuperAdmin,
} from "../middleware/require-session";

export const userRouter: Router = Router();

userRouter.get("/", requirePermission("admin", "read"), getAllUsersHandler);
userRouter.get("/:id", getUserHandler);
userRouter.post("/", requirePermission("admin", "create"), createAdminHandler);
userRouter.patch(
  "/:id/status",
  requirePermission("admin", "update"),
  updateStatusHandler,
);
// userRouter.post("/invite", requireSuperAdmin, inviteAdminHandler);
