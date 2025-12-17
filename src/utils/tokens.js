// Importerer jsonwebtoken-biblioteket som brukes til å lage og verifisere JWT
import jwt from "jsonwebtoken";

// Importerer miljøvariabler og secrets fra env.js
import { env } from "../config/env.js";

/**
 * Signerer og oppretter et access token (JWT)
 * Access token brukes for å få tilgang til beskyttede endepunkter
 * Tokenet har kort levetid av sikkerhetshensyn
 */
export function signAccessToken(payload) {
  return jwt.sign(payload, env.accessSecret, {
    expiresIn: env.accessExpiresIn,
  });
}

/**
 * Signerer og oppretter et refresh token (JWT)
 * Refresh token brukes for å hente et nytt access token når det gamle utløper
 * Tokenet har lengre levetid enn access token
 */
export function signRefreshToken(payload) {
  return jwt.sign(payload, env.refreshSecret, {
    expiresIn: env.refreshExpiresIn,
  });
}

/**
 * Verifiserer et access token
 * Sjekker at tokenet er gyldig, korrekt signert og ikke utløpt
 * Returnerer payload dersom tokenet er gyldig
 */
export function verifyAccessToken(token) {
  return jwt.verify(token, env.accessSecret);
}

/**
 * Verifiserer et refresh token
 * Brukes ved fornyelse av access token
 * Returnerer payload dersom tokenet er gyldig
 */
export function verifyRefreshToken(token) {
  return jwt.verify(token, env.refreshSecret);
}
