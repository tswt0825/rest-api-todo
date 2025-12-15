import express from "express";
import { login, refresh, logout } from "./auth.controller.js";
import { validate } from "../../middlewares/validate.js";
import { loginSchema } from "./auth.schemas.js";

export const authRouter = express.Router();

authRouter.post("/login", validate({ body: loginSchema }), login);
authRouter.get("/refresh", refresh);
authRouter.post("/logout", logout);
