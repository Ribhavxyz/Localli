export default function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 border-r border-zinc-800 bg-zinc-900 md:flex md:flex-col">
      <div className="border-b border-zinc-800 px-6 py-5">
        <p className="text-sm font-medium text-zinc-300">Localli Intelligence</p>
      </div>
      <nav className="flex flex-1 flex-col gap-2 px-3 py-4">
        <a
          href="#"
          className="flex items-center gap-3 rounded-lg bg-[#4F7CFF]/20 px-3 py-2 text-sm font-medium text-white"
        >
          <DashboardIcon />
          <span>Dashboard</span>
        </a>
        <a
          href="#"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
        >
          <ClustersIcon />
          <span>Clusters</span>
        </a>
        <a
          href="#"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
        >
          <MapIcon />
          <span>Opportunity Map</span>
        </a>
        <a
          href="#"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
        >
          <CompetitionIcon />
          <span>Competition</span>
        </a>
      </nav>
    </aside>
  );
}

function DashboardIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect height="7" rx="1.5" stroke="currentColor" strokeWidth="1.75" width="7" x="3" y="3" />
      <rect height="11" rx="1.5" stroke="currentColor" strokeWidth="1.75" width="7" x="14" y="3" />
      <rect height="7" rx="1.5" stroke="currentColor" strokeWidth="1.75" width="7" x="14" y="14" />
      <rect height="11" rx="1.5" stroke="currentColor" strokeWidth="1.75" width="7" x="3" y="10" />
    </svg>
  );
}

function ClustersIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="6.5" cy="7" fill="currentColor" r="2.5" />
      <circle cx="17.5" cy="7" fill="currentColor" r="2.5" />
      <circle cx="12" cy="16.5" fill="currentColor" r="2.5" />
      <path d="M8.7 8.5L10.8 12" stroke="currentColor" strokeLinecap="round" strokeWidth="1.75" />
      <path d="M15.3 8.5L13.2 12" stroke="currentColor" strokeLinecap="round" strokeWidth="1.75" />
    </svg>
  );
}

function MapIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M3.75 6.5L9 4.25L15 6.5L20.25 4.25V17.5L15 19.75L9 17.5L3.75 19.75V6.5Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.75" />
      <path d="M9 4.25V17.5" stroke="currentColor" strokeWidth="1.75" />
      <path d="M15 6.5V19.75" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

function CompetitionIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M6 17L10 13L13 16L18 10" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
      <path d="M16 10H18V12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
      <path d="M4 20H20" stroke="currentColor" strokeLinecap="round" strokeWidth="1.75" />
    </svg>
  );
}
