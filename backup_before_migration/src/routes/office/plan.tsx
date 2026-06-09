import { createFileRoute } from "@tanstack/react-router";
import { PlanPage } from "./PlanPage";

export const Route = createFileRoute("/office/plan")({
  component: PlanPage,
});
