import { useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user.name || "",
    phone: user.phone || "",
    department: user.department || "",
    password: ""
  });
  const [message, setMessage] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    const payload = { ...form };
    if (!payload.password) delete payload.password;
    const { data } = await api.put("/users/profile", payload);
    updateUser(data);
    setForm((current) => ({ ...current, password: "" }));
    setMessage("Profile updated");
  };

  return (
    <section className="panel narrow">
      <h2>My profile</h2>
      <form className="form" onSubmit={submit}>
        <label>Name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
        <label>Phone<input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
        <label>Department<input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} /></label>
        <label>New password<input type="password" minLength="6" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
        {message && <p className="success">{message}</p>}
        <button className="primary">Update profile</button>
      </form>
    </section>
  );
}
