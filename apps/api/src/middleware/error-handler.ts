import type { NextFunction, Request, Response } from "express";
import { HttpException } from "../utils/http-exception";

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpException) {
    return res.status(err.statusCode).json({
      message: err.message,
      details: err.details ?? null,
    });
  }

  console.error("Unexpected error", err);
  return res.status(500).json({ message: "Internal Server Error" });
}
