// Importerer Express for å kunne opprette en router
import express from "express";

// Importerer autentiserings-middleware som beskytter rutene
import { requireAuth } from "../../middlewares/auth.js";

// Importerer validerings-middleware som bruker Zod-skjemaer
import { validate } from "../../middlewares/validate.js";

// Importerer Zod-skjemaer for validering av params, query og body
import {
  todoIdParamSchema,
  todoListQuerySchema,
  todoCreateSchema,
  todoPutSchema,
  todoPatchSchema,
} from "./todos.schemas.js";

// Importerer controller-funksjoner som inneholder forretningslogikk
import {
  listTodos,
  getTodoById,
  createTodo,
  putTodo,
  patchTodo,
  deleteTodo,
} from "./todos.controller.js";

// Oppretter en egen router for gjøremål-endepunkter
export const todosRouter = express.Router();

/**
 * Middleware som kjøres for alle ruter i denne routeren
 * Krever gyldig access token (Authorization: Bearer ...)
 */
todosRouter.use(requireAuth);

/**
 * GET /v1/todos
 * Lister alle gjøremål
 * Støtter filtrering (?done=true|false) og sortering (?sort=asc|desc)
 */
todosRouter.get("/", validate({ query: todoListQuerySchema }), listTodos);

/**
 * GET /v1/todos/:id
 * Henter ett spesifikt gjøremål basert på id
 */
todosRouter.get("/:id", validate({ params: todoIdParamSchema }), getTodoById);

/**
 * POST /v1/todos
 * Oppretter et nytt gjøremål
 */
todosRouter.post("/", validate({ body: todoCreateSchema }), createTodo);

/**
 * PUT /v1/todos
 * Oppretter eller erstatter et gjøremål
 * Krever at id sendes i body
 */
todosRouter.put("/", validate({ body: todoPutSchema }), putTodo);

/**
 * PATCH /v1/todos/:id
 * Delvis oppdatering av et eksisterende gjøremål
 * Kun felter som sendes i body oppdateres
 */
todosRouter.patch(
  "/:id",
  validate({
    params: todoIdParamSchema,
    body: todoPatchSchema,
  }),
  patchTodo
);

/**
 * DELETE /v1/todos/:id
 * Sletter et gjøremål basert på id
 */
todosRouter.delete("/:id", validate({ params: todoIdParamSchema }), deleteTodo);
