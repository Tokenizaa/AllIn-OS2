import { createFileRoute } from "@tanstack/react-router";
import { PlansDashboard } from "../../components/plans/PlansDashboard";

export const Route = createFileRoute("/admin/plans")({
  component: PlansPage,
});

function PlansPage() {
  return <PlansDashboard />;
}
