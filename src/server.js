import express from "express";
import { env } from "./config/env.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { requireAuth } from "./middlewares/auth.js";
import { todosRouter } from "./modules/todos/todos.routes.js";
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

app.get("/v1/health", (req, res) => res.status(200).json({ ok: true }));

app.get("/v1/protected", requireAuth, (req, res) => {
  res.status(200).json({ ok: true, user: req.user });
});

app.use("/v1/auth", authRouter);
app.use("/v1/todos", todosRouter);

app.listen(env.port, () =>
  console.log(`Server running on http://localhost:${env.port}`)
);
