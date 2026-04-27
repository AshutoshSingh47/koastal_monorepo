import { Router } from "express";
import { userRouter } from "./user.routes";

export const apiRouter: Router = Router();

apiRouter.use("/users", userRouter);
