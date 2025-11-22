import { useState } from "react";
import { apiRequest } from "../api.js";
import { useAuth } from "../AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const data = await apiRequest("/auth/signin", "POST", { email, password });
      // backend returns { token, user }
      login(data.token, data.user);
      // if backend provides a role in user, you can redirect to admin
      if (data.user?.role === "admin") {
        navigate("/admin/contacts");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div style={{ maxWidth: 480 }}>
      <h2>Sign In</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 8 }}>
          <label>
            Email
            <br />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: "100%" }}
            />
          </label>
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>
            Password
            <br />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%" }}
            />
          </label>
        </div>
        <div>
          <button type="submit">Sign In</button>
        </div>
      </form>
    </div>
  );
}
