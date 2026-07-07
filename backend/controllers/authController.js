import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
import { db } from "../database/store.js";
import { signToken } from "../services/tokenService.js";

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export async function register(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }

  const existing = db.users.find((user) => user.email.toLowerCase() === email.toLowerCase());
  if (existing) return res.status(409).json({ message: "Email is already registered" });

  const user = {
    id: uuid(),
    name,
    email: email.toLowerCase(),
    password: await bcrypt.hash(password, 10),
    role: "Operator"
  };

  db.users.push(user);
  res.status(201).json({ user: publicUser(user), token: signToken(user) });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = db.users.find((item) => item.email.toLowerCase() === String(email).toLowerCase());
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  res.json({ user: publicUser(user), token: signToken(user) });
}

export function me(req, res) {
  res.json({ user: publicUser(req.user) });
}
