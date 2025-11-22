import { useEffect, useState } from "react";
import { apiRequest } from "../api.js";
import { useAuth } from "../AuthContext.jsx";

export default function AdminProjectList() {
  const { token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");

  async function loadProjects() {
    try {
      const data = await apiRequest("/projects", "GET", null, token);
      setProjects(data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("Delete this project?")) return;
    try {
      await apiRequest(`/projects/${id}`, "DELETE", null, token);
      setProjects(projects.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div>
      <h2>Admin: Projects</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <table border="1">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Link</th>
            <th>GitHub</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <tr key={p._id}>
              <td>{p.title}</td>
              <td>{p.description}</td>
              <td>{p.link ? <a href={p.link} target="_blank" rel="noopener noreferrer">link</a> : ""}</td>
              <td>{p.github ? <a href={p.github} target="_blank" rel="noopener noreferrer">github</a> : ""}</td>
              <td>
                <button onClick={() => handleDelete(p._id)}>Delete</button>
              </td>
            </tr>
          ))}
          {projects.length === 0 && (
            <tr>
              <td colSpan="5">No projects yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
