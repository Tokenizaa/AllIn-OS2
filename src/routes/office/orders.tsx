import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/office/orders")({
  lazy: () => import("./OrdersPage").then(m => ({ default: m.OrdersPage })),
});
