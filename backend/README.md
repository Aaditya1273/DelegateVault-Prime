# DelegateVault Prime - Backend API

Express.js + TypeScript + Prisma + PostgreSQL backend for DelegateVault Prime.

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- pnpm (or npm)
- PostgreSQL 16 (or use Docker)
- Redis (optional, for caching)

### Installation

1. **Install dependencies**:
```bash
cd backend
npm install
```

2. **Set up environment variables**:
```bash
# Copy example env file
copy env.example .env

# Edit .env and add your values
```

3. **Start PostgreSQL** (using Docker):
```bash
# From project root
docker-compose up postgres -d
```

Or install PostgreSQL locally and create database:
```sql
CREATE DATABASE delegatevault;
```

4. **Run database migrations**:
```bash
npx prisma migrate dev --name init
```

5. **Generate Prisma Client**:
```bash
npx prisma generate
```

6. **Start development server**:
```bash
npm run dev
```

Server will start on `http://localhost:3001`

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration
│   ├── routes/          # API routes
│   ├── controllers/     # Business logic
│   ├── services/        # Core services
│   ├── models/          # Data models
│   ├── middleware/      # Express middleware
│   ├── utils/           # Helper functions
│   ├── app.ts           # Express app setup
│   └── server.ts        # Server entry point
├── prisma/
│   └── schema.prisma    # Database schema
├── package.json
├── tsconfig.json
└── Dockerfile
```

## 🔌 API Endpoints

### Health Check
- `GET /api/health` - Service health status

### Vaults
- `GET /api/v1/vaults` - List all vaults
- `GET /api/v1/vaults/:address` - Get vault details
- `POST /api/v1/vaults` - Create new vault
- `PUT /api/v1/vaults/:address` - Update vault
- `GET /api/v1/vaults/:address/positions` - Get vault positions

### Delegations
- `GET /api/v1/delegations/:owner` - Get delegations by owner
- `POST /api/v1/delegations` - Create delegation
- `DELETE /api/v1/delegations/:id` - Revoke delegation

### Users
- `GET /api/v1/users/:address` - Get user profile
- `POST /api/v1/users` - Create user
- `PUT /api/v1/users/:address` - Update user

### Circles
- `GET /api/v1/circles` - List all circles
- `GET /api/v1/circles/:id` - Get circle details
- `POST /api/v1/circles` - Create circle

### Analytics
- `GET /api/v1/analytics/metrics` - Get overall metrics
- `GET /api/v1/analytics/user-growth` - Get user growth data

## 🗄️ Database

### Prisma Commands

```bash
# Create migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate

# Open Prisma Studio (GUI)
npx prisma studio

# Reset database
npx prisma migrate reset
```

### Database Schema

Main tables:
- `Vault` - Vault contracts
- `Position` - User positions in vaults
- `Delegation` - Delegation records
- `User` - User profiles
- `Circle` - Social circles
- `AIStrategy` - AI strategies
- `VaultEvent` - Blockchain events

## 🧪 Testing

```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

## 🐳 Docker

### Using Docker Compose (Recommended)

```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f backend
```

### Build Docker Image

```bash
docker build -t delegatevault-backend .
docker run -p 3001:3001 delegatevault-backend
```

## 🔧 Development

### Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix linting issues

### Environment Variables

Required:
- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 3001)

Optional:
- `REDIS_URL` - Redis connection string
- `IPFS_HOST` - IPFS host
- `MONAD_RPC_URL` - Monad RPC endpoint
- `AI_SERVICE_URL` - AI service URL

## 📝 Next Steps

After Phase 1 is complete, proceed to:
- **Phase 2**: AI & Automation Layer
- **Phase 3**: ZK Proofs & Privacy
- **Phase 4**: Social & Viral Features

See `docs/SPEC-PHASE2.md` for next steps.

## 🆘 Troubleshooting

### Database Connection Failed
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Restart PostgreSQL
docker-compose restart postgres
```

### Prisma Client Not Generated
```bash
npx prisma generate
```

### Port Already in Use
```bash
# Change PORT in .env file
PORT=3002
```

## 📄 License

MIT
