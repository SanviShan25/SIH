import React from 'react';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
  { name: 'Flood Map', path: '/flood-map', icon: 'map' },
  { name: 'Drone Missions', path: '/drone-missions', icon: 'precision_manufacturing' },
  { name: 'Detection & Analysis', path: '/detection-analysis', icon: 'analytics' },
  { name: 'Rescue Coordination', path: '/rescue-coordination', icon: 'emergency_share' },
  { name: 'Relief Camps', path: '/relief-camps', icon: 'location_away' },
  { name: 'Alerts', path: '/alerts', icon: 'notifications_active' },
  { name: 'Incident Records', path: '/incident-records', icon: 'description' },
  { name: 'Flood Progression', path: '/flood-progression', icon: 'qr_code_2' },
  { name: 'Flood Report', path: '/flood-report', icon: 'summarize' },
];

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-xs z-40 md:hidden transition-opacity"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed top-0 left-0 bottom-0 z-50 md:z-20
          w-[280px] h-screen bg-surface border-r border-outline-variant
          flex flex-col py-lg
          transition-transform duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Header / Logo */}
        <div className="px-lg pb-lg border-b border-outline-variant mb-md flex items-start justify-between">
          <div>
            <h1 className="font-display-lg text-headline-lg font-extrabold text-primary tracking-tight">
              SKY GUARDIANS
            </h1>
            <p className="font-label-md text-label-md text-on-surface-variant mt-xs uppercase tracking-wider">
              Disaster Management Authority
            </p>
          </div>
          {mobileOpen && (
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1 text-on-surface-variant hover:text-on-surface rounded-lg"
              aria-label="Close sidebar"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-md space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={({ isActive }) => `
                flex items-center gap-md px-md py-sm rounded-lg transition-all duration-200 ease-in-out text-sm font-medium
                ${
                  isActive
                    ? 'bg-primary-fixed text-primary font-bold border-r-4 border-primary'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }
              `}
            >
              <span className="material-symbols-outlined shrink-0" data-icon={item.icon}>
                {item.icon}
              </span>
              <span className="font-label-md text-body-md truncate">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer / System Status */}
        <div className="px-lg pt-md mt-auto border-t border-outline-variant/60">
          <div className="flex items-center justify-between p-sm bg-surface-container-low rounded-lg border border-outline-variant/50">
            <div className="flex items-center gap-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-semibold text-on-surface">OPS GRID ONLINE</span>
            </div>
            <span className="text-xs font-mono text-on-surface-variant">v2.4</span>
          </div>
        </div>
      </aside>
    </>
  );
};
