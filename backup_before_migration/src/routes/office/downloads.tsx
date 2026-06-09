import { createFileRoute } from "@tanstack/react-router";
import { DownloadsPage } from "./DownloadsPage";

export const Route = createFileRoute("/office/downloads")({
  component: DownloadsPage,
});
