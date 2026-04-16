# Lyrics Client

Frontend application for the Lyrics app, built with React, TypeScript, Vite, and React Router.

## Features

- Authentication flow (signup, login, logout, session restoration)
- Browse translations with pagination
- View a single translation
- Protected create/edit/delete translation actions
- Language list integration from backend API
- Route-level 404 handling and guarded routes

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- Axios
- Sass

## Prerequisites

- Node.js 18+ (Node.js 20+ recommended)
- npm
- Running backend API (`lyrics-server`)

## Environment Variables

Create a `.env` file in `lyrics-client/`:

```bash
VITE_API_URL=http://localhost:7777/api
```

If not provided, the app defaults to `http://localhost:7777/api`.

## Getting Started

From `lyrics-client/`:

```bash
npm install
npm run dev
```

Vite will print a local URL (usually `http://localhost:5173`).

## Available Scripts

- `npm run dev` - start local development server
- `npm run build` - type-check and build production assets
- `npm run preview` - preview the production build locally
- `npm run lint` - run ESLint

## Project Structure

Key folders in `src/`:

- `pages/` - route-level screens (home, login, signup, translation pages)
- `components/` - reusable UI components (navbar, route guards, shared UI)
- `services/` - API client and request helpers
- `contexts/` - auth state and provider logic
- `hooks/` - reusable hooks
- `types/` - shared TypeScript types
- `styles/` - shared styling assets

## Routing Overview

Public routes:

- `/`
- `/login`
- `/signup`
- `/translation/:id`

Protected routes:

- `/translation/new`
- `/translation/edit/:id`

Fallback:

- `*` -> 404 page

## API Integration

The frontend communicates with the backend via Axios using `VITE_API_URL`. It:

- sends JWT access token from `localStorage` in `Authorization` header
- clears auth state and redirects to `/login` on `401` responses

## Build and Deployment Notes

- Run `npm run build` before deployment.
- Serve the generated `dist/` directory using a static host (Netlify, Vercel, Nginx, etc.).
- Ensure `VITE_API_URL` points to your deployed API base URL.

## Troubleshooting

- If requests fail with CORS errors, verify backend `ALLOWED_ORIGINS` and runtime `NODE_ENV`.
- If auth appears broken, clear `localStorage` and re-login.
- If the app cannot reach the API, confirm `VITE_API_URL` and backend server port.
