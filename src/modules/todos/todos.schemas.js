// Importerer Zod – biblioteket som brukes til inndatavalidering
import { z } from "zod";

/**
 * Validerer URL-parametere for gjøremål
 * Brukes for endepunkter som inneholder :id (f.eks. /v1/todos/:id)
 * Sikrer at id er en gyldig UUID
 */
export const todoIdParamSchema = z.object({
  id: z.string().uuid(),
});

/**
 * Validerer query-parametere for listing av gjøremål
 * Brukes av GET /v1/todos
 * - done: filtrerer på ferdig/ikke ferdig
 * - sort: sorterer på opprettelsestidspunkt
 */
export const todoListQuerySchema = z.object({
  done: z.enum(["true", "false"]).optional(),
  sort: z.enum(["asc", "desc"]).optional(),
});

/**
 * Validerer body ved opprettelse av nytt gjøremål
 * Brukes av POST /v1/todos
 */
export const todoCreateSchema = z.object({
  // Tittel er påkrevd og må inneholde minst ett tegn
  title: z.string().min(1),

  // Frist er valgfri og må være gyldig ISO-dato hvis den er oppgitt
  dueDate: z.string().datetime().optional(),

  // Tags er valgfritt og må være en liste med ikke-tomme strenger
  tags: z.array(z.string().min(1)).optional(),
});

/**
 * Validerer body ved PUT (full oppdatering av gjøremål)
 * Brukes av PUT /v1/todos
 * Alle felt må være med
 */
export const todoPutSchema = z.object({
  // ID må være gyldig UUID
  id: z.string().uuid(),

  // Tittel må være minst ett tegn
  title: z.string().min(1),

  // done må være boolean
  done: z.boolean(),

  // dueDate kan være en gyldig dato eller null
  dueDate: z.string().datetime().nullable(),

  // Tags må være en liste med ikke-tomme strenger
  tags: z.array(z.string().min(1)),
});

/**
 * Validerer body ved PATCH (delvis oppdatering av gjøremål)
 * Brukes av PATCH /v1/todos/:id
 * Alle felter er valgfrie
 */
export const todoPatchSchema = z.object({
  // Valgfri tittel
  title: z.string().min(1).optional(),

  // Valgfri done-status
  done: z.boolean().optional(),

  // Valgfri frist (dato eller null)
  dueDate: z.string().datetime().nullable().optional(),

  // Valgfrie tags
  tags: z.array(z.string().min(1)).optional(),
});
