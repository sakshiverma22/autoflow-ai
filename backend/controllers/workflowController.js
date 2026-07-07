import { v4 as uuid } from "uuid";
import { db } from "../database/store.js";
import { planWorkflow } from "../agents/plannerAgent.js";
import { executeWorkflow } from "../services/executionEngine.js";

function serializeWorkflow(workflow) {
  return {
    ...workflow,
    tasks: db.tasks.filter((task) => task.workflowId === workflow.id),
    logs: db.logs.filter((log) => log.workflowId === workflow.id).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
  };
}

export function listWorkflows(req, res) {
  const workflows = db.workflows
    .filter((workflow) => workflow.userId === req.user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const stats = {
    total: workflows.length,
    running: workflows.filter((item) => item.status === "running").length,
    completed: workflows.filter((item) => item.status === "completed").length,
    failed: workflows.filter((item) => item.status === "failed").length
  };

  res.json({ workflows, stats });
}

export function getWorkflow(req, res) {
  const workflow = db.workflows.find((item) => item.id === req.params.id && item.userId === req.user.id);
  if (!workflow) return res.status(404).json({ message: "Workflow not found" });
  res.json({ workflow: serializeWorkflow(workflow) });
}

export function createWorkflow(req, res) {
  const { prompt } = req.body;
  if (!prompt || prompt.trim().length < 10) {
    return res.status(400).json({ message: "Describe the workflow in at least 10 characters" });
  }

  const plan = planWorkflow(prompt);
  const workflow = {
    id: uuid(),
    title: plan.title,
    prompt,
    status: "queued",
    userId: req.user.id,
    createdAt: new Date().toISOString()
  };

  db.workflows.push(workflow);
  db.logs.push({
    id: uuid(),
    workflowId: workflow.id,
    message: `Planner generated ${plan.workflow.length} executable tasks.`,
    timestamp: new Date().toISOString()
  });

  for (const item of plan.workflow) {
    db.tasks.push({
      id: uuid(),
      workflowId: workflow.id,
      agent: item.agent,
      task: item.task,
      status: "waiting",
      startedAt: null,
      endedAt: null,
      output: null
    });
  }

  executeWorkflow(workflow.id);
  res.status(201).json({ workflow: serializeWorkflow(workflow), plan });
}
