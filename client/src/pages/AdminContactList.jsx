import { useEffect, useState } from "react";
import { apiRequest } from "../api.js";
import { useAuth } from "../AuthContext.jsx";

export default function AdminContactList() {
  const { token } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState("");

  async function loadContacts() {
    try {
      const data = await apiRequest("/contacts", "GET", null, token);
      setContacts(data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadContacts();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("Delete this contact?")) return;
    try {
      await apiRequest(`/contacts/${id}`, "DELETE", null, token);
      setContacts(contacts.filter(c => c._id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div>
      <h2>Admin: Contacts</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <table border="1">
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Message</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map(c => (
            <tr key={c._id}>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>{c.message}</td>
              <td>
                {/* You can add edit later if you want */}
                <button onClick={() => handleDelete(c._id)}>Delete</button>
              </td>
            </tr>
          ))}
          {contacts.length === 0 && (
            <tr>
              <td colSpan="4">No contacts yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
