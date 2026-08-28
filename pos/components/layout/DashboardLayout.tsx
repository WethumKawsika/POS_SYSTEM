"use client";

import { useState, type ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

export function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-slate-950">
      {sidebarOpen && <button type="button" aria-label="Close navigation" className="fixed inset-0 z-20 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <div className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-30 transition-transform lg:static lg:translate-x-0`}>
        <Sidebar />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <Header title="Smart Retail POS" onMenuClick={() => setSidebarOpen(true)} />
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
