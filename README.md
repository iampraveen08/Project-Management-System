# Project Management System

Advanced MERN machine-test implementation with JWT authentication, role-based access control, project CRUD, local file uploads, dashboard analytics, and a React admin/user interface.

## Features

- JWT login and signup with bcrypt password hashing
- Admin and User roles
- Admin user management: create, update, delete, change roles
- User profile update for the authenticated user
- Admin project CRUD with up to 3 Multer attachments
- Assigned users can view their projects and update project status
- Dashboard analytics: total users, total projects, status counts, projects ending within 7 days
- Search and status filtering for projects
- Light/dark theme toggle
- Postman collection included

## Tech Stack

- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, Multer
- Frontend: React, Vite, React Router, Axios, lucide-react

## Setup

1. Install dependencies:

```bash
npm run install:all
npm install
```

2. Create backend environment file:

```bash
cp backend/.env.example backend/.env
```

Update `backend/.env` with your MongoDB URI and JWT secret.

3. Create frontend environment file:

```bash
cp frontend/.env.example frontend/.env
```

4. Seed demo data:

```bash
npm run seed --prefix backend
```

Demo accounts:

- Admin: `admin@example.com` / `password123`
- User: `user@example.com` / `password123`

5. Run both apps:

```bash
npm run dev
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:5050`

The backend uses `5050` because port `5000` is commonly occupied by macOS Control Center/AirPlay.

## API Overview

Auth:

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`

Users:

- `GET /api/users` admin
- `POST /api/users` admin
- `PUT /api/users/:id` admin
- `DELETE /api/users/:id` admin
- `PUT /api/users/profile` authenticated user

Projects:

- `GET /api/projects`
- `POST /api/projects` admin, multipart form with `attachments`
- `GET /api/projects/:id`
- `PUT /api/projects/:id` admin, multipart form with `attachments`
- `DELETE /api/projects/:id` admin
- `PATCH /api/projects/:id/status` assigned user or admin

Dashboard:

- `GET /api/dashboard`

## Project Fields

- `title`
- `description`
- `startDate`
- `endDate`
- `status`: `Pending`, `In-Progress`, `Completed`
- `assignedUsers`: array of user IDs
- `attachments`: up to 3 uploaded files

## Postman

Import `postman/Project_Management_System.postman_collection.json`. Set the collection variable `baseUrl` to `http://localhost:5050`. Login requests automatically store the JWT token in the `token` collection variable.
