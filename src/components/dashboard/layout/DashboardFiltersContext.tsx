"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type DashboardFiltersContextValue = {
  days: number;
  setDays: (days: number) => void;
};

const DashboardFiltersContext = createContext<DashboardFiltersContextValue | undefined>(undefined);

interface DashboardFiltersProviderProps {
  children: ReactNode;
}

export function DashboardFiltersProvider({ children }: DashboardFiltersProviderProps) {
  const [days, setDays] = useState(7);

  const value = useMemo(
    () => ({
      days,
      setDays,
    }),
    [days]
  );

  return (
    <DashboardFiltersContext.Provider value={value}>
      {children}
    </DashboardFiltersContext.Provider>
  );
}

export function useDashboardFilters() {
  const context = useContext(DashboardFiltersContext);
  if (!context) {
    throw new Error("useDashboardFilters must be used within DashboardFiltersProvider");
  }
  return context;
}
