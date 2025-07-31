import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes.js";
import { corsMiddleware } from "./middleware/cors.js";
import path from "path";

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enhanced CORS configuration
app.use(corsMiddleware);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    cors: "enabled",
    origin: req.headers.origin,
    host: req.headers.host,
    userAgent: req.headers['user-agent']
  });
});

// CORS test endpoint
app.get("/api/cors-test", (req, res) => {
  res.json({
    success: true,
    message: "CORS is working correctly!",
    origin: req.headers.origin,
    timestamp: new Date().toISOString(),
    headers: {
      'access-control-allow-origin': res.getHeader('Access-Control-Allow-Origin'),
      'access-control-allow-credentials': res.getHeader('Access-Control-Allow-Credentials'),
      'access-control-allow-methods': res.getHeader('Access-Control-Allow-Methods')
    }
  });
});

// CORS preflight test
app.options("/api/cors-test", (req, res) => {
  res.status(200).json({ message: "Preflight successful" });
});

// Register all API routes synchronously
registerRoutes(app).catch(error => {
  console.error("Failed to register routes:", error);
});

// Serve static files from client/dist
app.use(express.static("client/dist"));

// Serve frontend for all non-API routes
app.get("*", (req, res) => {
  res.sendFile(path.join(process.cwd(), "client/dist/index.html"));
});

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

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🖥️ Frontend: http://localhost:${PORT}`);
});

export default app;
