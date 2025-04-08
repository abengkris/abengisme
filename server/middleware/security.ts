
import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';

export const securityMiddleware = {
  setupSecurity: (app: any) => {
    // Security headers
    app.use(helmet());
    
    // CORS configuration
    app.use(cors({
      origin: process.env.NODE_ENV === 'production' 
        ? 'https://mindfulthoughts.com' 
        : 'http://localhost:5000',
      credentials: true
    }));
    
    // Rate limiting
    app.use('/api/', rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // limit each IP to 100 requests per windowMs
    }));
    
    // XSS Protection
    app.use((req: Request, res: Response, next: NextFunction) => {
      res.setHeader('X-XSS-Protection', '1; mode=block');
      next();
    });
  }
};
