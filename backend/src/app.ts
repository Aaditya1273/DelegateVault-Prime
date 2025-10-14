import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { config } from './config';

// Import routes
import healthRouter from './routes/health';
import vaultsRouter from './routes/vaults';
import delegationsRouter from './routes/delegations';
import usersRouter from './routes/users';
import circlesRouter from './routes/circles';
import analyticsRouter from './routes/analytics';
import aiRouter from './routes/ai';

const app: Application = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.env === 'production' 
    ? ['https://delegatevault.xyz', 'https://www.delegatevault.xyz']
    : '*',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.security.rateLimitWindowMs,
  max: config.security.rateLimitMaxRequests,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Logging
if (config.env === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Routes
app.use('/api/health', healthRouter);
app.use(`/api/${config.apiVersion}/vaults`, vaultsRouter);
app.use(`/api/${config.apiVersion}/delegations`, delegationsRouter);
app.use(`/api/${config.apiVersion}/users`, usersRouter);
app.use(`/api/${config.apiVersion}/circles`, circlesRouter);
app.use(`/api/${config.apiVersion}/analytics`, analyticsRouter);
app.use(`/api/${config.apiVersion}/ai`, aiRouter);

// Root route
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'DelegateVault Prime API',
    version: config.apiVersion,
    status: 'running',
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);
  
  res.status(500).json({
    error: 'Internal Server Error',
    message: config.env === 'development' ? err.message : 'Something went wrong',
    ...(config.env === 'development' && { stack: err.stack }),
  });
});

export default app;
