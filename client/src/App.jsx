//import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import "./App.css";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import AdminContactList from "./pages/AdminContactList";
import AdminEducationList from "./pages/AdminEducationList";
import AdminProjectList from "./pages/AdminProjectList";
import { useAuth } from "./AuthContext.jsx";

function Home() {
  return (
    <div>
      <h1>Welcome to My Portfolio</h1>
      <p>This is the starting page. Use the navigation to open admin pages.</p>
    </div>
  );
}

function App() {
  const { isAdmin } = useAuth();

  function ProtectedRoute({ children }) {
    // only allow admin users to access admin pages
    return isAdmin ? children : <Navigate to="/" replace />;
  }

  return (
    <BrowserRouter>
      <nav style={{ padding: 10, borderBottom: "1px solid #ccc" }}>
        <Link to="/" style={{ marginRight: 10 }}>
          Home
        </Link>
        {isAdmin && (
          <>
            <Link to="/admin/contacts" style={{ marginRight: 10 }}>
              Admin Contacts
            </Link>
            <Link to="/admin/education" style={{ marginRight: 10 }}>
              Admin Education
            </Link>
            <Link to="/admin/projects">Admin Projects</Link>
          </>
        )}
      </nav>

      <main style={{ padding: 10 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Navigate to="/admin/contacts" replace />} />
          <Route
            path="/admin/contacts"
            element={
              <ProtectedRoute>
                <AdminContactList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/education"
            element={
              <ProtectedRoute>
                <AdminEducationList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/projects"
            element={
              <ProtectedRoute>
                <AdminProjectList />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
