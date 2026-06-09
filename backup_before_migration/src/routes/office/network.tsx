import { createFileRoute } from "@tanstack/react-router";
import { NetworkPage } from "./NetworkPage";

export const Route = createFileRoute("/office/network")({
  component: NetworkPage,
});
