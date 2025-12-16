// Importerer Express – rammeverket som brukes til å lage serveren
import express from "express";

// Importerer miljøvariabler (f.eks. port)
import { env } from "./config/env.js";

// Importerer router for autentisering (login, refresh, logout)
import { authRouter } from "./modules/auth/auth.routes.js";

// Importerer middleware som beskytter endepunkter med JWT
import { requireAuth } from "./middlewares/auth.js";

// Importerer router for gjøremål (todos)
import { todosRouter } from "./modules/todos/todos.routes.js";

// Oppretter Express-applikasjonen (selve serveren)
const app = express();

// Middleware som gjør at serveren kan lese JSON i request body
app.use(express.json());

/**
 * Root-endepunkt
 * Brukes kun som en enkel bekreftelse på at API-et kjører
 */
app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

/**
 * Health check-endepunkt
 * Brukes for å verifisere at serveren er oppe
 * Krever ingen autentisering
 */
app.get("/v1/health", (req, res) => {
  res.status(200).json({ ok: true });
});

/**
 * Beskyttet test-endepunkt
 * Krever gyldig access token (Authorization: Bearer ...)
 * Brukes for å demonstrere at autentisering fungerer
 */
app.get("/v1/protected", requireAuth, (req, res) => {
  res.status(200).json({
    ok: true,
    user: req.user, // payload fra JWT, satt i auth-middleware
  });
});

/**
 * Autentiserings-endepunkter
 * Alle ruter definert i authRouter vil være tilgjengelige under /v1/auth
 * Eksempel: POST /v1/auth/login
 */
app.use("/v1/auth", authRouter);

/**
 * Gjøremål-endepunkter (Todos)
 * Alle ruter definert i todosRouter vil være tilgjengelige under /v1/todos
 * Disse rutene er beskyttet med autentisering
 */
app.use("/v1/todos", todosRouter);

/**
 * Starter serveren og begynner å lytte på angitt port
 */
app.listen(env.port, () => {
  console.log(`Server running on http://localhost:${env.port}`);
});
