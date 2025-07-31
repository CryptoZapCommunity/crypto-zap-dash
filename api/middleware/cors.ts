import { Request, Response, NextFunction } from 'express';

export function corsMiddleware(req: Request, res: Response, next: NextFunction) {
  // Allow specific origins in production, all in development
  const allowedOrigins = [
    'https://cryptozapdash.netlify.app',
    'https://crypto-zap-dash.vercel.app',
    'http://localhost:3000',
    'http://localhost:5000'
  ];
  
  const origin = req.headers.origin;
  const isAllowedOrigin = allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development';
  
  if (isAllowedOrigin) {
    res.header("Access-Control-Allow-Origin", origin);
  } else {
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
    'http://localhost:3000',
    'http://localhost:5000'
  ];
  
  const requestOrigin = origin || '*';
  const isAllowedOrigin = allowedOrigins.includes(requestOrigin) || process.env.NODE_ENV === 'development';
  
  if (isAllowedOrigin) {
    res.setHeader("Access-Control-Allow-Origin", requestOrigin);
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }
  
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Credentials", "true");
} 