import { verifyAccessToken } from "../utils/tokens.js";
import { activeSessions } from "../data/store.js";

export function requireAuth(req, res, next) {
  const authHeader = req.header("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      error: {
        code: "UNAUTHORIZED",
        message: "Missing Authorization Bearer token",
      },
    });
  }

  const token = authHeader.slice("Bearer ".length);

  try {
    const payload = verifyAccessToken(token);

    // Sjekk at session (sid) fortsatt er aktiv
    if (!activeSessions.has(payload.sid)) {
      return res.status(401).json({
        error: { code: "UNAUTHORIZED", message: "Session not active" },
      });
    }

    req.user = payload; // legg payload på req.user (som oppgaven sier)
    next();
  } catch {
    return res.status(401).json({
      error: { code: "UNAUTHORIZED", message: "Invalid access token" },
    });
  }
}
