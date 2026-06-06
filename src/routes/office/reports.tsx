import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/office/reports")({
  lazy: () => import("./ReportsPage").then(m => ({ default: m.ReportsPage })),
});
