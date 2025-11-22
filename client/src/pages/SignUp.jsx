// client/src/pages/SignUp.jsx
import { useState } from "react";
import { apiRequest } from "../api.js";
import { useAuth } from "../AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // IMPORTANT: this sends { username, name, email, password }
      const data = await apiRequest("/auth/signup", "POST", form);

      // If your backend returns { token, user }
      login(data.token, data.user);
      navigate(data.user?.role === "admin" ? "/admin/contacts" : "/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 480 }}>
      <h2>Create Account</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginBottom: 8 }}>
        <label>
          Username
          <br />
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            style={{ width: "100%" }}
          />
        </label>
      </div>

      <div style={{ marginBottom: 8 }}>
        <label>
          Name
          <br />
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            style={{ width: "100%" }}
          />
        </label>
      </div>

      <div style={{ marginBottom: 8 }}>
        <label>
          Email
          <br />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            style={{ width: "100%" }}
          />
        </label>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>
          Password
          <br />
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
            style={{ width: "100%" }}
          />
        </label>
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Sign Up"}
      </button>
    </form>
  );
}

