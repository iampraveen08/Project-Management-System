import { CalendarClock, FolderKanban, Users } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../api/client";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { isAdmin } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/dashboard").then(({ data }) => setData(data));
  }, []);

  if (!data) return <p className="muted">Loading dashboard...</p>;

  return (
    <section className="pageGrid">
      <div className="stats">
        {isAdmin && <article><Users /><span>Total users</span><strong>{data.totalUsers}</strong></article>}
        <article><FolderKanban /><span>Total projects</span><strong>{data.totalProjects}</strong></article>
        <article><CalendarClock /><span>Ending in 7 days</span><strong>{data.endingSoon.length}</strong></article>
      </div>
      <div className="panel">
        <h2>Status overview</h2>
        <div className="statusGrid">
          {Object.entries(data.statusCounts).map(([status, count]) => (
            <div key={status} className="statusTile">
              <StatusBadge status={status} />
              <strong>{count}</strong>
            </div>
          ))}
        </div>
      </div>
      <div className="panel">
        <h2>Projects ending soon</h2>
        <div className="list">
          {data.endingSoon.map((project) => (
            <div className="listRow" key={project._id}>
              <div>
                <strong>{project.title}</strong>
                <span>{new Date(project.endDate).toLocaleDateString()}</span>
              </div>
              <StatusBadge status={project.status} />
            </div>
          ))}
          {!data.endingSoon.length && <p className="muted">No projects due within the next 7 days.</p>}
        </div>
      </div>
    </section>
  );
}
