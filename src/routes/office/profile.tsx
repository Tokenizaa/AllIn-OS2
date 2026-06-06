import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/office/profile")({
  lazy: () => import("./ProfilePage").then(m => ({ default: m.ProfilePage })),
});
