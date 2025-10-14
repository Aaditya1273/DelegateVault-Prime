import dotenv from 'dotenv';

dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001', 10),
  apiVersion: process.env.API_VERSION || 'v1',
  
  database: {
    url: process.env.DATABASE_URL || '',
  },
  
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  
  ipfs: {
    host: process.env.IPFS_HOST || 'localhost',
    port: parseInt(process.env.IPFS_PORT || '5001', 10),
    protocol: process.env.IPFS_PROTOCOL || 'http',
  },
  
  blockchain: {
    rpcUrl: process.env.MONAD_RPC_URL || 'https://testnet-rpc.monad.xyz',
    chainId: parseInt(process.env.CHAIN_ID || '10143', 10),
    privateKey: process.env.PRIVATE_KEY || '',
  },
  
  envio: {
    hyperSyncUrl: process.env.ENVIO_HYPERSYNC_URL || '',
    apiKey: process.env.ENVIO_API_KEY || '',
  },
  
  aiService: {
    url: process.env.AI_SERVICE_URL || 'http://localhost:8000',
  },
  
  security: {
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
  
  monitoring: {
    sentryDsn: process.env.SENTRY_DSN || '',
  },
};

export default config;
