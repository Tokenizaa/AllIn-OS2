import { createFileRoute } from "@tanstack/react-router";
import { OrdersPage } from "./OrdersPage";

export const Route = createFileRoute("/office/orders")({
  component: OrdersPage,
});
