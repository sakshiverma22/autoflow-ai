import { db } from "../database/store.js";
import { verifyToken } from "../services/tokenService.js";

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Missing auth token" });
  }

  try {
    const payload = verifyToken(token);
    const user = db.users.find((item) => item.id === payload.id);
    if (!user) return res.status(401).json({ message: "Invalid user" });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}
