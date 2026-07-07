import React from "react";
import { useEffect, useState } from "react";
import { ArrowLeft, Bot, CheckCircle2, Circle, Clock3, Database, FileText, Mail, Send, CalendarDays, Workflow } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Shell from "../components/Shell.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import api from "../services/api.js";

const agentIcons = {
  DatabaseAgent: Database,
  CalendarAgent: CalendarDays,
  ProposalAgent: FileText,
  EmailAgent: Mail,
  NotificationAgent: Send,
  SummaryAgent: Bot
};

function TaskIcon({ task }) {
  const Icon = task.status === "completed" ? CheckCircle2 : task.status === "running" ? Clock3 : Circle;
  return <Icon size={20} />;
}

export default function WorkflowDetail({ user, onLogout }) {
  const { id } = useParams();
  const [workflow, setWorkflow] = useState(null);

  useEffect(() => {
    async function load() {
      const res = await api.get(`/workflows/${id}`);
      setWorkflow(res.data.workflow);
    }
    load();
    const interval = setInterval(load, 900);
    return () => clearInterval(interval);
  }, [id]);

  if (!workflow) {
    return <Shell user={user} onLogout={onLogout}><p>Loading workflow...</p></Shell>;
  }

  return (
    <Shell user={user} onLogout={onLogout}>
      <header className="page-header">
        <div>
          <Link className="back-link" to="/"><ArrowLeft size={16} /> Back</Link>
          <p className="eyebrow">Workflow detail</p>
          <h1>{workflow.title}</h1>
          <p className="header-copy">{workflow.prompt}</p>
        </div>
        <StatusBadge status={workflow.status} />
      </header>

      <section className="workflow-summary">
        <div>
          <Workflow size={20} />
          <span>{workflow.tasks.length} agent tasks</span>
        </div>
        <div>
          <CheckCircle2 size={20} />
          <span>{workflow.tasks.filter((task) => task.status === "completed").length} completed</span>
        </div>
        <div>
          <Clock3 size={20} />
          <span>{workflow.logs.length} activity logs</span>
        </div>
      </section>

      <section className="detail-grid">
        <article className="execution-panel">
          <div className="section-title">
            <div>
              <p className="eyebrow">Execution engine</p>
              <h2>Agent Timeline</h2>
              <small>Each step is handled by a focused worker agent.</small>
            </div>
          </div>
          <div className="timeline">
            {workflow.tasks.map((task) => {
              const AgentIcon = agentIcons[task.agent] || Bot;
              return (
                <div className={`timeline-item ${task.status}`} key={task.id}>
                  <div className="timeline-marker"><TaskIcon task={task} /></div>
                  <div className="timeline-card">
                    <div className="task-header">
                      <span><AgentIcon size={18} /> {task.agent}</span>
                      <StatusBadge status={task.status} />
                    </div>
                    <strong>{task.task}</strong>
                    {task.output && <p>{task.output}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </article>

        <aside className="logs-panel">
          <div className="section-title">
            <div>
              <p className="eyebrow">Planner JSON</p>
              <h2>Generated Plan</h2>
              <small>Structured output created from the natural-language prompt.</small>
            </div>
          </div>
          <pre>{JSON.stringify({ workflow: workflow.tasks.map(({ agent, task }) => ({ agent, task })) }, null, 2)}</pre>
          <div className="section-title compact">
            <div>
              <p className="eyebrow">System logs</p>
              <h2>Activity</h2>
            </div>
          </div>
          <div className="logs">
            {workflow.logs.map((log) => (
              <p key={log.id}><span>{new Date(log.timestamp).toLocaleTimeString()}</span>{log.message}</p>
            ))}
          </div>
        </aside>
      </section>
    </Shell>
  );
}
