import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/office/copilot")({
  lazy: () => import("./CopilotPage").then(m => ({ default: m.CopilotPage })),
});
