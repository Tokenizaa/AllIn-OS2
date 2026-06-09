import { createFileRoute } from "@tanstack/react-router";
import { VerificationPage } from "./VerificationPage";

export const Route = createFileRoute("/office/verification")({
  component: VerificationPage,
});
