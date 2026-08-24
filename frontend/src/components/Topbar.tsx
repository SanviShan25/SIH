import React from 'react';
import { useLocation, Link } from 'react-router-dom';

interface TopbarProps {
  onToggleMobile?: () => void;
}

const pageTitles: Record<string, { title: string; category?: string }> = {
  '/dashboard': { title: 'Operational Dashboard', category: 'HQ Command' },
  '/flood-map': { title: 'Flood Map Intelligence', category: 'GIS & Satellite' },
  '/drone-missions': { title: 'Drone Mission Control', category: 'Autonomous Aerial Ops' },
  '/detection-analysis': { title: 'Detection & Analysis Workspace', category: 'Computer Vision AI' },
  '/rescue-coordination': { title: 'Rescue Coordination', category: 'Field Operations' },
  '/relief-camps': { title: 'Relief Camps Oversight', category: 'Logistics & Camp Welfare' },
  '/alerts': { title: 'Emergency Alert Management', category: 'Public Warning System' },
  '/incident-records': { title: 'Incident Records & Logs', category: 'Historical Archive' },
  '/flood-progression': { title: 'Flood Progression & Prediction', category: 'Hydrological Modeling' },
  '/flood-report': { title: 'Comprehensive Flood Report', category: 'Executive Summary' },
};

export const Topbar: React.FC<TopbarProps> = ({ onToggleMobile }) => {
  const location = useLocation();
  const current = pageTitles[location.pathname] || { title: 'Flood Management', category: 'Authority' };

  return (
    <header className="h-16 px-4 md:px-xl bg-surface border-b border-outline-variant flex items-center justify-between sticky top-0 z-30 shrink-0">
      {/* Left: Mobile Toggle & Page Context */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobile}
          className="md:hidden p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors"
          aria-label="Open navigation"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              {current.category || 'Operations'}
            </span>
            <span className="hidden sm:inline-block text-outline-variant font-bold">/</span>
            <h2 className="font-headline-md text-base md:text-lg font-bold text-on-surface truncate">
              {current.title}
            </h2>
          </div>
        </div>
      </div>

      {/* Center: Quick Search (Desktop) */}
      <div className="hidden lg:flex items-center bg-surface-container-high/80 rounded-full px-md py-1.5 w-80 border border-outline-variant focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
        <span className="material-symbols-outlined text-on-surface-variant text-sm mr-2">search</span>
        <input
          type="text"
          placeholder="Search coordinates, sectors, units..."
          className="bg-transparent border-none outline-none w-full text-xs text-on-surface placeholder:text-on-surface-variant"
        />
      </div>

      {/* Right: Telemetry, Notification, Profile */}
      <div className="flex items-center gap-2 md:gap-4">
        <div className="hidden sm:flex items-center gap-2 bg-surface-container-low px-2.5 py-1 rounded-full border border-outline-variant text-xs">
          <span className="font-semibold text-on-surface">Sector 12</span>
          <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
          <span className="text-on-surface-variant font-mono">DRONE-001 · 14:32</span>
        </div>

        <Link
          to="/alerts"
          className="relative p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-full transition-colors"
          title="Emergency Alerts"
        >
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full ring-2 ring-surface animate-ping"></span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full"></span>
        </Link>

        {/* Profile Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-outline-variant">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant bg-surface-container-high shrink-0">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhAqj2Ns6QjX39Zy4IzU4OPcLixqXsFox82fNB_7tapSHqdK8KECiHXlmRkaQob3jY0YxEO2n1mob0dedb2U6rewXQS86Caq_spSe1tItV7a1dvQNYWi3zQAcOMzSf6l6zuJmJGPHxrpItSNkgdBgmHFHhQCkRfiHVsXEgPQHF8z0a45Wi_blzNOC89dJ9mRmFPNc6d1WxvbC2wSSIBeXHlgixajywq2RZ9Rq5QfnbTn3sis0kahFZ"
              alt="Authority Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-semibold text-on-surface leading-tight">Cmdr. S. Verma</div>
            <div className="text-[10px] text-on-surface-variant leading-tight">NDRF Sector Ops</div>
          </div>
        </div>
      </div>
    </header>
  );
};
