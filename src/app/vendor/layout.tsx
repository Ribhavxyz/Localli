import type { ReactNode } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";

interface VendorLayoutProps {
  children: ReactNode;
}

export default function VendorLayout({ children }: VendorLayoutProps) {
  return (
    <ProtectedRoute requiredRole="VENDOR">
      <div className="min-h-screen bg-[#0A0A0A] text-white">
        <main className="mx-auto w-full max-w-[1600px] px-6 py-8">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
