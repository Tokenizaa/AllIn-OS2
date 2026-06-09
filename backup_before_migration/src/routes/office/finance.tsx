import { createFileRoute } from "@tanstack/react-router";
import { FinancePage } from "./FinancePage";

export const Route = createFileRoute("/office/finance")({
  component: FinancePage,
});
