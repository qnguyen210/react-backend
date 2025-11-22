import { useState } from "react";
import { apiRequest } from "../api.js";
import { useAuth } from "../AuthContext.jsx";

export default function ContactForm() {
  const { token, user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    message: "",
  });
  const [status, setStatus] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("");

    try {
      await apiRequest("/contacts", "POST", form, token);
      setStatus("Contact saved successfully");
      setForm({ ...form, message: "" });
    } catch (err) {
      setStatus(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Contact</h2>
      {status && <p>{status}</p>}
      <div>
        <label>Name</label>
        <input name="name" value={form.name} onChange={handleChange} required />
      </div>
      <div>
        <label>Email</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Message</label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Send</button>
    </form>
  );
}
