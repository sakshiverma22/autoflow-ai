import React from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AuthPage from "./pages/AuthPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import WorkflowDetail from "./pages/WorkflowDetail.jsx";
import api from "./services/api.js";

function Protected({ user, children }) {
  if (!localStorage.getItem("autoflow_token")) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("autoflow_user");
    return saved ? JSON.parse(saved) : null;
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("autoflow_token")) return;
    api.get("/auth/me").then((res) => setUser(res.data.user)).catch(() => {
      localStorage.removeItem("autoflow_token");
      localStorage.removeItem("autoflow_user");
      setUser(null);
    });
  }, []);

  function handleAuth(payload) {
    localStorage.setItem("autoflow_token", payload.token);
    localStorage.setItem("autoflow_user", JSON.stringify(payload.user));
    setUser(payload.user);
    navigate("/");
  }

  function logout() {
    localStorage.removeItem("autoflow_token");
    localStorage.removeItem("autoflow_user");
    setUser(null);
    navigate("/login");
  }

  return (
    <Routes>
      <Route path="/login" element={<AuthPage onAuth={handleAuth} />} />
      <Route
        path="/"
        element={
          <Protected user={user}>
            <Dashboard user={user} onLogout={logout} />
          </Protected>
        }
      />
      <Route
        path="/workflows/:id"
        element={
          <Protected user={user}>
            <WorkflowDetail user={user} onLogout={logout} />
          </Protected>
        }
      />
    </Routes>
  );
}
