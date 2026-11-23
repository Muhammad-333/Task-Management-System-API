import cors from "cors";
import express from "express";
import { routes } from "./routes/index.js";
import { errors, rateLimit } from "./middlewares/error.js";

export function createApp(dependencies) {
  const app = express();
  app.disable("x-powered-by");
  app.use(rateLimit({ max: 300 }));
  app.use(express.json({ limit: "32kb" }));

  app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://task-management-system-api-backend-team3.vercel.app"
  ]
}));

  app.get("/health", (req, res) =>
    res.json({ status: "OK", uptime: process.uptime() }),
  );
  app.get("/test", rateLimit({ max: 3 }), (req, res) => {
    res.json({
      message: "Working",
    });
  });

  // routes
  app.use("/api", routes(dependencies));

  app.use((req, res) => res.status(404).json({ error: "Route not found" }));
  app.use(errors);
  return app;
}