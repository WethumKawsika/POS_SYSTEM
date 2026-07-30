import type { ReactNode } from "react";

export function DashboardShell({
  title,
  children,
}: Readonly<{
  title: string;
  children: ReactNode;
}>) {
  return (
    <div className="space-y-6 p-6">
      <header className="border-b border-slate-200 pb-4 dark:border-slate-800">
        <h1 className="text-2xl font-semibold">{title}</h1>
      </header>
      <main>{children}</main>
    </div>
  );
}
