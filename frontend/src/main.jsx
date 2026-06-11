import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import App from "./pages/App";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import ProjectDetails from "./pages/ProjectDetails";
import Projects from "./pages/Projects";
import Users from "./pages/Users";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthProvider } from "./context/AuthContext";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<App />}>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="projects" element={<Projects />} />
                <Route path="projects/:id" element={<ProjectDetails />} />
                <Route path="profile" element={<Profile />} />
                <Route element={<ProtectedRoute admin />}>
                  <Route path="users" element={<Users />} />
                </Route>
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
);
