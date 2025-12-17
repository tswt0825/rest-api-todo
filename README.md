# REST API – Gjøremål (Todo)

Dette prosjektet er et REST-ful API bygget med **Node.js + Express (ESM)**.
API-et er laget for backend-til-backend-kommunikasjon og bruker JWT for autentisering.

## 🚀 Kom i gang

### Installer avhengigheter

```bash
npm install
```

Start server
npm run dev

Serveren starter på:

http://localhost:3000

Autentisering

API-et bruker JWT med access token og refresh token.

Headers
Header Beskrivelse
Authorization Bearer <accessToken>
X-RefreshToken <refreshToken>
Endepunkter

POST /v1/auth/login

GET /v1/auth/refresh

POST /v1/auth/logout

Health check
GET /v1/health

Respons:

{ "ok": true }
