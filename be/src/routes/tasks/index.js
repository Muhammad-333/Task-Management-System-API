import { Router } from "express";

import { taskService } from "../../services/tasks/index.js";
import { respond } from "../../controllers/http.js";
import { id, validate, body } from "../../validators/index.js";

export function taskRoutes() {
  const router = Router();
  const tasks = taskService();

  router.post(
    "/",
    validate([
      body("title").isString().trim().isLength({ min: 1, max: 100 }),
      body("description").optional().isString().isLength({ max: 1000 }),
      body("status").optional().isIn(["pending", "in-progress", "completed"]),
      body("priority").optional().isIn(["low", "medium", "high"]),
      body("dueDate").optional().isISO8601(),
    ]),
    respond((req) => tasks.create(req.user.id, req.body), 201),
  );

  router.get(
    "/",
    respond((req) => tasks.getAll(req.user.id)),
  );

  router.get(
    "/:id",
    validate([id()]),
    respond((req) => tasks.getOne(req.user.id, req.params.id)),
  );

  router.patch(
    "/:id",
    validate([
      id(),
      body("title").optional().isString().trim().isLength({ min: 1, max: 100 }),
      body("description").optional().isString().isLength({ max: 1000 }),
      body("status").optional().isIn(["pending", "in-progress", "completed"]),
      body("priority").optional().isIn(["low", "medium", "high"]),
      body("dueDate").optional().isISO8601(),
    ]),
    respond((req) => tasks.update(req.user.id, req.params.id, req.body)),
  );

  router.delete(
    "/:id",
    validate([id()]),
    respond((req) => tasks.remove(req.user.id, req.params.id)),
  );

  return router;
}
