import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/office/network")({
  lazy: () => import("./NetworkPage").then(m => ({ default: m.NetworkPage })),
});
