import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/office/plan")({
  lazy: () => import("./PlanPage").then(m => ({ default: m.PlanPage })),
});
