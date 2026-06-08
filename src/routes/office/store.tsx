import { createFileRoute } from "@tanstack/react-router";
import { StorePage } from "./StorePage";

export const Route = createFileRoute("/office/store")({
  component: StorePage,
});
