# Project Management System
Advanced MERN application for managing projects, users, and files with role-based access.

This README documents how to run the app locally, the API surface, environment variables, and troubleshooting tips.

## Requirements Checklist ✅

### Authentication & Authorization (20%)
- ✅ JWT-based login & signup
- ✅ Password hashing with bcryptjs
- ✅ Role-based access: Admin & User
- ✅ Protected endpoints with auth middleware
- ✅ Token verification and expiration

### Project Module - CRUD (20%)
- ✅ Create projects (admin only)
- ✅ Read/list projects (with role-based filtering)
- ✅ Update projects (admin only)
- ✅ Delete projects (admin only)
- ✅ All required fields: title, description, startDate, endDate, status, assignedUsers, attachments

### File Upload (10%)
- ✅ Multer integration with local storage
- ✅ Max 3 attachments per project
- ✅ 5MB max per file
- ✅ File metadata tracking

### Dashboard & Analytics (10%)
- ✅ Total users count (admin view)
- ✅ Total projects count
- ✅ Project count by status
- ✅ Projects ending within 7 days
- ✅ Role-based data visibility

### User Module (20%)
- ✅ Admin: create, update, delete users
- ✅ Admin: change user roles
- ✅ User: update own profile
- ✅ User: password change
- ✅ Admin-only user management

### Code Quality & Security (20%)
- ✅ Error handling middleware
- ✅ Input validation
- ✅ Protected routes
- ✅ Clean code structure
- ✅ Async/await pattern

### Frontend UI/UX
- ✅ Login/Signup page
- ✅ Dashboard with analytics
- ✅ Project list & details
- ✅ Project creation form
- ✅ User management interface
- ✅ Profile page
- ✅ Status updates
- ✅ File download from attachments
- ✅ Search & filtering
- ✅ Theme toggle (Light/Dark)
- ✅ Responsive layout

## Features

- JWT authentication with `bcryptjs` password hashing
- Role-based access control: `admin` and `user`
- **User Management (Admin only)**: create, update, delete users; change user roles
- **User Profile**: authenticated users can update own profile, change password
- **Project CRUD (Admin only)**: create, read, update, delete projects with full details
- **Project Status Updates (All users)**: assigned users can update project status
- **File Upload**: Multer integration with up to 3 attachments per project (local storage)
- **Dashboard Analytics**: 
  - Total users (admin view)
  - Total projects
  - Project count by status (Pending, In-Progress, Completed)
  - Projects ending within 7 days
- **Search & Filtering**: Filter projects by status, search by title
- **Theme Toggle**: Light/dark mode persistence on frontend

## Tech Stack

- **Backend**: Node.js (ESM), Express, MongoDB (Mongoose), JWT, Multer, bcryptjs
- **Frontend**: React 18, Vite, React Router, Axios, Lucide React icons
- **Database**: MongoDB (required locally or via connection string)

## Prerequisites

- Node.js 18+ and npm
- **MongoDB running locally** on port 27017, or set a valid `MONGO_URI` connection string

⚠️ **Important**: MongoDB must be running. The backend requires a valid database connection and will not start without it.

To start MongoDB locally (macOS with Homebrew):
```bash
brew services start mongodb-community
```

To verify MongoDB is running:
```bash
lsof -iTCP:27017 -sTCP:LISTEN -P -n
```

## Environment Setup

Copy example env files and adjust values:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### Backend Environment Variables (.env)

- `PORT` — Backend port (default: `5050`)
- `MONGO_URI` — MongoDB connection string (required; must connect to local or remote MongoDB)
  - Local example: `mongodb://127.0.0.1:27017/project_management_system`
- `JWT_SECRET` — JWT signing secret (set to a long random string for security)
- `CLIENT_URL` — Frontend origin for CORS (default: `http://localhost:5173`)

### Frontend Environment Variables (optional)

- `VITE_API_URL` — API base URL (default: `http://localhost:5050/api`)
- `VITE_UPLOAD_URL` — Upload base URL (default: `http://localhost:5050`)

## Installation & Development

### Step 1: Install Dependencies
From the repository root:
```bash
npm run install:all
```

Or install individually:

```bash
npm install --prefix backend
npm install --prefix frontend
```

### Step 2: Ensure MongoDB is Running
**Critical**: MongoDB must be running before starting the backend.

**macOS (Homebrew)**:
```bash
brew services start mongodb-community
```

**Verify MongoDB is listening**:
```bash
lsof -iTCP:27017 -sTCP:LISTEN -P -n | grep mongod
```

### Step 3: Seed Demo Data (Optional)
Populate database with demo users and projects:
```bash
npm run seed --prefix backend
```

Demo credentials:
- **Admin**: `admin@example.com` / `password123`
- **User**: `user@example.com` / `password123`

### Step 4: Start Development Servers
From the repository root, start both backend and frontend:
```bash
npm run dev
```

**Servers**:
- **Backend**: `http://localhost:5050`
- **Frontend**: `http://localhost:5173`

**Alternative**: Run separately in different terminals:
```bash
# Terminal 1: Backend
npm start --prefix backend

# Terminal 2: Frontend
npm run dev --prefix frontend
```

## Production Build

**Build frontend** (creates optimized dist folder):
```bash
npm run build --prefix frontend
```

**Start backend in production mode**:
```bash
npm start --prefix backend
```

Ensure `NODE_ENV=production` and all required environment variables are set in `backend/.env`.

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
