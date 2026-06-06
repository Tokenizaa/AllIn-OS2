import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/office/store")({
  lazy: () => import("./StorePage").then(m => ({ default: m.StorePage })),
});
