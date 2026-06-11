import { BriefcaseBusiness, FolderKanban, LayoutDashboard, LogOut, Moon, Sun, Users } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [dark, setDark] = useState(() => localStorage.getItem("pms_theme") === "dark");

  useEffect(() => {
    document.body.dataset.theme = dark ? "dark" : "light";
    localStorage.setItem("pms_theme", dark ? "dark" : "light");
  }, [dark]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <BriefcaseBusiness size={28} />
          <div>
            <strong>PMS</strong>
            <span>{user?.role}</span>
          </div>
        </div>
        <nav>
          <NavLink to="/"><LayoutDashboard size={18} />Dashboard</NavLink>
          <NavLink to="/projects"><FolderKanban size={18} />Projects</NavLink>
          {isAdmin && <NavLink to="/users"><Users size={18} />Users</NavLink>}
        </nav>
        <div className="sidebarFooter">
          <button className="iconText" onClick={() => setDark((value) => !value)} title="Toggle theme">
            {dark ? <Sun size={18} /> : <Moon size={18} />}
            Theme
          </button>
          <button className="iconText danger" onClick={handleLogout}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
      <main>
        <header className="topbar">
          <div>
            <span className="eyebrow">Project Management System</span>
            <h1>Welcome, {user?.name}</h1>
          </div>
          <NavLink className="profileLink" to="/profile">{user?.email}</NavLink>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
