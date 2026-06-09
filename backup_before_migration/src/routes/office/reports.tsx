import { createFileRoute } from "@tanstack/react-router";
import { ReportsPage } from "./ReportsPage";

export const Route = createFileRoute("/office/reports")({
  component: ReportsPage,
});
