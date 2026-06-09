import { createFileRoute } from "@tanstack/react-router";

import { LoginView } from "@/components/auth/login-view";

export const Route = createFileRoute("/login")({
  component: LoginRoute,
});

function LoginRoute() {
  return <LoginView />;
}
