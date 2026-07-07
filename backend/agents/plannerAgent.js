const agentRules = [
  { agent: "DatabaseAgent", keywords: ["create", "database", "client", "project", "record", "save"] },
  { agent: "CalendarAgent", keywords: ["schedule", "meeting", "calendar", "tomorrow", "call"] },
  { agent: "ProposalAgent", keywords: ["proposal", "quote", "deck", "document"] },
  { agent: "EmailAgent", keywords: ["email", "mail", "send"] },
  { agent: "NotificationAgent", keywords: ["notify", "notification", "team", "slack"] },
  { agent: "SummaryAgent", keywords: ["summary", "summarize", "notes", "report"] }
];

function sentenceCase(text) {
  const trimmed = text.trim().replace(/\s+/g, " ");
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

function chooseAgent(task) {
  const lower = task.toLowerCase();
  return agentRules.find((rule) => rule.keywords.some((keyword) => lower.includes(keyword)))?.agent || "SummaryAgent";
}

function workflowTitle(prompt) {
  const first = prompt.split(/[.\n]/).find(Boolean) || "Automated workflow";
  return sentenceCase(first).slice(0, 72);
}

export function planWorkflow(prompt) {
  const tasks = prompt
    .split(/\n|\.|,| and /i)
    .map((part) => part.trim())
    .filter((part) => part.length > 2)
    .slice(0, 8);

  const normalizedTasks = tasks.length ? tasks : [prompt];

  return {
    title: workflowTitle(prompt),
    workflow: normalizedTasks.map((task) => ({
      agent: chooseAgent(task),
      task: sentenceCase(task)
    }))
  };
}
