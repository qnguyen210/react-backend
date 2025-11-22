import { useState } from "react";
import { apiRequest } from "../api.js";
import { useAuth } from "../AuthContext.jsx";

export default function EducationForm() {
  const { token, user } = useAuth();
  const [form, setForm] = useState({
    title: "",
    firstname: user?.name?.split(" ")[0] || "",
    lastname: user?.name?.split(" ").slice(1).join(" ") || "",
    email: user?.email || "",
    completion: "",
    description: "",
  });
  const [status, setStatus] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("");

    try {
      await apiRequest("/educations", "POST", form, token);
      setStatus("Education/Qualification saved");
      setForm({ ...form, title: "", completion: "", description: "" });
    } catch (err) {
      setStatus(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Education / Qualification</h2>
      {status && <p>{status}</p>}
      <div>
        <label>Title</label>
        <input name="title" value={form.title} onChange={handleChange} required />
      </div>
      <div>
        <label>Completion Date</label>
        <input
          type="date"
          name="completion"
          value={form.completion}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Save</button>
    </form>
  );
}
