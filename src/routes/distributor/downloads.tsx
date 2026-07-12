import { createFileRoute } from "@tanstack/react-router";
import { DownloadsPage } from "./-DownloadsPage";

export const Route = createFileRoute("/distributor/downloads")({
  component: DownloadsPage,
});
