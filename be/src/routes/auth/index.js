import { Router } from "express";

import {
  validate,
  credentials,
  body,
} from "../../validators/index.js";

import { respond } from "../../controllers/http.js";
import { authService } from "../../services/auth/index.js";
import { rateLimit } from "../../middlewares/error.js";

export function routes(dependencies) {
  const router = Router();

  const authLimit = rateLimit();
  const account = authService(dependencies);

  router.post(
    "/signup",
    authLimit,
    validate([
      ...credentials,
      body("name").isString().trim().isLength({ min: 2, max: 80 }),
    ]),
    respond((req) => account.signup(req.body), 201),
  );

  router.post(
    "/verify",
    authLimit,
    validate([
      body("email").isEmail().normalizeEmail(),
      body("code").matches(/^\d{6}$/),
    ]),
    respond((req) => account.verify(req.body)),
  );

  router.post(
    "/resend",
    authLimit,
    validate([body("email").isEmail().normalizeEmail()]),
    respond((req) => account.resend(req.body)),
  );

  router.post(
    "/login",
    authLimit,
    validate(credentials),
    respond((req) => account.login(req.body)),
  );

  router.post(
    "/forgot-password",
    authLimit,
    validate([body("email").isEmail().normalizeEmail()]),
    respond((req) => account.forgotPassword(req.body)),
  );

  router.post(
    "/reset-password",
    authLimit,
    validate([
      body("email").isEmail().normalizeEmail(),
      body("code").matches(/^\d{6}$/),
      body("password").isString().isLength({ min: 12, max: 72 }),
    ]),
    respond((req) => account.resetPassword(req.body)),
  );

  return router;
}
