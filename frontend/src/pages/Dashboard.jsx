import React from "react";
import { useEffect, useMemo, useState } from "react";
import { Activity, ArrowRight, CheckCircle2, Clock3, Cpu, Play, Send, Sparkles, TriangleAlert, WandSparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Shell from "../components/Shell.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import api from "../services/api.js";

const examples = [
  "Create a client called Tesla. Schedule a meeting tomorrow at 3 PM. Generate proposal. Notify sales team.",
  "Schedule a meeting with the frontend team tomorrow at 5 PM, create a project in the database, and generate meeting notes.",
  "Create an onboarding project for a new designer, send documents, and notify HR."
];

export default function Dashboard({ user, onLogout }) {
  const [data, setData] = useState({ workflows: [], stats: { total: 0, running: 0, completed: 0, failed: 0 } });
  const [prompt, setPrompt] = useState(examples[0]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function load() {
    const res = await api.get("/workflows");
    setData(res.data);
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 1400);
    return () => clearInterval(interval);
  }, []);

  async function createWorkflow(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/workflows", { prompt });
      navigate(`/workflows/${res.data.workflow.id}`);
    } finally {
      setLoading(false);
    }
  }

  const statCards = useMemo(() => [
    { label: "Running", value: data.stats.running, icon: <Clock3 />, className: "blue" },
    { label: "Completed", value: data.stats.completed, icon: <CheckCircle2 />, className: "green" },
    { label: "Failed", value: data.stats.failed, icon: <TriangleAlert />, className: "red" },
    { label: "Total Workflows", value: data.stats.total, icon: <Activity />, className: "dark" }
  ], [data.stats]);

  return (
    <Shell user={user} onLogout={onLogout}>
      <header className="page-header">
        <div>
          <p className="eyebrow">AI workflow operations</p>
          <h1>Command Center</h1>
          <p className="header-copy">Plan, execute, and monitor multi-agent business workflows from one control surface.</p>
        </div>
        <button className="primary-button" onClick={() => document.getElementById("workflowPrompt")?.focus()}>
          <WandSparkles size={18} /> New Workflow
        </button>
      </header>

      <section className="ops-strip">
        <div>
          <span className="signal-dot" />
          <strong>Planner online</strong>
          <small>Natural language to JSON plan</small>
        </div>
        <div>
          <span className="signal-dot teal" />
          <strong>Execution engine</strong>
          <small>Sequential agent orchestration</small>
        </div>
        <div>
          <span className="signal-dot amber" />
          <strong>Demo mode</strong>
          <small>Fast local persistence</small>
        </div>
      </section>

      <section className="stats-grid">
        {statCards.map((stat) => (
          <article className={`stat-card ${stat.className}`} key={stat.label}>
            <div>{stat.icon}</div>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </article>
        ))}
      </section>

      <section id="create" className="workspace-grid">
        <form className="create-panel" onSubmit={createWorkflow}>
          <div className="section-title">
            <div>
              <p className="eyebrow">Natural language input</p>
              <h2>Create Workflow</h2>
              <small>Describe a business outcome. AutoFlow will split it into executable agent tasks.</small>
            </div>
            <span className="panel-icon"><Sparkles size={20} /></span>
          </div>
          <textarea id="workflowPrompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
          <div className="agent-chips" aria-label="Available agents">
            <span>Database</span>
            <span>Calendar</span>
            <span>Proposal</span>
            <span>Email</span>
            <span>Summary</span>
          </div>
          <div className="example-row">
            {examples.map((example, index) => (
              <button type="button" key={example} onClick={() => setPrompt(example)}>Example {index + 1}</button>
            ))}
          </div>
          <button className="primary-button" disabled={loading}>
            {loading ? <Play size={18} /> : <Send size={18} />}
            {loading ? "Generating..." : "Generate Workflow"}
          </button>
        </form>

        <section className="recent-panel">
          <div className="section-title">
            <div>
              <p className="eyebrow">Recent activity</p>
              <h2>Workflows</h2>
              <small>Live status from the execution engine.</small>
            </div>
            <span className="panel-icon muted"><Cpu size={20} /></span>
          </div>
          <div className="workflow-list">
            {data.workflows.length === 0 && (
              <div className="empty-state">
                <Sparkles size={22} />
                <strong>No workflows yet</strong>
                <span>Create your first automation from the prompt panel.</span>
              </div>
            )}
            {data.workflows.map((workflow) => (
              <Link to={`/workflows/${workflow.id}`} className="workflow-row" key={workflow.id}>
                <span className={`workflow-dot ${workflow.status}`} />
                <div>
                  <strong>{workflow.title}</strong>
                  <small>{new Date(workflow.createdAt).toLocaleString()}</small>
                </div>
                <StatusBadge status={workflow.status} />
                <ArrowRight className="row-arrow" size={18} />
              </Link>
            ))}
          </div>
        </section>
      </section>
    </Shell>
  );
}
