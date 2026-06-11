# Project Management System
Advanced MERN application for managing projects, users, and files with role-based access.

This README documents how to run the app locally, the API surface, environment variables, and troubleshooting tips.

## Features

- JWT authentication with `bcryptjs` password hashing
- Role-based access: `admin` and `user`
- User management (admin): create, update, delete, change roles
- User profile update for authenticated users
- Project CRUD (admin) with up to 3 file attachments (Multer)
- Assigned users can view their projects and update project status
- Dashboard analytics: total users, total projects, status counts, projects ending within 7 days
- Search and status filtering for projects
- Light/dark theme toggle on the frontend

## Tech Stack

- Backend: Node.js (ESM), Express, MongoDB (Mongoose), JWT, Multer
- Frontend: React, Vite, React Router, Axios

## Prerequisites

- Node.js 18+ and npm
- (Optional) MongoDB running locally or a connection string

Note: The backend will attempt to connect to `MONGO_URI`. If it's not available, the server will automatically start an in-memory MongoDB (development only) so you can run the project without a local MongoDB instance.

## Environment

Copy example env files and adjust values as needed:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Important variables (backend/.env):

- `PORT` — backend port (default: 5050)
- `MONGO_URI` — MongoDB connection string (optional; if missing or unreachable, an in-memory DB is used)
- `JWT_SECRET` — JWT signing secret (set to a strong random string)
- `CLIENT_URL` — frontend origin used in production CORS

Frontend env (frontend/.env):

- `VITE_API_URL` — API base (default: `http://localhost:5050/api`)
- `VITE_UPLOAD_URL` — upload base (default: `http://localhost:5050`)

## Install

Install dependencies for both backend and frontend (from repo root):

```bash
npm run install:all
```

Or install individually:

```bash
npm install --prefix backend
npm install --prefix frontend
```

## Development

Start both backend and frontend (from repo root):

```bash
npm run dev
```

This runs the backend on `http://localhost:5050` and the frontend dev server on `http://localhost:5173` by default. The frontend will automatically pick another free port if `5173` is in use.

If you prefer to run servers separately:

```bash
npm start --prefix backend
npm run dev --prefix frontend
```

## Build (Production)

Build frontend:

```bash
npm run build --prefix frontend
```

Serve backend (production):

```bash
npm start --prefix backend
```

## Seeding Demo Data

The backend includes a seed script to populate demo users and projects. Run:

```bash
npm run seed --prefix backend
```

Demo accounts (seeded):

- Admin: `admin@example.com` / `password123`
- User: `user@example.com` / `password123`

## API Reference

All endpoints are prefixed with `/api`.

Base URL (development): `http://localhost:5050/api`

### Auth

- `POST /api/auth/signup`
	- Body: `{ name, email, password, role?, phone?, department? }`
	- Response: `{ user, token }` (user object without password)

- `POST /api/auth/login`
	- Body: `{ email, password }`
	- Response: `{ user, token }`

- `GET /api/auth/me`
	- Requires `Authorization: Bearer <token>`
	- Response: authenticated user

### Users (admin)

- `GET /api/users` — list users (admin)
- `POST /api/users` — create user (admin)
	- Body: `{ name, email, password, role, phone, department }`
- `PUT /api/users/:id` — update user (admin)
- `DELETE /api/users/:id` — delete user (admin)
- `PUT /api/users/profile` — update own profile (auth)

### Projects

- `GET /api/projects` — list projects (admins see all; users see assigned)
	- Query params: `status`, `search`
- `POST /api/projects` — create project (admin)
	- Multipart form; field `attachments` for files (max 3)
	- Body fields: `title`, `description`, `startDate`, `endDate`, `status`, `assignedUsers` (JSON array or CSV)
- `GET /api/projects/:id` — get project
- `PUT /api/projects/:id` — update project (admin)
	- Multipart form for attachments
- `DELETE /api/projects/:id` — delete project (admin)
- `PATCH /api/projects/:id/status` — update just status (assigned user or admin)

### Dashboard

- `GET /api/dashboard` — returns totals and projects ending soon
	- Response sample:

```json
{
	"totalUsers": 10,
	"totalProjects": 24,
	"statusCounts": { "Pending": 5, "In-Progress": 12, "Completed": 7 },
	"endingSoon": [ /* projects */ ]
}
```

## File uploads

- Attachments are stored under `backend/uploads/` during development. Multer limits: max 3 files and 5MB each.

## Models (summary)

- `User` — `{ name, email, password, role, phone, department }`
- `Project` — `{ title, description, startDate, endDate, status, assignedUsers, attachments, createdBy }`

## Development notes & troubleshooting

- If backend fails to connect to your local MongoDB, it will use an in-memory MongoDB (development fallback). To use a persistent DB set `MONGO_URI` in `backend/.env`.
- If ports `5050` (backend) or `5173` (frontend) are in use, the dev servers will try next available ports. Check console output for the actual URLs.
- To clear generated artifacts after development, delete `node_modules/` and `frontend/dist/` if present and reinstall as needed.

## Postman

Import `postman/Project_Management_System.postman_collection.json` and set the `baseUrl` collection variable to your backend URL (e.g., `http://localhost:5050`).

## License

This project is provided for demonstration purposes.

---

If you want, I can add example curl requests for each endpoint or update the Postman collection with environment variables. What would you like next?
