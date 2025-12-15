import { v4 as uuid } from "uuid";
import { todos } from "../../data/store.js";

// GET /v1/todos?done=true|false&sort=asc|desc
export function listTodos(req, res) {
  const q = req.validated?.query ?? {};
  let items = Array.from(todos.values());

  // filter ?done=true|false
  if (q.done) {
    const doneBool = q.done === "true";
    items = items.filter((t) => t.done === doneBool);
  }

  // sort ?sort=asc|desc (createdAt)
  if (q.sort) {
    const dir = q.sort;
    items.sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      return dir === "asc" ? aTime - bTime : bTime - aTime;
    });
  }

  return res.status(200).json({ items });
}

// GET /v1/todos/:id
export function getTodoById(req, res) {
  const { id } = req.validated.params;

  const todo = todos.get(id);
  if (!todo) {
    return res.status(404).json({
      error: { code: "NOT_FOUND", message: "Todo not found" },
    });
  }

  return res.status(200).json(todo);
}

// POST /v1/todos
export function createTodo(req, res) {
  const b = req.validated.body;

  const id = uuid();
  const now = new Date().toISOString();

  const todo = {
    id,
    title: b.title,
    done: false,
    dueDate: b.dueDate ?? null,
    tags: b.tags ?? [],
    createdAt: now,
  };

  todos.set(id, todo);
  return res.status(201).json(todo);
}

// PUT /v1/todos  (id i body, idempotent-ish)
export function putTodo(req, res) {
  const b = req.validated.body;

  const existing = todos.get(b.id);
  const createdAt = existing ? existing.createdAt : new Date().toISOString();

  const todo = {
    id: b.id,
    title: b.title,
    done: b.done,
    dueDate: b.dueDate, // kan være null
    tags: b.tags,
    createdAt,
  };

  todos.set(todo.id, todo);

  // 200 hvis den eksisterte, ellers 201
  return res.status(existing ? 200 : 201).json(todo);
}

// PATCH /v1/todos/:id
export function patchTodo(req, res) {
  const { id } = req.validated.params;
  const b = req.validated.body;

  const current = todos.get(id);
  if (!current) {
    return res.status(404).json({
      error: { code: "NOT_FOUND", message: "Todo not found" },
    });
  }

  const updated = {
    ...current,
    ...b,
  };

  todos.set(id, updated);
  return res.status(200).json(updated);
}

// DELETE /v1/todos/:id
export function deleteTodo(req, res) {
  const { id } = req.validated.params;

  const existed = todos.delete(id);
  if (!existed) {
    return res.status(404).json({
      error: { code: "NOT_FOUND", message: "Todo not found" },
    });
  }

  return res.status(204).send();
}
