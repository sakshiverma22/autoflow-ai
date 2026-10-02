import "dotenv/config";
import cors from "cors";
import express from "express";
import authRoutes from "./routes/authRoutes.js";
import workflowRoutes from "./routes/workflowRoutes.js";

const app = express();
const port = process.env.PORT || 5050;

app.use(cors({
  origin(origin, callback) {
    const allowedOrigins = new Set([
      "http://127.0.0.1:5173",
      "http://127.0.0.1:5174",
      "http://localhost:5173",
      "http://localhost:5174",
      "https://autoflow-ai-frontend.vercel.app"
    ]);

    if (!origin || allowedOrigins.has(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  }
}));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "AutoFlow AI API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/workflows", workflowRoutes);

app.listen(port, () => {
  console.log(`AutoFlow AI API running on http://127.0.0.1:${port}`);
});
