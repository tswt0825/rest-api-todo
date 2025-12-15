import { v4 as uuid } from "uuid";
import { activeSessions } from "../../data/store.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../utils/tokens.js";

const USERS = [{ username: "therese", password: "1234" }];

export function login(req, res) {
  console.log("LOGIN ROUTE HIT", req.body);

  const { username, password } = req.body ?? {};

  const user = USERS.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({
      error: { code: "UNAUTHORIZED", message: "Wrong username/password" },
    });
  }

  const sid = uuid();
  activeSessions.add(sid);

  const payload = { sub: user.username, sid };

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  return res.status(200).json({ accessToken, refreshToken });
}

export function refresh(req, res) {
  const refreshToken = req.header("X-RefreshToken");

  if (!refreshToken) {
    return res.status(401).json({
      error: { code: "UNAUTHORIZED", message: "Missing X-RefreshToken" },
    });
  }

  try {
    const payload = verifyRefreshToken(refreshToken);

    if (!activeSessions.has(payload.sid)) {
      return res.status(401).json({
        error: { code: "UNAUTHORIZED", message: "Session not active" },
      });
    }

    const accessToken = signAccessToken({ sub: payload.sub, sid: payload.sid });
    return res.status(200).json({ accessToken });
  } catch {
    return res.status(401).json({
      error: { code: "UNAUTHORIZED", message: "Invalid refresh token" },
    });
  }
}

export function logout(req, res) {
  const refreshToken = req.header("X-RefreshToken");
  const authHeader = req.header("Authorization");

  if (!refreshToken || !authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      error: {
        code: "UNAUTHORIZED",
        message: "Missing Authorization and/or X-RefreshToken",
      },
    });
  }

  try {
    const payload = verifyRefreshToken(refreshToken);
    activeSessions.delete(payload.sid);
    return res.status(204).send();
  } catch {
    return res.status(401).json({
      error: { code: "UNAUTHORIZED", message: "Invalid refresh token" },
    });
  }
}
