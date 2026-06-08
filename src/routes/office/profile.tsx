import { createFileRoute } from "@tanstack/react-router";
import { ProfilePage } from "./ProfilePage";

export const Route = createFileRoute("/office/profile")({
  component: ProfilePage,
});
