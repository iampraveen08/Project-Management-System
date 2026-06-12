# Project Management System

A full-stack project management app built with React, Vite, Express, and MongoDB. It supports role-based access, user management, project CRUD operations, file uploads, and dashboard analytics.

## Deployment

Frontend : https://project-management-system-1-ungq.onrender.com

Backend : https://project-management-system-sawf.onrender.com

## Document

https://docs.google.com/document/d/1-_YP-Zxg7wlcGietC6q24UBriCifdg_nfd32KQj7mSo/edit?tab=t.0

## Key Features

- JWT authentication and protected routes
- Role-based access: `admin` and `user`
- Admin user management: create, update, delete users
- Project management: create, read, update, delete projects
- Project status updates for assigned users
- File uploads for project attachments (local storage)
- Dashboard metrics for total users, projects, and statuses
- React frontend with dark/light mode and responsive layout

## Tech Stack

- Backend: Node.js, Express, MongoDB, Mongoose, JWT, Multer
- Frontend: React, Vite, Axios, React Router
- Database: MongoDB

## Repository Structure

- `/backend`: Express API server
- `/frontend`: React application
- `/uploads`: Stored project attachment files
- `/scripts/dev.mjs`: Start backend and frontend together

## Prerequisites

- Node.js 18+ and npm
- MongoDB running locally or accessible via `MONGO_URI`

## Setup

### 1. Install dependencies

```bash
npm run install:all
```

Or separately:

```bash
npm install --prefix backend
npm install --prefix frontend
```

### 2. Configure environment variables

Create the backend `.env` file in `/backend`.

Example values:

```env
PORT=5050
MONGO_URI=mongodb://127.0.0.1:27017/project_management_system
JWT_SECRET=your_jwt_secret_here
CLIENT_URL=http://localhost:5173
```

The frontend can use environment variables if needed, but the default API URL is:

```env
VITE_API_URL=http://localhost:5050/api
VITE_UPLOAD_URL=http://localhost:5050
```

### 3. Start MongoDB

Make sure MongoDB is running before starting the backend.

macOS (Homebrew):

```bash
brew services start mongodb-community
```

Verify:

```bash
lsof -iTCP:27017 -sTCP:LISTEN -P -n | grep mongod
```

### 4. Run the app

From the repository root:

```bash
npm run dev
```

This runs both the backend and frontend together.

Alternative:

```bash
npm start --prefix backend
npm run dev --prefix frontend
```

## Seed data (optional)

Use the backend seed script to populate sample users and projects:

```bash
npm run seed --prefix backend
```

## Backend API Reference

Base URL: `http://localhost:5050/api`

### Auth

- `POST /api/auth/signup`
  - Register a new user
  - Body: `name`, `email`, `password`, `role`
- `POST /api/auth/login`
  - Authenticate a user
  - Body: `email`, `password`
- `GET /api/auth/me`
  - Get current user profile
  - Requires auth token

### Users

- `GET /api/users`
  - List all users
  - Admin only
- `POST /api/users`
  - Create a new user
  - Admin only
- `PUT /api/users/profile`
  - Update current user profile
  - Requires auth token
- `PUT /api/users/:id`
  - Update a user by ID
  - Admin only
- `DELETE /api/users/:id`
  - Delete a user by ID
  - Admin only

### Projects

- `GET /api/projects`
  - List projects for the authenticated user
- `POST /api/projects`
  - Create a project
  - Admin only
  - Supports file uploads: `attachments` (up to 3 files)
- `GET /api/projects/:id`
  - Get a single project by ID
- `PUT /api/projects/:id`
  - Update a project by ID
  - Admin only
  - Supports file uploads: `attachments`
- `DELETE /api/projects/:id`
  - Delete a project by ID
  - Admin only
- `PATCH /api/projects/:id/status`
  - Update project status
  - Requires auth token

### Dashboard

- `GET /api/dashboard`
  - Fetch dashboard metrics for the current user
  - Requires auth token

## File Uploads

Uploaded attachments are stored in `/uploads` and served from:

```text
http://localhost:5050/uploads/<filename>
```

## Scripts

- `npm run install:all` — install backend and frontend dependencies
- `npm run dev` — start both backend and frontend
- `npm run build --prefix frontend` — build the React app
- `npm start --prefix backend` — run the backend server
- `npm run seed --prefix backend` — seed demo data

## Notes

- The backend runs on `http://localhost:5050` by default.
- The frontend runs on `http://localhost:5173` by default.
- Set a strong `JWT_SECRET` in `/backend/.env` for production.
- If you change ports, update the frontend API URL accordingly.

## Contact

For questions, use the project code and inspect `/backend/src` and `/frontend/src` for routes, controllers, and components.

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

## File Uploads

- Attachments stored locally under `backend/uploads/` during development
- Multer configuration: max 3 files per project, 5MB per file
- File paths accessible via `/uploads/<filename>` endpoint

## Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed with bcryptjs),
  role: "admin" | "user",
  phone: String,
  department: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Project
```javascript
{
  title: String,
  description: String,
  startDate: Date,
  endDate: Date,
  status: "Pending" | "In-Progress" | "Completed",
  assignedUsers: [ObjectId], // references to User
  attachments: [
    {
      originalName: String,
      filename: String,
      path: String,
      mimetype: String,
      size: Number
    }
  ],
  createdBy: ObjectId, // reference to User (admin)
  createdAt: Date,
  updatedAt: Date
}
```

## Role-Based Access Control (RBAC)

### Admin Permissions
- ✅ Create, read, update, delete users
- ✅ Change user roles
- ✅ Create, read, update, delete projects
- ✅ Assign/unassign users to projects
- ✅ Upload attachments (max 3 per project)
- ✅ View all projects in dashboard
- ✅ View all users
- ✅ Update own profile

### User Permissions
- ✅ View assigned projects only
- ✅ Update project status (for assigned projects)
- ✅ View own profile
- ✅ Update own profile (name, phone, department, password)
- ❌ Cannot create projects
- ❌ Cannot manage users
- ❌ Cannot assign/unassign users

## Development notes & Troubleshooting

- **MongoDB must be running** before starting the backend. Verify with: `lsof -iTCP:27017 -sTCP:LISTEN -P -n`
- If you need to start MongoDB (macOS Homebrew): `brew services start mongodb-community`
- If ports are in use (5050 for backend, 5173 for frontend), the dev servers will use next available. Check console output.
- For fresh setup after development, remove `node_modules/` folders and reinstall: `npm run install:all`
- All API endpoints require JWT authentication except `/api/auth/signup` and `/api/auth/login`

## Postman Collection


Import `postman/Project_Management_System.postman_collection.json` and set the `baseUrl` collection variable to your backend URL (e.g., `http://localhost:5050`).

## License

This project is provided for demonstration purposes.

---

If you want, I can add example curl requests for each endpoint or update the Postman collection with environment variables. What would you like next?
