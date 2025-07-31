import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import path from "path";

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS for Vercel
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
});

// Register all API routes
(async () => {
  try {
    await registerRoutes(app);
  } catch (error) {
    console.error("Failed to register routes:", error);
  }
})();

// Serve static files for production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("dist"));
  app.get("*", (req, res) => {
    res.sendFile(path.join(process.cwd(), "dist/index.html"));
  });
}

// Error handling middleware (must be last)
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Server error:", err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({ 
    message,
    error: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
});
