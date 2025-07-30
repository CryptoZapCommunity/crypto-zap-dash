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
  next();
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Initialize routes
(async () => {
  try {
    const server = await registerRoutes(app);

    // Serve static files in production
    if (process.env.NODE_ENV === "production") {
      app.use(express.static("dist/public"));
      app.get("*", (req, res) => {
        res.sendFile(path.join(process.cwd(), "dist/public/index.html"));
      });
    }

    const port = parseInt(process.env.PORT || "3000", 10);
    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();
