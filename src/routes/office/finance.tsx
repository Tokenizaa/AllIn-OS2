import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/office/finance")({
  lazy: () => import("./FinancePage").then(m => ({ default: m.FinancePage })),
});
