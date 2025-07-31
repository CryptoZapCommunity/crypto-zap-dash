import { Request, Response, NextFunction } from 'express';

export function corsMiddleware(req: Request, res: Response, next: NextFunction) {
  // Allow specific origins in production, all in development
  const allowedOrigins = [
    'https://cryptozapdash.netlify.app',
    'https://crypto-zap-dash.netlify.app',
    'https://crypto-zap-dash.vercel.app',
    'https://cryptozapdash.vercel.app',
    'https://cryptozapdash-api.vercel.app',
    'https://crypto-zap-dash-client-a5uo2.vercel.app',
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
  
  // Always set CORS headers
  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
  } else if (isDevelopment) {
    // In development, allow the requesting origin
    res.header("Access-Control-Allow-Origin", origin || "*");
    res.header("Access-Control-Allow-Credentials", origin ? "true" : "false");
  } else {
    // Production fallback - allow all but no credentials
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "false");
  }
  
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD");
  res.header("Access-Control-Max-Age", "86400"); // 24 hours
  
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
    'https://crypto-zap-dash.netlify.app',
    'https://crypto-zap-dash.vercel.app',
    'https://cryptozapdash.vercel.app',
    'https://cryptozapdash-api.vercel.app',
    'https://crypto-zap-dash-client-a5uo2.vercel.app',
    'http://localhost:3000',
    'http://localhost:5000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5000',
    'http://127.0.0.1:5173'
  ];
  
  const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
  
  // Always set CORS headers correctly
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  } else if (isDevelopment && origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  } else {
    // Production fallback - allow all but no credentials
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "false");
  }
  
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD");
  res.setHeader("Access-Control-Max-Age", "86400");
} 