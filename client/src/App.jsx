// client/src/App.jsx
import { Routes, Route, NavLink, Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import ContactForm from "./pages/ContactForm.jsx";
import EducationForm from "./pages/EducationForm.jsx";
import ProjectForm from "./pages/ProjectForm.jsx";

import AdminContactList from "./pages/AdminContactList.jsx";
import AdminEducationList from "./pages/AdminEducationList.jsx";
import AdminProjectList from "./pages/AdminProjectList.jsx";

function PrivateRoute({ children }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/signin" replace />;
  return children;
}

function AdminRoute({ children }) {
  const { token, isAdmin } = useAuth();
  if (!token) return <Navigate to="/signin" replace />;
  if (!isAdmin) return <p>You do not have access to this page.</p>;
  return children;
}

export default function App() {
  const { user, isAdmin, logout } = useAuth();

  return (
    <div>
      <header className="site-header">
        <div className="nav-bar container">
          <div className="brand">
            <NavLink to="/" end className="brand-link">MyPortfolio</NavLink>
          </div>
          <nav className="primary-nav">
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/contact">Contact</NavLink>
            <NavLink to="/education">Education</NavLink>
            <NavLink to="/project">Project</NavLink>
            {!user && <NavLink to="/signin">Sign In</NavLink>}
            {!user && <NavLink to="/signup">Sign Up</NavLink>}
            {user && (
              <button type="button" onClick={logout} className="btn outline small">Logout</button>
            )}
            {isAdmin && (
              <div className="admin-links">
                <NavLink to="/admin/contacts">Contacts</NavLink>
                <NavLink to="/admin/educations">Educations</NavLink>
                <NavLink to="/admin/projects">Projects</NavLink>
              </div>
            )}
          </nav>
        </div>
        {user && (
          <p className="signed-in-info">
            Signed in as: {user.email} ({user.role})
          </p>
        )}
      </header>

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <section className="hero fade-in">
                <div className="hero-inner container">
                  <h1>
                    <span className="gradient-text">Welcome</span> to my portfolio
                  </h1>
                  <p className="hero-tagline">Showcasing projects, education and ways to connect.</p>
                  {!user && (
                    <div className="hero-actions">
                      <NavLink to="/signup" className="btn">Get Started</NavLink>
                      <NavLink to="/signin" className="btn outline">Sign In</NavLink>
                    </div>
                  )}
                </div>
              </section>
            }
          />

          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          <Route
            path="/contact"
            element={
              <PrivateRoute>
                <ContactForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/education"
            element={
              <PrivateRoute>
                <EducationForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/project"
            element={
              <PrivateRoute>
                <ProjectForm />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/contacts"
            element={
              <AdminRoute>
                <AdminContactList />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/educations"
            element={
              <AdminRoute>
                <AdminEducationList />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/projects"
            element={
              <AdminRoute>
                <AdminProjectList />
              </AdminRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

