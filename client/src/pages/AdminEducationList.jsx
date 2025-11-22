import { useEffect, useState } from "react";
import { apiRequest } from "../api.js";
import { useAuth } from "../AuthContext.jsx";

export default function AdminEducationList() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  async function loadItems() {
    try {
      const data = await apiRequest("/qualifications", "GET", null, token);
      setItems(data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("Delete this qualification?")) return;
    try {
      await apiRequest(`/qualifications/${id}`, "DELETE", null, token);
      setItems(items.filter((i) => i._id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  function fmtDate(d) {
    if (!d) return "";
    try {
      return new Date(d).toLocaleDateString();
    } catch (e) {
      return d;
    }
  }

  return (
    <div>
      <h2>Admin: Education / Qualifications</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <table border="1">
        <thead>
          <tr>
            <th>School</th>
            <th>Degree</th>
            <th>Field</th>
            <th>Start</th>
            <th>End</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it) => (
            <tr key={it._id}>
              <td>{it.school}</td>
              <td>{it.degree}</td>
              <td>{it.fieldOfStudy}</td>
              <td>{fmtDate(it.startDate)}</td>
              <td>{fmtDate(it.endDate)}</td>
              <td>{it.description}</td>
              <td>
                <button onClick={() => handleDelete(it._id)}>Delete</button>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan="7">No qualifications yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
