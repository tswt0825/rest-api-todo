import { z } from "zod";

export const todoIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const todoListQuerySchema = z.object({
  done: z.enum(["true", "false"]).optional(),
  sort: z.enum(["asc", "desc"]).optional(),
});

export const todoCreateSchema = z.object({
  title: z.string().min(1),
  dueDate: z.string().datetime().optional(),
  tags: z.array(z.string().min(1)).optional(),
});

export const todoPutSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  done: z.boolean(),
  dueDate: z.string().datetime().nullable(),
  tags: z.array(z.string().min(1)),
});

export const todoPatchSchema = z.object({
  title: z.string().min(1).optional(),
  done: z.boolean().optional(),
  dueDate: z.string().datetime().nullable().optional(),
  tags: z.array(z.string().min(1)).optional(),
});
