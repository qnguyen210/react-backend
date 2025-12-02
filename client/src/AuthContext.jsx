import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  function readStoredAuth() {
    if (typeof window === "undefined") {
      return { token: null, user: null };
    }

    const saved = window.localStorage.getItem("auth");
    if (!saved) {
      return { token: null, user: null };
    }

    try {
      const parsed = JSON.parse(saved);
      return {
        token: parsed.token ?? null,
        user: parsed.user ?? null,
      };
    } catch (err) {
      console.warn("Invalid auth data in localStorage", err);
      return { token: null, user: null };
    }
  }

  const [{ token, user }, setAuthState] = useState(readStoredAuth);

  useEffect(() => {
    function handleStorage(event) {
      if (event.key !== "auth") {
        return;
      }
      setAuthState(readStoredAuth());
    }

    if (typeof window !== "undefined") {
      window.addEventListener("storage", handleStorage);
      return () => window.removeEventListener("storage", handleStorage);
    }

    return undefined;
  }, []);

  function login(newToken, newUser) {
    setAuthState({ token: newToken, user: newUser });
    localStorage.setItem("auth", JSON.stringify({ token: newToken, user: newUser }));
  }

  function logout() {
    setAuthState({ token: null, user: null });
    localStorage.removeItem("auth");
  }

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider value={{ token, user, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
