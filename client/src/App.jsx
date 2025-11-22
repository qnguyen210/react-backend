// client/src/App.jsx
import { Routes, Route, Link, Navigate } from "react-router-dom";
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
      <header>
        <nav>
          <Link to="/">Home</Link>{" | "}
          <Link to="/contact">Contact</Link>{" | "}
          <Link to="/education">Education</Link>{" | "}
          <Link to="/project">Project</Link>{" | "}
          {!user && <Link to="/signin">Sign In</Link>}
          {!user && <Link to="/signup">Sign Up</Link>}
          {user && (
            <>
              <button type="button" onClick={logout}>
                Logout
              </button>
            </>
          )}
          {isAdmin && (
            <>
              {" | "}
              <Link to="/admin/contacts">Manage Contacts</Link>{" | "}
              <Link to="/admin/educations">Manage Educations</Link>{" | "}
              <Link to="/admin/projects">Manage Projects</Link>
            </>
          )}
        </nav>

        {user && (
          <p>
            Signed in as: {user.email} ({user.role})
          </p>
        )}
      </header>

      <main>
        <Routes>
          <Route path="/" element={<p>Welcome to my portfolio</p>} />

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

