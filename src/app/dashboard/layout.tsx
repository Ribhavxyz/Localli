import type { ReactNode } from "react";
import Sidebar from "@/components/dashboard/layout/Sidebar";
import Topbar from "@/components/dashboard/layout/Topbar";
import { DashboardFiltersProvider } from "@/components/dashboard/layout/DashboardFiltersContext";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <DashboardFiltersProvider>
      <div className="min-h-screen bg-[#0A0A0A] text-white">
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex min-h-screen flex-1 flex-col">
            <Topbar />
            <main className="flex-1">{children}</main>
          </div>
        </div>
      </div>
    </DashboardFiltersProvider>
  );
}
