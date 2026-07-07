import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";

const demoUserId = uuid();
const demoWorkflowId = uuid();
const now = new Date();

export const db = {
  users: [
    {
      id: demoUserId,
      name: "Sakshi",
      email: "demo@autoflow.ai",
      password: bcrypt.hashSync("demo1234", 10),
      role: "Founder"
    }
  ],
  workflows: [
    {
      id: demoWorkflowId,
      title: "Client onboarding for Tesla",
      prompt:
        "Create a client called Tesla, schedule a meeting tomorrow at 3 PM, generate a proposal, and notify the sales team.",
      status: "completed",
      userId: demoUserId,
      createdAt: new Date(now.getTime() - 1000 * 60 * 42).toISOString()
    },
    {
      id: uuid(),
      title: "Weekly product report",
      prompt: "Summarize product metrics and send a weekly report to leadership.",
      status: "running",
      userId: demoUserId,
      createdAt: new Date(now.getTime() - 1000 * 60 * 12).toISOString()
    },
    {
      id: uuid(),
      title: "HR onboarding sequence",
      prompt: "Create onboarding tasks, schedule welcome call, and email documents.",
      status: "completed",
      userId: demoUserId,
      createdAt: new Date(now.getTime() - 1000 * 60 * 90).toISOString()
    }
  ],
  tasks: [
    {
      id: uuid(),
      workflowId: demoWorkflowId,
      agent: "DatabaseAgent",
      task: "Create Tesla client record",
      status: "completed",
      startedAt: new Date(now.getTime() - 1000 * 60 * 40).toISOString(),
      endedAt: new Date(now.getTime() - 1000 * 60 * 39).toISOString(),
      output: "Client record created with segment Enterprise."
    },
    {
      id: uuid(),
      workflowId: demoWorkflowId,
      agent: "CalendarAgent",
      task: "Schedule discovery meeting",
      status: "completed",
      startedAt: new Date(now.getTime() - 1000 * 60 * 39).toISOString(),
      endedAt: new Date(now.getTime() - 1000 * 60 * 38).toISOString(),
      output: "Meeting scheduled for tomorrow at 3:00 PM."
    },
    {
      id: uuid(),
      workflowId: demoWorkflowId,
      agent: "ProposalAgent",
      task: "Generate client proposal",
      status: "completed",
      startedAt: new Date(now.getTime() - 1000 * 60 * 38).toISOString(),
      endedAt: new Date(now.getTime() - 1000 * 60 * 37).toISOString(),
      output: "Draft proposal generated with timeline, pricing, and goals."
    }
  ],
  logs: [
    {
      id: uuid(),
      workflowId: demoWorkflowId,
      message: "Planner generated 3 executable tasks.",
      timestamp: new Date(now.getTime() - 1000 * 60 * 41).toISOString()
    },
    {
      id: uuid(),
      workflowId: demoWorkflowId,
      message: "Execution completed successfully.",
      timestamp: new Date(now.getTime() - 1000 * 60 * 37).toISOString()
    }
  ]
};
