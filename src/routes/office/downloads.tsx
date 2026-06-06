import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/office/downloads")({
  lazy: () => import("./DownloadsPage").then(m => ({ default: m.DownloadsPage })),
});
