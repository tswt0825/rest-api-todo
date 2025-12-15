import { ZodError } from "zod";

/**
 * validate({ body, params, query })
 * - Validerer request med Zod
 * - Legger resultatet i req.validated (uten å overskrive req.query/req.params)
 * - Returnerer 422 ved valideringsfeil
 */
export function validate({ body, params, query } = {}) {
  return (req, res, next) => {
    try {
      req.validated = req.validated ?? {};

      if (body) req.validated.body = body.parse(req.body);
      if (params) req.validated.params = params.parse(req.params);
      if (query) req.validated.query = query.parse(req.query);

      return next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(422).json({
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid request",
            details: err.issues.map((i) => ({
              path: i.path,
              message: i.message,
            })),
          },
        });
      }

      return next(err);
    }
  };
}
