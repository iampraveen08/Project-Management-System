import { Paperclip, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/client";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../context/AuthContext";

const uploadBase = import.meta.env.VITE_UPLOAD_URL || "http://localhost:5000";

export default function ProjectDetails() {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const [project, setProject] = useState(null);
  const [status, setStatus] = useState("Pending");
  const [message, setMessage] = useState("");

  const load = async () => {
    const { data } = await api.get(`/projects/${id}`);
    setProject(data);
    setStatus(data.status);
  };

  useEffect(() => {
    load();
  }, [id]);

  const saveStatus = async () => {
    const { data } = await api.patch(`/projects/${id}/status`, { status });
    setProject(data);
    setMessage("Status updated");
  };

  if (!project) return <p className="muted">Loading project...</p>;

  return (
    <section className="pageGrid">
      <div className="panel">
        <Link to="/projects" className="backLink">Back to projects</Link>
        <div className="detailHeader">
          <div>
            <h2>{project.title}</h2>
            <p>{project.description}</p>
          </div>
          <StatusBadge status={project.status} />
        </div>
        <div className="metaGrid">
          <div><span>Start</span><strong>{new Date(project.startDate).toLocaleDateString()}</strong></div>
          <div><span>End</span><strong>{new Date(project.endDate).toLocaleDateString()}</strong></div>
          <div><span>Created by</span><strong>{project.createdBy?.name || "Admin"}</strong></div>
        </div>
      </div>
      <div className="panel">
        <h2>Assigned users</h2>
        <div className="chips">
          {project.assignedUsers?.map((user) => <span key={user._id}>{user.name}</span>)}
          {!project.assignedUsers?.length && <p className="muted">No users assigned.</p>}
        </div>
      </div>
      <div className="panel">
        <h2>Update status</h2>
        <div className="inlineForm">
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option>Pending</option>
            <option>In-Progress</option>
            <option>Completed</option>
          </select>
          <button className="primary" onClick={saveStatus}><Save size={17} />Save</button>
        </div>
        {message && <p className="success">{message}</p>}
        {isAdmin && <p className="muted">Admins can also update full project details from the project list workflow.</p>}
      </div>
      <div className="panel">
        <h2><Paperclip size={19} />Attachments</h2>
        <div className="list">
          {project.attachments?.map((file) => (
            <a className="listRow" key={file.filename} href={`${uploadBase}${file.path}`} target="_blank" rel="noreferrer">
              <strong>{file.originalName}</strong>
              <span>{Math.round(file.size / 1024)} KB</span>
            </a>
          ))}
          {!project.attachments?.length && <p className="muted">No attachments uploaded.</p>}
        </div>
      </div>
    </section>
  );
}
