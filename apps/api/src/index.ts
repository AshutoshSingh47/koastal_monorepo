import "dotenv/config";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express from "express";
import { auth } from "./lib/auth";
import { errorHandler } from "./middleware/error-handler";
import { notFoundHandler } from "./middleware/not-found";
import { apiRouter } from "./routes";

const app = express();
const port = process.env.PORT || 8080;

const allowedOrigins = process.env.TRUSTED_ORIGINS?.split(",") ?? [
  "http://localhost:3000",
  "http://localhost:3001",
];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "API is running" });
});

app.all("/api/auth/*", toNodeHandler(auth));
app.use("/api", apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
