import React from "react";
import { Bot, Database, LayoutDashboard, LogOut, Plus, Settings, ShieldCheck, UserCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Shell({ user, onLogout, children }) {
  const location = useLocation();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link to="/" className="brand">
          <span className="brand-icon"><Bot size={22} /></span>
          <span>
            <strong>AutoFlow AI</strong>
            <small>Agentic Ops Platform</small>
          </span>
        </Link>

        <nav className="nav-list">
          <Link className={location.pathname === "/" ? "active" : ""} to="/"><LayoutDashboard size={18} /> Dashboard</Link>
          <a href="#create"><Plus size={18} /> Create Workflow</a>
          <a href="#profile"><UserCircle size={18} /> Profile</a>
          <a href="#settings"><Settings size={18} /> Settings</a>
        </nav>

        <div className="sidebar-status">
          <span><ShieldCheck size={16} /> Local demo secure</span>
          <span><Database size={16} /> In-memory store</span>
        </div>

        <div className="user-card">
          <div>
            <strong>{user?.name || "Demo User"}</strong>
            <small>{user?.email || "demo@autoflow.ai"}</small>
          </div>
          <button className="icon-button" onClick={onLogout} title="Log out" aria-label="Log out">
            <LogOut size={18} />
          </button>
        </div>
      </aside>
      <main className="main">{children}</main>
    </div>
  );
}
