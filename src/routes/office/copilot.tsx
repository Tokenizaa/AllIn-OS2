import { createFileRoute } from "@tanstack/react-router";
import { CopilotPage } from "./CopilotPage";

export const Route = createFileRoute("/office/copilot")({
  component: CopilotPage,
});
