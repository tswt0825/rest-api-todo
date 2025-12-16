import "dotenv/config";

export const env = {
  port: process.env.PORT ?? 3000, // Hvis PORT ikke er satt, bruk 3000

  accessSecret: process.env.JWT_ACCESS_SECRET, // Hemmelig nøkkel for å signere access tokens
  refreshSecret: process.env.JWT_REFRESH_SECRET,

  accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? "15m",
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? "7d",
};

if (!env.accessSecret || !env.refreshSecret) {
  throw new Error("Missing JWT secrets. Check your .env file.");
}
