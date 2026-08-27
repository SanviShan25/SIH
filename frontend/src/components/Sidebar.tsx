import React from 'react';
import { Logo } from './Logo';
import { useLocation } from 'react-router-dom';

interface SidebarProps { mobileOpen?: boolean; onCloseMobile?: () => void; }
const navItems = [
  ['Dashboard', '#dashboard-top', 'dashboard'],
  ['Flood Assessment', '#flood-assessment', 'water_drop'],
  ['Affected Settlements', '#affected-settlements', 'location_city'],
  ['Road Accessibility', '#road-accessibility', 'route'],
  ['Infrastructure Assessment', '#infrastructure-assessment', 'account_balance'],
  ['Response Planning Support', '#response-planning', 'fact_check'],
  ['Government Report', '#government-report', 'description'],
];

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const location = useLocation();
  const [active, setActive] = React.useState('#dashboard-top');
  React.useEffect(() => {
    const updateActive = () => setActive(window.location.hash || '#dashboard-top');
    updateActive();
    window.addEventListener('hashchange', updateActive);
    return () => window.removeEventListener('hashchange', updateActive);
  }, [location.pathname]);

  return <>
  {mobileOpen && <div className="fixed inset-0 bg-inverse-surface/40 z-40 md:hidden" onClick={onCloseMobile} aria-hidden="true" />}
  <aside className={`fixed top-0 left-0 bottom-0 z-50 md:z-20 w-[280px] h-screen bg-surface border-r border-outline-variant flex flex-col py-lg transition-transform duration-300 ${mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}`}>
    <div className="px-lg pb-lg border-b border-outline-variant mb-md">
      <div className="flex items-center gap-2"><Logo className="w-9 h-7 text-primary" /><h1 className="text-xl font-extrabold tracking-tight text-primary">SKY GUARDIANS</h1></div>
      <p className="text-xs text-on-surface-variant uppercase tracking-wider mt-2">Survey intelligence desk</p>
    </div>
    <nav className="flex-1 overflow-y-auto px-md space-y-1" aria-label="Assessment sections">
      {navItems.map(([name, href, icon]) => <a key={href} href={href} onClick={onCloseMobile} className={`flex items-center gap-md px-md py-sm rounded-lg text-sm font-semibold transition-colors ${active === href ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}`}><span className="material-symbols-outlined shrink-0">{icon}</span><span>{name}</span></a>)}
    </nav>
    <div className="mx-md mt-md rounded-lg border border-primary/20 bg-primary/5 p-3"><p className="text-[10px] font-bold uppercase tracking-widest text-primary">Authority review</p><p className="mt-1 text-xs leading-5 text-on-surface-variant">Observations support assessment. Operational decisions remain with designated authorities.</p></div>
  </aside>
  </>;
};
