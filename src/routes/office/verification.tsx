import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/office/verification")({
  lazy: () => import("./VerificationPage").then(m => ({ default: m.VerificationPage })),
});
