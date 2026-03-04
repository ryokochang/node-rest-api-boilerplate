# ⚡ node-rest-api-boilerplate

![Node.js](https://img.shields.io/badge/Node.js-20-6EBF20?style=flat&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?style=flat&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-7-DC382D?style=flat&logo=redis&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?style=flat&logo=express&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green?style=flat)

A production-ready **Node.js + TypeScript REST API boilerplate** with JWT authentication, Redis caching, MongoDB, rate limiting, Swagger docs, and Docker support. Follows clean architecture with a strict separation between controllers, services, and repositories.

---

## ✨ Features

- 🔐 **JWT Authentication** — Access & refresh token flow with httpOnly cookie storage
- 🗄️ **MongoDB + Mongoose** — Repository pattern for clean, testable data access
- ⚡ **Redis Caching** — Response caching and rate limit state management
- 🚦 **Rate Limiting** — Per-route and global rate limiting via `express-rate-limit` + Redis
- 📖 **Swagger / OpenAPI** — Auto-generated API docs at `/api/docs`
- 🏗️ **Clean Architecture** — Controllers → Services → Repositories separation of concerns
- 🛡️ **Security Middleware** — Helmet, CORS, input sanitization, request validation (Zod)
- 🧪 **Testing** — Unit and integration tests with Jest & Supertest
- 🐳 **Docker** — Full Docker Compose setup for local development
- 📋 **Logging** — Structured logging with Winston + Morgan HTTP logger

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 20, TypeScript 5 |
| Framework | Express 4 |
| Database | MongoDB 7 (Mongoose ODM) |
| Cache | Redis 7 |
| Auth | JWT (access + refresh tokens), bcrypt |
| Validation | Zod |
| Docs | Swagger UI, swagger-jsdoc |
| Testing | Jest, Supertest |
| Logging | Winston, Morgan |
| DevOps | Docker, Docker Compose, GitHub Actions |

---

## 📁 Project Structure

```
node-rest-api-boilerplate/
├── src/
│   ├── config/               # DB, Redis, and environment configs
│   │   ├── db.ts
│   │   ├── redis.ts
│   │   └── env.ts
│   ├── controllers/          # Route handlers (thin layer, delegates to services)
│   │   ├── auth.controller.ts
│   │   └── user.controller.ts
│   ├── middleware/           # Auth, rate limiting, error handling
│   │   ├── authenticate.ts
│   │   ├── rateLimiter.ts
│   │   ├── validate.ts
│   │   └── errorHandler.ts
│   ├── models/               # Mongoose schemas
│   │   └── User.ts
│   ├── repositories/         # Data access layer (MongoDB queries)
│   │   └── user.repository.ts
│   ├── routes/               # API route definitions
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   └── index.ts
│   ├── services/             # Business logic layer
│   │   ├── auth.service.ts
│   │   └── user.service.ts
│   ├── types/                # TypeScript interfaces and types
│   │   └── index.ts
│   ├── utils/                # Shared utilities (token helpers, logger, etc.)
│   │   ├── jwt.ts
│   │   └── logger.ts
│   └── app.ts                # Express app setup and middleware registration
├── tests/
│   ├── unit/                 # Service and utility unit tests
│   └── integration/          # Route-level integration tests
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── tsconfig.json
├── jest.config.ts
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- MongoDB 7+
- Redis 7+
- Docker (optional)

### Installation

```bash
# Clone the repository
git clone https://github.com/ryokochang/node-rest-api-boilerplate.git
cd node-rest-api-boilerplate

# Install dependencies
npm install
```

### Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

```env
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb://localhost:27017/api-boilerplate

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# CORS
CLIENT_URL=http://localhost:3000
```

### Running Locally

```bash
# Using Docker Compose (recommended)
docker-compose up --build

# Or manually:
npm run dev
```

API will be available at **http://localhost:5000**
Swagger docs at **http://localhost:5000/api/docs**

---

## 📡 API Reference

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/auth/register` | Register a new user | ❌ |
| POST | `/api/v1/auth/login` | Login & receive tokens | ❌ |
| POST | `/api/v1/auth/refresh` | Refresh access token | ✅ |
| POST | `/api/v1/auth/logout` | Invalidate refresh token | ✅ |
| GET | `/api/v1/users` | List all users | Admin |
| GET | `/api/v1/users/:id` | Get user by ID | ✅ |
| PUT | `/api/v1/users/:id` | Update user | ✅ |
| DELETE | `/api/v1/users/:id` | Delete user | Admin |

Full schema and request/response examples available via Swagger at `/api/docs`.

---

## 🔐 Authentication Flow

```
1. Client POST /api/v1/auth/login
2. Server validates credentials → returns { accessToken } + sets refreshToken in httpOnly cookie
3. Client includes Authorization: Bearer <accessToken> on each request
4. On 401 → client calls POST /api/v1/auth/refresh (cookie sent automatically)
5. Server validates refresh token → issues new accessToken
6. On logout → refresh token is revoked in Redis
```

---

## 🏗️ Architecture

This boilerplate enforces a strict three-layer architecture:

```
Request → Controller → Service → Repository → MongoDB
                  ↕
               Redis (cache / rate limit)
```

- **Controllers** handle HTTP request/response only — no business logic
- **Services** contain all business logic and call repositories
- **Repositories** are the only layer that touches the database

---

## 🧪 Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

---

## ☁️ Deployment

### AWS (ECS + ECR)
```bash
docker build -t node-rest-api .
aws ecr get-login-password | docker login --username AWS --password-stdin <ECR_URI>
docker tag node-rest-api:latest <ECR_URI>/node-rest-api:latest
docker push <ECR_URI>/node-rest-api:latest
```

### GCP (Cloud Run)
```bash
gcloud builds submit --tag gcr.io/<PROJECT_ID>/node-rest-api .
gcloud run deploy node-rest-api --image gcr.io/<PROJECT_ID>/node-rest-api --platform managed
```

---

## 🗺️ Roadmap

- [ ] Role-based access control (RBAC) with permission guards
- [ ] Email verification flow (Nodemailer / SendGrid)
- [ ] Password reset with expiring tokens
- [ ] API key authentication (for service-to-service)
- [ ] Pagination and cursor-based queries
- [ ] Audit log middleware

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

1. Fork the repo
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<p align="center">Built with ❤️ by <a href="https://github.com/ryokochang">Alex Chang</a></p>
