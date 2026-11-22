
import { Router } from "express";
import { routes as authRoutes } from "./auth/index.js";
import { taskRoutes } from "./tasks/index.js";
import { authenticate } from "../middlewares/error.js";

export function routes(dependencies) {
  const router = Router();

  router.use("/auth", authRoutes(dependencies));

  router.use(
    "/tasks",
    authenticate(dependencies.config),
    taskRoutes(),
  );

  return router;
}
