import { v4 as uuid } from "uuid";
import { db } from "../database/store.js";
import * as DatabaseAgent from "../agents/databaseAgent.js";
import * as CalendarAgent from "../agents/calendarAgent.js";
import * as ProposalAgent from "../agents/proposalAgent.js";
import * as EmailAgent from "../agents/emailAgent.js";
import * as NotificationAgent from "../agents/notificationAgent.js";
import * as SummaryAgent from "../agents/summaryAgent.js";

const runners = {
  DatabaseAgent,
  CalendarAgent,
  ProposalAgent,
  EmailAgent,
  NotificationAgent,
  SummaryAgent
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function addLog(workflowId, message) {
  db.logs.push({ id: uuid(), workflowId, message, timestamp: new Date().toISOString() });
}

export async function executeWorkflow(workflowId) {
  const workflow = db.workflows.find((item) => item.id === workflowId);
  const tasks = db.tasks.filter((task) => task.workflowId === workflowId);
  if (!workflow) return;

  workflow.status = "running";
  addLog(workflowId, "Execution engine started.");

  for (const task of tasks) {
    task.status = "running";
    task.startedAt = new Date().toISOString();
    addLog(workflowId, `${task.agent} started: ${task.task}`);
    await wait(850);

    try {
      const runner = runners[task.agent] || SummaryAgent;
      task.output = await runner.run(task.task);
      task.status = "completed";
      task.endedAt = new Date().toISOString();
      addLog(workflowId, `${task.agent} completed successfully.`);
    } catch (error) {
      task.status = "failed";
      task.endedAt = new Date().toISOString();
      workflow.status = "failed";
      addLog(workflowId, `${task.agent} failed: ${error.message}`);
      return;
    }
  }

  workflow.status = "completed";
  addLog(workflowId, "Workflow completed.");
}
