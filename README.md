# Business AI — Document Editor

An AI-powered business document editor with folder management, section-based editing, and chat assistance.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Redux Toolkit |
| Backend | NestJS, TypeScript, Prisma ORM |
| Database | PostgreSQL 16 |
| Reverse proxy | Nginx |
| Containerisation | Docker, Docker Compose |

## Project Structure

```
business-ai/
├── frontend/                   # React + Vite app (port 5173 in dev)
│   └── src/
│       ├── components/         # UI components (Sidebar, Editor, Chat, Layout)
│       ├── hooks/              # useDocStore — Redux-backed state hook
│       ├── store/              # Redux slices (docSlice, chatSlice)
│       ├── types/              # Shared TypeScript interfaces
│       └── data/               # Mock seed data
│
├── backend/                    # NestJS API (port 3001 in dev)
│   ├── src/
│   │   ├── folders/            # GET/POST/PATCH/DELETE /api/folders
│   │   ├── documents/          # GET/POST/PATCH/DELETE /api/folders/:id/documents
│   │   ├── chat/               # GET/POST/DELETE /api/documents/:id/chat
│   │   └── prisma/             # PrismaService + PrismaModule (global)
│   ├── prisma/
│   │   └── schema.prisma       # Database schema
│   ├── Dockerfile              # Multi-stage production build
│   └── entrypoint.sh           # Runs migrations then starts server
│
├── nginx/
│   ├── Dockerfile              # Builds frontend, serves with nginx
│   └── nginx.conf              # SPA routing + proxies /api → backend
│
├── docker-compose.yml          # Local dev — Postgres only
└── docker-compose.prod.yml     # Production — Postgres + Backend + Nginx
```

## Database Schema

```
Folder ──< Document ──< Section
                   └──< ChatMessage
```

- Deleting a folder cascades to its documents, sections, and chat messages
- Chat messages are scoped per document

## Getting Started

### Prerequisites

- Node.js 20+
- Docker (for the database)

### Local Development

**1. Install dependencies**

```bash
npm install
```

**2. Start the database**

```bash
npm run docker:db
```

**3. Set up the backend environment**

```bash
cp backend/.env.example backend/.env
```

The default `.env` works with the Docker Postgres out of the box:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/business_ai?schema=public"
PORT=3001
```

**4. Run database migrations**

```bash
npm run db:migrate -w backend
```

**5. Start frontend and backend**

```bash
npm run dev
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3001/api |
| Prisma Studio | `npm run db:studio -w backend` |

---

## API Reference

### Folders

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/folders` | List all folders (includes documents) |
| GET | `/api/folders/:id` | Get a folder |
| POST | `/api/folders` | Create a folder |
| PATCH | `/api/folders/:id` | Rename a folder |
| DELETE | `/api/folders/:id` | Delete a folder (cascades) |

### Documents

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/folders/:folderId/documents` | List documents in a folder |
| GET | `/api/folders/:folderId/documents/:id` | Get a document with sections |
| POST | `/api/folders/:folderId/documents` | Create a document |
| PATCH | `/api/folders/:folderId/documents/:id` | Update a document |
| DELETE | `/api/folders/:folderId/documents/:id` | Delete a document (cascades) |

### Chat

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/documents/:documentId/chat` | List messages for a document |
| POST | `/api/documents/:documentId/chat/messages` | Send a message |
| DELETE | `/api/documents/:documentId/chat/messages` | Clear chat history |

---

## Scripts

### Development

| Script | Description |
|---|---|
| `npm run dev` | Start frontend + backend with hot reload |
| `npm run dev:frontend` | Frontend only |
| `npm run dev:backend` | Backend only |

### Database

| Script | Description |
|---|---|
| `npm run db:migrate -w backend` | Create and apply a new migration |
| `npm run db:push -w backend` | Push schema changes without a migration file |
| `npm run db:generate -w backend` | Regenerate Prisma client after schema changes |
| `npm run db:studio -w backend` | Open Prisma Studio (visual DB browser) |

### Docker

| Script | Description |
|---|---|
| `npm run docker:db` | Start local Postgres only |
| `npm run docker:up` | Build and start all services (prod stack) |
| `npm run docker:down` | Stop all containers |
| `npm run docker:backend` | Build and start Postgres + Backend |
| `npm run docker:frontend` | Build and start Nginx + Frontend |
| `npm run docker:logs` | Stream logs from all services |
| `npm run docker:logs:backend` | Stream backend logs |
| `npm run docker:logs:frontend` | Stream nginx logs |
| `npm run docker:restart:backend` | Restart backend container |
| `npm run docker:restart:frontend` | Restart nginx container |

---

## Deployment (AWS EC2)

### 1. Launch EC2

- AMI: Ubuntu 24.04 LTS
- Instance type: t3.small (recommended) or t2.micro (free tier)
- Security group inbound rules:

| Port | Source | Purpose |
|---|---|---|
| 22 | Your IP | SSH |
| 80 | 0.0.0.0/0 | HTTP |

### 2. Install Docker on the instance

```bash
sudo apt update && sudo apt install -y docker.io docker-compose-plugin
sudo usermod -aG docker ubuntu
newgrp docker
```

### 3. Clone and configure

```bash
git clone <your-repo-url> && cd business-ai

cp .env.production.example .env
nano .env   # set a strong POSTGRES_PASSWORD
```

`.env` on EC2:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_strong_password_here
POSTGRES_DB=business_ai
```

### 4. Deploy

```bash
npm run docker:up
```

This builds all images, runs database migrations automatically, and starts every service. The app will be available at `http://<EC2-public-IP>`.

### Subsequent deployments

```bash
git pull
npm run docker:up   # rebuilds changed images and restarts affected containers
```

### Subdomain + CloudFront + S3 (Static Frontend)

If you already have an S3 bucket and want to serve the frontend from a subdomain (for example, `app.example.com`) behind CloudFront:

**Prerequisites**

- AWS CLI configured (`aws configure`)
- Existing S3 bucket (for static files)
- Route53 hosted zone ID for your domain
- ACM certificate in `us-east-1` that includes your subdomain

**1. Create/attach CloudFront + DNS to subdomain**

```bash
npm run aws:cloudfront:setup -- \
  --subdomain app.example.com \
  --bucket your-existing-bucket \
  --hosted-zone-id Z1234567890ABC \
  --acm-cert-arn arn:aws:acm:us-east-1:123456789012:certificate/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

This command:

- Creates (or reuses) a CloudFront Origin Access Control (OAC)
- Creates (or reuses) a CloudFront distribution for your subdomain
- Applies an S3 bucket policy allowing CloudFront read access
- Upserts Route53 `A` + `AAAA` alias records to CloudFront

**2. Build and sync frontend to S3**

```bash
npm run aws:s3:sync -- \
  --bucket your-existing-bucket \
  --distribution-id E123ABC456XYZ
```

Optional:

- `--skip-build` to upload an already-built `frontend/dist`
- `--build-dir <path>` for a custom build output directory
- `--profile <aws-profile>` to use a non-default AWS CLI profile

### Architecture on EC2

```
Internet → EC2:80 → Nginx → /api/* → Backend:3001 → Postgres:5432
                         → /*     → React SPA (static files)
```

Postgres is never exposed publicly — it is only reachable from inside the Docker network.
