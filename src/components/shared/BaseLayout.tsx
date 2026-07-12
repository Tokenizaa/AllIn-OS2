import { Suspense } from "react";
import { Outlet } from "@tanstack/react-router";

interface BaseLayoutProps {
  sidebar: React.ReactNode;
  topbar: React.ReactNode;
  drawer?: React.ReactNode;
  maxWidth?: string;
}

export function BaseLayout({ sidebar, topbar, drawer, maxWidth = "1600px" }: BaseLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {sidebar}
      <div className="flex min-w-0 flex-1 flex-col">
        {topbar}
        <main className="flex-1 overflow-y-auto">
          <div
            className="mx-auto w-full px-4 py-6 md:px-8 md:py-8"
            style={{ maxWidth }}
          >
            <Suspense fallback={<div className="h-32 animate-pulse bg-muted rounded-lg" />}>
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>
      {drawer}
    </div>
  );
}
