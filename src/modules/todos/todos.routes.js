import express from "express";
import { requireAuth } from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validate.js";
import {
  todoIdParamSchema,
  todoListQuerySchema,
  todoCreateSchema,
  todoPutSchema,
  todoPatchSchema,
} from "./todos.schemas.js";
import {
  listTodos,
  getTodoById,
  createTodo,
  putTodo,
  patchTodo,
  deleteTodo,
} from "./todos.controller.js";

export const todosRouter = express.Router();

todosRouter.use(requireAuth);

todosRouter.get("/", validate({ query: todoListQuerySchema }), listTodos);
todosRouter.get("/:id", validate({ params: todoIdParamSchema }), getTodoById);

todosRouter.post("/", validate({ body: todoCreateSchema }), createTodo);
todosRouter.put("/", validate({ body: todoPutSchema }), putTodo);

todosRouter.patch(
  "/:id",
  validate({ params: todoIdParamSchema, body: todoPatchSchema }),
  patchTodo
);
todosRouter.delete("/:id", validate({ params: todoIdParamSchema }), deleteTodo);
