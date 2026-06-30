# Linkly — Production-Ready URL Shortener

A full-stack, enterprise-grade URL shortener with analytics, built on **Next.js 15**, **Express.js**, **TypeScript**, and **MongoDB**. Fully Dockerized and deployable to **AWS ECS Fargate** via **GitHub Actions CI/CD**.

---

## Features

### URL Management
- Create short URLs with auto-generated or custom aliases
- Set expiration dates per link
- Enable / disable individual URLs
- Edit destination URL, title, and expiry
- Search, sort, and paginate URL list
- One-click copy to clipboard

### Analytics
- Track every click: browser, OS, device, IP, country, referrer
- Dashboard overview: total / today / weekly / monthly clicks
- Per-URL analytics with 30-day time-series charts
- Top performing links leaderboard
- Recent activity feed

### Authentication
- Register, login, logout
- JWT Access + Refresh Token rotation
- Secure HTTP-only cookie for refresh token
- Protected routes with auto-redirect

### Developer Experience
- Swagger / OpenAPI docs at `/api/docs`
- Pino request logging
- Centralized error handling
- Zod request validation
- TypeScript throughout
- Unit + Integration tests with Jest

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui, TanStack Query, React Hook Form, Zod, Recharts |
| Backend | Node.js, Express.js, TypeScript, Mongoose, JWT, bcrypt, Pino, Swagger, Helmet, express-rate-limit |
| Database | MongoDB |
| DevOps | Docker, Docker Compose, GitHub Actions, Amazon ECR, Amazon ECS Fargate, CloudWatch |

---

## Project Structure

```
url-shortener/
├── backend/
│   ├── src/
│   │   ├── config/          # App + environment configuration
│   │   ├── constants/       # HTTP status codes, error/success messages
│   │   ├── controllers/     # Thin HTTP handlers
│   │   ├── database/        # MongoDB connection
│   │   ├── docs/            # Swagger spec generation
│   │   ├── logger/          # Pino logger instance
│   │   ├── middleware/       # Auth, error, rate-limit, request-logger
│   │   ├── models/          # Mongoose schemas (User, Url, Click)
│   │   ├── repositories/    # Data access layer
│   │   ├── routes/          # Express route definitions
│   │   ├── services/        # Business logic layer
│   │   ├── types/           # Shared TypeScript types
│   │   ├── utilities/       # response, token, shortcode, UA parser
│   │   ├── validators/      # Zod validation schemas
│   │   ├── app.ts           # Express app setup
│   │   └── server.ts        # Entry point with graceful shutdown
│   ├── tests/
│   │   ├── unit/            # Unit tests (services, utilities)
│   │   └── integration/     # Integration tests (supertest + mongo-memory-server)
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/      # Login, Register pages
│   │   │   ├── (dashboard)/ # Protected dashboard pages
│   │   │   └── page.tsx     # Landing page
│   │   ├── components/
│   │   │   ├── features/    # URL cards, create/edit dialogs
│   │   │   ├── layout/      # Sidebar, TopNav, DashboardLayout
│   │   │   ├── shared/      # StatCard, EmptyState, ConfirmDialog
│   │   │   └── ui/          # shadcn/ui primitives
│   │   ├── hooks/           # useUrls, useAnalytics, useDebounce
│   │   ├── lib/             # axios client, API helpers, validations, utils
│   │   ├── providers/       # AuthProvider, QueryProvider, ThemeProvider
│   │   └── types/           # Shared TypeScript interfaces
│   ├── Dockerfile
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   └── package.json
│
├── .github/
│   └── workflows/
│       ├── ci.yml           # Lint, typecheck, test, build on every push/PR
│       └── cd.yml           # Build + push to ECR, deploy to ECS on main/develop
│
├── docker-compose.yml       # Production-like local stack
├── docker-compose.dev.yml   # MongoDB-only for local dev
└── README.md
```

---

## Quick Start

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- MongoDB (or use Docker)

---

### Option 1 — Docker Compose (Recommended)

```bash
# Clone the repo
git clone <repo-url> && cd url-shortener

# Copy backend env
cp backend/.env.example backend/.env
# Edit backend/.env — set strong JWT secrets

# Copy frontend env
cp frontend/.env.example frontend/.env

# Start all services (MongoDB + Backend + Frontend)
docker compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000/api |
| API Docs (Swagger) | http://localhost:5000/api/docs |
| MongoDB | localhost:27017 |

---

### Option 2 — Local Development

```bash
# 1. Start MongoDB only
docker compose -f docker-compose.dev.yml up -d

# 2. Backend
cd backend
cp .env.example .env   # Fill in values
npm install
npm run dev            # Starts on :5000

# 3. Frontend (new terminal)
cd frontend
cp .env.example .env   # Fill in values
npm install
npm run dev            # Starts on :3000
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | `development` / `production` / `test` | Yes |
| `PORT` | HTTP port (default: 5000) | No |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | ≥32 chars — sign access tokens | Yes |
| `JWT_REFRESH_SECRET` | ≥32 chars — sign refresh tokens | Yes |
| `JWT_EXPIRES_IN` | Access token TTL (default: `15m`) | No |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token TTL (default: `7d`) | No |
| `CLIENT_URL` | Frontend origin for CORS | Yes |
| `BASE_URL` | Public backend URL (used in short URLs) | Yes |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window in ms | No |
| `RATE_LIMIT_MAX` | Max requests per window | No |

### Frontend (`frontend/.env`)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL |
| `NEXT_PUBLIC_BASE_URL` | Backend base URL (for short links) |

---

## API Documentation

Full Swagger/OpenAPI documentation is available at:

```
http://localhost:5000/api/docs
```

### Endpoints Summary

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | — | Register new user |
| POST | `/api/auth/login` | — | Login |
| POST | `/api/auth/logout` | Bearer | Logout |
| POST | `/api/auth/refresh` | Cookie | Refresh access token |
| GET | `/api/auth/me` | Bearer | Current user info |
| GET | `/api/profile` | Bearer | Get profile |
| PUT | `/api/profile` | Bearer | Update profile |
| PUT | `/api/profile/password` | Bearer | Change password |
| POST | `/api/urls` | Bearer | Create short URL |
| GET | `/api/urls` | Bearer | List URLs (paginated) |
| GET | `/api/urls/:id` | Bearer | Get URL by ID |
| PUT | `/api/urls/:id` | Bearer | Update URL |
| DELETE | `/api/urls/:id` | Bearer | Delete URL |
| PATCH | `/api/urls/:id/status` | Bearer | Toggle enabled/disabled |
| GET | `/api/analytics/dashboard` | Bearer | Dashboard stats |
| GET | `/api/analytics/:id` | Bearer | URL analytics |
| GET | `/:shortCode` | — | Redirect to original URL |
| GET | `/health` | — | Health check |

---

## Testing

```bash
cd backend

# All tests
npm test

# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration

# With coverage report
npm run test:coverage
```

Integration tests use [`mongodb-memory-server`](https://github.com/nodkz/mongodb-memory-server) — no external database needed.

---

## Docker

### Build images individually

```bash
# Backend
docker build -t url-shortener-backend ./backend

# Frontend
docker build \
  --build-arg NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api \
  --build-arg NEXT_PUBLIC_BASE_URL=https://api.yourdomain.com \
  -t url-shortener-frontend ./frontend
```

### Multi-platform build for AWS (arm64/amd64)

```bash
docker buildx build --platform linux/amd64 -t url-shortener-backend:latest ./backend
```

---

## CI/CD Pipeline

### CI (`.github/workflows/ci.yml`)

Triggered on every push and pull request:

1. **Backend** — TypeScript check, ESLint, unit tests, integration tests, build
2. **Frontend** — TypeScript check, ESLint, Next.js build
3. **Docker** — Build both images (PR only, no push)

### CD (`.github/workflows/cd.yml`)

| Branch | Target |
|--------|--------|
| `develop` | Staging ECS cluster |
| `main` | Production ECS cluster |

Steps:
1. Build Docker images with SHA tag
2. Push to Amazon ECR
3. Force new ECS deployment
4. Wait for service stability
5. Automatic rollback on failure (production only)

---

## AWS Deployment

### Required GitHub Secrets

```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
PROD_API_URL          # https://api.yourdomain.com/api
PROD_BASE_URL         # https://api.yourdomain.com
STAGING_API_URL       # https://api-staging.yourdomain.com/api
STAGING_BASE_URL      # https://api-staging.yourdomain.com
```

### AWS Infrastructure Checklist

1. **ECR Repositories**
   ```bash
   aws ecr create-repository --repository-name url-shortener-backend
   aws ecr create-repository --repository-name url-shortener-frontend
   ```

2. **ECS Clusters** — `url-shortener-production` and `url-shortener-staging`

3. **Task Definitions** — Fargate tasks with env vars from AWS Secrets Manager or Parameter Store

4. **Application Load Balancer** — Route `/api/*` and `/health` to backend; all else to frontend

5. **CloudWatch Log Groups** — `/ecs/url-shortener-backend` and `/ecs/url-shortener-frontend`

6. **MongoDB Atlas** — Set `MONGODB_URI` in AWS Secrets Manager, reference in ECS task definition

### ECS Task Definition (Backend Example)

```json
{
  "family": "url-shortener-backend-production",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "<account>.dkr.ecr.us-east-1.amazonaws.com/url-shortener-backend:latest",
      "portMappings": [{ "containerPort": 5000 }],
      "environment": [
        { "name": "NODE_ENV", "value": "production" },
        { "name": "PORT", "value": "5000" }
      ],
      "secrets": [
        { "name": "MONGODB_URI", "valueFrom": "arn:aws:secretsmanager:..." },
        { "name": "JWT_SECRET", "valueFrom": "arn:aws:secretsmanager:..." },
        { "name": "JWT_REFRESH_SECRET", "valueFrom": "arn:aws:secretsmanager:..." }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/url-shortener-backend",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "node -e \"require('http').get('http://localhost:5000/health', r => process.exit(r.statusCode === 200 ? 0 : 1))\""],
        "interval": 30,
        "timeout": 10,
        "retries": 3
      }
    }
  ]
}
```

---

## Security

- **Helmet** — sets secure HTTP headers
- **CORS** — origin whitelist, credentials support
- **Rate Limiting** — global (100 req/15min), auth (10 req/15min), redirect (60 req/min)
- **JWT** — short-lived access tokens (15m) + long-lived refresh tokens (7d)
- **bcrypt** — password hashing with salt rounds = 12
- **Zod** — validates all inputs at system boundaries
- **HTTP-only cookies** — refresh tokens never accessible from JavaScript
- **Non-root Docker user** — containers run as `nodejs`/`nextjs` user
- **Input length limits** — express.json body limited to 10KB

---

## Architecture

```
┌──────────────────────────────────────┐
│           Next.js Frontend           │
│  (App Router · shadcn/ui · TanStack) │
└──────────────┬───────────────────────┘
               │ HTTPS / REST
┌──────────────▼───────────────────────┐
│        Application Load Balancer     │
│  /api/* → Backend  │ /* → Frontend   │
└──────┬────────────────────┬──────────┘
       │                    │
┌──────▼──────┐    ┌────────▼────────┐
│   Backend   │    │    Frontend     │
│ (ECS/Fargate│    │  (ECS/Fargate)  │
│  :5000)     │    │    :3000)       │
└──────┬──────┘    └─────────────────┘
       │
┌──────▼──────┐
│ MongoDB     │
│ (Atlas /    │
│  self-host) │
└─────────────┘
```

---

## License

MIT
