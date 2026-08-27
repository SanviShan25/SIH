import React from 'react';
import { Download } from 'lucide-react';

interface TopbarProps { onToggleMobile: () => void; onDownload: () => void; lastAssessment: string; canDownload: boolean; }

export const Topbar: React.FC<TopbarProps> = ({ onToggleMobile, onDownload, lastAssessment, canDownload }) => <header className="h-[76px] shrink-0 bg-white border-b border-outline-variant flex items-center justify-between px-4 md:px-7 z-10">
  <div className="flex items-center gap-3"><button type="button" onClick={onToggleMobile} className="md:hidden p-2 rounded-lg text-on-surface-variant hover:bg-surface-container" aria-label="Open navigation"><span className="material-symbols-outlined">menu</span></button><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">State operations desk</p><h2 className="text-lg font-bold text-on-surface">Flood impact assessment</h2></div></div>
  <div className="flex items-center gap-3"><div className="hidden lg:block text-right"><p className="text-[10px] uppercase tracking-wider text-on-surface-variant">Last assessment</p><p className="text-xs font-semibold text-on-surface">{lastAssessment}</p></div><div className="flex items-center gap-2 rounded-full bg-amber-50 border border-amber-200 px-3 py-2 text-xs font-bold text-amber-800"><span className="w-2 h-2 rounded-full bg-amber-500" /> <span className="hidden sm:inline">Awaiting Drone Survey</span><span className="sm:hidden">Awaiting</span></div><button type="button" onClick={onDownload} disabled={!canDownload} aria-label="Download government report" title="Download government report" className="hidden sm:flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-xs font-bold text-white disabled:opacity-40"><Download size={15} /> Report</button></div>
</header>;
