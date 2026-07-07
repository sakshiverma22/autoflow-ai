import React from "react";
import { useState } from "react";
import { Bot, Lock, Mail, User, Zap } from "lucide-react";
import api from "../services/api.js";

export default function AuthPage({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [showAuthPage, setShowAuthPage] = useState(false);
  const [form, setForm] = useState({ name: "Sakshi", email: "demo@autoflow.ai", password: "demo1234" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
      const res = await api.post(endpoint, form);
      onAuth(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const authForm = (
    <form className="login-card signin-card" onSubmit={submit}>
      <div className="form-heading">
        <p className="eyebrow">{mode === "login" ? "Welcome back" : "New here?"}</p>
        <h2>{mode === "login" ? "Sign in" : "Create account"}</h2>
      </div>
      <div className="segmented">
        <button type="button" className={mode === "login" ? "selected" : ""} onClick={() => setMode("login")}>Login</button>
        <button type="button" className={mode === "register" ? "selected" : ""} onClick={() => setMode("register")}>Register</button>
      </div>

      {mode === "register" && (
        <label>
          <User size={18} />
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" />
        </label>
      )}

      <label>
        <Mail size={18} />
        <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" />
      </label>
      <label>
        <Lock size={18} />
        <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" />
      </label>

      {error && <p className="error">{error}</p>}
      <button className="primary-button" disabled={loading}>{loading ? "Please wait..." : mode === "login" ? "Enter" : "Create"}</button>
    </form>
  );

  if (showAuthPage) {
    return (
      <main className="auth-page auth-form-page">
        <section className="auth-stage signin-stage">
          <nav className="auth-nav" aria-label="Sign in page navigation">
            <button className="auth-back" type="button" onClick={() => setShowAuthPage(false)}>Back</button>
            <div className="auth-logo">
              <span className="brand-icon"><Bot size={24} /></span>
              <strong>AutoFlow AI</strong>
            </div>
          </nav>

          <section className="signin-layout">
            <div className="signin-copy">
              <p className="auth-kicker"><Zap size={15} /> Secure access</p>
              <h1>{mode === "login" ? "Welcome back." : "Create your desk."}</h1>
            </div>
            {authForm}
          </section>

          <footer id="footer" className="auth-footer">
            <span>AutoFlow AI</span>
            <span>2026</span>
          </footer>
        </section>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <section className="auth-stage">
        <nav className="auth-nav" aria-label="Login page navigation">
          <div className="auth-logo">
            <span className="brand-icon"><Bot size={24} /></span>
            <strong>AutoFlow AI</strong>
          </div>
          <div className="auth-nav-links">
            <a href="mailto:demo@autoflow.ai">Contact</a>
            <a href="#footer">About</a>
            <button type="button" onClick={() => setShowAuthPage(true)}>Join</button>
          </div>
        </nav>

        <section className="auth-hero">
          <div className="auth-copy">
            <p className="auth-kicker"><Zap size={15} /> AI workflow desk</p>
            <h1>Flow work. Faster.</h1>
            <p>Login and launch your automations.</p>
          </div>

          <div className="auth-art" aria-hidden="true">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="art-flower">
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className="art-card">
              <div className="art-card-bars">
                <span />
                <span />
                <span />
              </div>
            </div>
            <div className="art-hand">
              <span />
            </div>
            <div className="spark spark-one" />
            <div className="spark spark-two" />
            <div className="spark spark-three" />
          </div>
        </section>

        <footer id="footer" className="auth-footer">
          <span>AutoFlow AI</span>
          <span>2026</span>
        </footer>
      </section>
    </main>
  );
}
