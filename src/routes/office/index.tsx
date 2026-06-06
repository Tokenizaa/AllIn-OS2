import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/office/")({
  lazy: () => import("./Dashboard").then(m => ({ default: m.Dashboard })),
});
