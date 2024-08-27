"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Sidebar from "./_components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarWidth, setSidebarWidth] = useState(280); // Default width
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-full relative">
        <Sidebar onWidthChange={setSidebarWidth} />
        <main
          className="transition-all duration-100 ease-in-out"
          style={{ marginLeft: `${sidebarWidth}px` }}
        >
          <div className="p-8">{children}</div>
        </main>
      </div>
    </QueryClientProvider>
  );
}
