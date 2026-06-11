import { Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../context/AuthContext";

const emptyProject = {
  title: "",
  description: "",
  startDate: "",
  endDate: "",
  status: "Pending",
  assignedUsers: []
};

export default function Projects() {
  const { isAdmin } = useAuth();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ search: "", status: "" });
  const [form, setForm] = useState(emptyProject);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");

  const loadProjects = async () => {
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value));
      const { data } = await api.get("/projects", { params });
      setProjects(data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load projects");
    }
  };

  useEffect(() => {
    loadProjects();
    if (isAdmin) {
      api
        .get("/users")
        .then(({ data }) => setUsers(data))
        .catch((err) => setError(err.response?.data?.message || "Could not load users"));
    }
  }, [isAdmin]);

  const createProject = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const body = new FormData();
      Object.entries(form).forEach(([key, value]) => body.append(key, key === "assignedUsers" ? JSON.stringify(value) : value));
      Array.from(files).forEach((file) => body.append("attachments", file));
      await api.post("/projects", body);
      setForm(emptyProject);
      setFiles([]);
      loadProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save project");
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this project?")) return;
    try {
      await api.delete(`/projects/${id}`);
      loadProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete project");
    }
  };

  return (
    <section className="pageGrid two">
      <div className="panel wide">
        <div className="panelHeader">
          <h2>Projects</h2>
          <div className="filters">
            <label className="search"><Search size={16} /><input placeholder="Search" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} /></label>
            <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
              <option value="">All statuses</option>
              <option>Pending</option>
              <option>In-Progress</option>
              <option>Completed</option>
            </select>
            <button onClick={loadProjects}>Apply</button>
          </div>
        </div>
        {error && <p className="alert">{error}</p>}
        <div className="table">
          {projects.map((project) => (
            <div className="tableRow" key={project._id}>
              <Link to={`/projects/${project._id}`}>
                <strong>{project.title}</strong>
                <span>{project.assignedUsers?.map((user) => user.name).join(", ") || "Unassigned"}</span>
              </Link>
              <span>{new Date(project.endDate).toLocaleDateString()}</span>
              <StatusBadge status={project.status} />
              {isAdmin && <button className="iconOnly danger" title="Delete project" onClick={() => remove(project._id)}><Trash2 size={17} /></button>}
            </div>
          ))}
        </div>
      </div>
      {isAdmin && (
        <form className="panel form" onSubmit={createProject}>
          <h2><Plus size={19} />Create project</h2>
          <label>Title<input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
          <label>Description<textarea required rows="4" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
          <label>Start date<input type="date" required value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></label>
          <label>End date<input type="date" required value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} /></label>
          <label>Status<select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option>Pending</option><option>In-Progress</option><option>Completed</option></select></label>
          <label>Assigned users<select multiple value={form.assignedUsers} onChange={(e) => setForm({ ...form, assignedUsers: Array.from(e.target.selectedOptions, (option) => option.value) })}>{users.map((user) => <option key={user._id} value={user._id}>{user.name}</option>)}</select></label>
          <label>Attachments<input type="file" multiple onChange={(e) => setFiles(e.target.files)} /></label>
          {error && <p className="alert">{error}</p>}
          <button className="primary">Create project</button>
        </form>
      )}
    </section>
  );
}
