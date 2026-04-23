# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A business document editor with an AI chat assistant. Users create folders → documents → sections, then use a chat panel to get AI help writing and refining those sections. The AI is powered by AWS Bedrock (Claude 3.5 Sonnet via the Converse API).

## Monorepo Structure

npm workspaces: `frontend` (React + Vite) and `backend` (NestJS + Prisma + PostgreSQL).

All dev commands run from the repo root. Workspace-scoped commands use `-w frontend` / `-w backend`.

## Commands

```bash
# Start both frontend (port 5173) and backend (port 3001) with hot reload
npm run dev

# Run backend only
npm run dev:backend

# Run frontend only
npm run dev:frontend

# Backend unit tests
npm run test -w backend

# Run a single backend test file
npx jest --testPathPattern=chat.service -w backend

# Backend lint
npm run lint -w backend

# Build both
npm run build

# Start local Postgres only (Docker)
npm run docker:db

# Prisma: push schema changes (dev), generate client
npm run db:push -w backend
npm run db:generate -w backend

# E2E tests (requires both servers running on port 3002)
npm run e2e:backend   # starts backend on 3002
npm run e2e:frontend  # starts frontend pointed at 3002
npm run test:e2e      # runs Playwright
```

## Backend Architecture

NestJS app with a global `/api` prefix. Modules map 1:1 to resource types:

```
AppModule
  ├── PrismaModule      (global — injected everywhere)
  ├── FoldersModule
  ├── DocumentsModule
  ├── SectionsModule
  ├── ChatModule ──────── imports AiModule
  └── AiModule
        └── BedrockService
```

**Data model** (Prisma, PostgreSQL):
```
Folder → Document → Section   (all cascade-delete)
              └──→ ChatMessage
```

`ChatMessage.role` is `user | ai`. `Section.status` is `empty | writing | done`.

**AI flow** (`ChatModule` → `AiModule`):
1. `ChatController` receives `POST /api/documents/:id/chat/messages`
2. `ChatService` saves the user message, loads the document's sections and last 20 chat messages from DB
3. `prompt.builder.ts` constructs the system prompt (sections as context) and formats history for the Converse API
4. `BedrockService.converse()` calls AWS Bedrock synchronously and returns the text response
5. `ChatService` saves the AI reply and returns `{ userMessage, aiMessage }`

Bedrock credentials come from env vars: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `BEDROCK_MODEL_ID`.

## Frontend Architecture

Single-page React app. All state lives in Redux (RTK). The component tree is flat — `App.tsx` renders `Topbar`, `Sidebar`, `Editor`, `ChatPanel` side by side.

**State and data fetching:**
- `useDocStore` (hook) is the single integration point between RTK Query API calls and Redux UI state — all components get props from here via `App.tsx`
- RTK Query is configured in `frontend/src/api/base-slice.ts` using a data-driven pattern: endpoint definitions live in `api/api-details/` as plain objects (`getUrl`, `method`, `transformResponse`, `invalidatesTags`), and `base-slice.ts` loops over them to build the API slice dynamically
- `uiSlice` tracks `activeDocumentId` + `activeFolderId`
- `chatSlice` tracks the text input and any optimistic local messages

**API base URL**: `VITE_API_URL` env var, defaults to `http://localhost:3001`.

> Note: `useDocStore` currently injects a hardcoded mock AI message after `sendMessageMutation` resolves. This will be removed once the frontend is updated to read the AI reply from the API response.

## Environment Variables

Backend (`backend/.env`, see `backend/.env.example`):
```
DATABASE_URL
PORT
FRONTEND_URL
AWS_REGION
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
BEDROCK_MODEL_ID
```

Frontend (`frontend/.env`):
```
VITE_API_URL
```

## Production Deployment

Docker Compose (`docker-compose.prod.yml`) runs `postgres`, `backend`, and `nginx` (serves the built React SPA and proxies `/api` to the backend). The frontend can also be deployed statically to S3 + CloudFront via `npm run aws:s3:sync`.
