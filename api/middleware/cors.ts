import { Request, Response, NextFunction } from 'express';

export function corsMiddleware(req: Request, res: Response, next: NextFunction) {
  // Allow specific origins in production, all in development
  const allowedOrigins = [
    'https://cryptozapdash.netlify.app',
    'https://crypto-zap-dash.vercel.app',
    'https://crypto-zap-dash.netlify.app',
    'https://cryptozapdash.vercel.app',
    'http://localhost:3000',
    'http://localhost:5000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5000',
    'http://127.0.0.1:5173'
  ];
  
  const origin = req.headers.origin;
  
  // In development, allow all origins
  const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
  const isAllowedOrigin = allowedOrigins.includes(origin) || isDevelopment;
  
  if (isAllowedOrigin) {
    res.header("Access-Control-Allow-Origin", origin);
  } else {
    // Fallback to allow all for unknown origins (helps with debugging)
    res.header("Access-Control-Allow-Origin", "*");
  }
  
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  next();
}

// For serverless environments (Vercel, etc.)
export function setCorsHeaders(res: Response, origin?: string) {
  const allowedOrigins = [
    'https://cryptozapdash.netlify.app',
    'https://crypto-zap-dash.vercel.app',
    'https://crypto-zap-dash.netlify.app',
    'https://cryptozapdash.vercel.app',
    'http://localhost:3000',
    'http://localhost:5000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5000',
    'http://127.0.0.1:5173'
  ];
  
  const requestOrigin = origin || '*';
  const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
  const isAllowedOrigin = allowedOrigins.includes(requestOrigin) || isDevelopment;
  
  if (isAllowedOrigin) {
    res.setHeader("Access-Control-Allow-Origin", requestOrigin);
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }
  
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Credentials", "true");
} 