import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../api/client";

const emptyUser = { name: "", email: "", password: "", role: "user", department: "", phone: "" };

export default function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyUser);
  const [error, setError] = useState("");

  const load = async () => {
    const { data } = await api.get("/users");
    setUsers(data);
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await api.post("/users", form);
      setForm(emptyUser);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not create user");
    }
  };

  const update = async (user, field, value) => {
    const { data } = await api.put(`/users/${user._id}`, { ...user, [field]: value });
    setUsers((current) => current.map((item) => (item._id === data._id ? data : item)));
  };

  const remove = async (id) => {
    if (!confirm("Delete this user?")) return;
    await api.delete(`/users/${id}`);
    load();
  };

  return (
    <section className="pageGrid two">
      <div className="panel wide">
        <h2>User management</h2>
        <div className="table">
          {users.map((user) => (
            <div className="tableRow users" key={user._id}>
              <div>
                <strong>{user.name}</strong>
                <span>{user.email}</span>
              </div>
              <input value={user.department || ""} placeholder="Department" onChange={(e) => update(user, "department", e.target.value)} />
              <select value={user.role} onChange={(e) => update(user, "role", e.target.value)}>
                <option value="user">user</option>
                <option value="admin">admin</option>
              </select>
              <button className="iconOnly danger" title="Delete user" onClick={() => remove(user._id)}><Trash2 size={17} /></button>
            </div>
          ))}
        </div>
      </div>
      <form className="panel form" onSubmit={create}>
        <h2><Plus size={19} />Create user</h2>
        <label>Name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
        <label>Email<input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        <label>Password<input type="password" required minLength="6" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
        <label>Role<select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}><option value="user">user</option><option value="admin">admin</option></select></label>
        <label>Department<input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} /></label>
        <label>Phone<input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
        {error && <p className="alert">{error}</p>}
        <button className="primary">Create user</button>
      </form>
    </section>
  );
}
