"use client";

import { useDashboardFilters } from "@/components/dashboard/layout/DashboardFiltersContext";

export default function Topbar() {
  const { days, setDays } = useDashboardFilters();

  return (
    <header className="flex h-16 items-center justify-between border-b border-zinc-800 bg-zinc-950 px-6">
      <div className="flex items-center gap-3">
        <button
          aria-label="Open navigation"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 md:hidden"
          type="button"
        >
          <MenuIcon />
        </button>
        <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
          Intelligence Dashboard
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <label className="sr-only" htmlFor="days-range">
          Select day range
        </label>
        <select
          className="h-9 rounded-lg border border-zinc-800 bg-zinc-900 px-3 text-sm text-zinc-200 outline-none ring-[#4F7CFF] transition focus:ring-2"
          id="days-range"
          onChange={(event) => setDays(Number(event.target.value))}
          value={days}
        >
          <option value="7">7 days</option>
          <option value="14">14 days</option>
          <option value="30">30 days</option>
        </select>
        <div className="h-9 w-9 rounded-full bg-[#4F7CFF]" />
      </div>
    </header>
  );
}

function MenuIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M4 7H20" stroke="currentColor" strokeLinecap="round" strokeWidth="1.75" />
      <path d="M4 12H20" stroke="currentColor" strokeLinecap="round" strokeWidth="1.75" />
      <path d="M4 17H20" stroke="currentColor" strokeLinecap="round" strokeWidth="1.75" />
    </svg>
  );
}
