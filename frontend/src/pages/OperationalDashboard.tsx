import React from 'react';
import { Logo } from '../components/Logo';
import { settlementsData, infrastructureData, roadAccessibilityData, waterSpreadData } from '../data/mockData';

export const OperationalDashboard: React.FC = () => {
  return (
    <div className="p-4 md:p-6 lg:p-gutter w-full h-full flex flex-col xl:flex-row gap-gutter">
      {/* Left / Center Section */}
      <div className="flex-1 flex flex-col gap-gutter min-w-0">
        {/* Stats Row - 5 Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-gutter">
          {/* Stat Card 1: Water Coverage & Spread */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md flex flex-col gap-xs relative overflow-hidden group shadow-xs">
            <div className="flex justify-between items-center text-on-surface-variant">
              <span className="font-label-md text-label-md uppercase tracking-wider">Water Coverage</span>
              <span className="material-symbols-outlined text-primary-container" data-icon="water">water</span>
            </div>
            <div className="flex items-baseline gap-sm">
              <span className="font-headline-lg text-headline-lg text-on-surface">{waterSpreadData.coveragePercentage}%</span>
              <span className="font-data-mono text-data-mono text-error flex items-center text-xs font-semibold">
                <span className="material-symbols-outlined text-[14px]" data-icon="trending_up">trending_up</span>
                {waterSpreadData.changeSincePreviousSurvey}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-on-surface-variant font-medium">
              <span>Spread: {waterSpreadData.trend} ({waterSpreadData.direction})</span>
            </div>
            <div className="absolute bottom-0 left-0 h-1 bg-primary-container w-[68%] transition-all"></div>
          </div>

          {/* Stat Card 2: Affected Settlements */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md flex flex-col gap-xs relative overflow-hidden group shadow-xs">
            <div className="flex justify-between items-center text-on-surface-variant">
              <span className="font-label-md text-label-md uppercase tracking-wider">Affected Settlements</span>
              <span className="material-symbols-outlined text-error" data-icon="location_city">location_city</span>
            </div>
            <div className="flex items-baseline gap-sm">
              <span className="font-headline-lg text-headline-lg text-error">{settlementsData.length}</span>
              <span className="text-[11px] text-error font-medium">Zones Inundated</span>
            </div>
            <div className="text-[11px] text-on-surface-variant truncate font-medium">
              Sector 12, Riverside +3
            </div>
            <div className="absolute bottom-0 left-0 h-1 bg-error w-full"></div>
          </div>

          {/* Stat Card 3: Road Accessibility */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md flex flex-col gap-xs relative overflow-hidden group shadow-xs">
            <div className="flex justify-between items-center text-on-surface-variant">
              <span className="font-label-md text-label-md uppercase tracking-wider">Road Accessibility</span>
              <span className="material-symbols-outlined text-[#f59e0b]" data-icon="alt_route">alt_route</span>
            </div>
            <div className="flex items-baseline gap-sm">
              <span className="font-headline-lg text-headline-lg text-on-surface">{roadAccessibilityData.overallPercentage}%</span>
              <span className="text-[11px] text-on-surface-variant font-medium">Accessible</span>
            </div>
            <div className="text-[11px] text-on-surface-variant truncate font-medium">
              {roadAccessibilityData.openRoads} Open · {roadAccessibilityData.blockedRoads} Blocked · {roadAccessibilityData.submergedRoads} Submerged
            </div>
            <div className="absolute bottom-0 left-0 h-1 bg-[#f59e0b] w-[62%] opacity-80"></div>
          </div>

          {/* Stat Card 4: Infrastructure Impact */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md flex flex-col gap-xs relative overflow-hidden group shadow-xs">
            <div className="flex justify-between items-center text-on-surface-variant">
              <span className="font-label-md text-label-md uppercase tracking-wider">Infra Impact</span>
              <span className="material-symbols-outlined text-primary-container" data-icon="domain">domain</span>
            </div>
            <div className="flex items-baseline gap-sm">
              <span className="font-headline-lg text-headline-lg text-on-surface">{infrastructureData.length}</span>
              <span className="text-[11px] text-on-surface-variant font-medium">Assets Tracked</span>
            </div>
            <div className="text-[11px] text-on-surface-variant truncate font-medium">
              1 Risk · 1 Flooded · 2 Accessible
            </div>
            <div className="absolute bottom-0 left-0 h-1 bg-primary-container w-full opacity-30"></div>
          </div>

          {/* Stat Card 5: Drones Available */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md flex flex-col gap-xs relative overflow-hidden group shadow-xs col-span-2 sm:col-span-1">
            <div className="flex justify-between items-center text-on-surface-variant">
              <span className="font-label-md text-label-md uppercase tracking-wider">Drones Available</span>
              <Logo className="w-8 h-7 text-[#10b981] shrink-0" />
            </div>
            <div className="flex items-baseline gap-sm">
              <span className="font-headline-lg text-headline-lg text-on-surface">2</span>
              <span className="text-[11px] text-emerald-600 font-medium">Mission Ready</span>
            </div>
            <div className="text-[11px] text-on-surface-variant truncate font-medium">
              Drone-01 &amp; Drone-02
            </div>
            <div className="absolute bottom-0 left-0 h-1 bg-[#10b981] w-full opacity-50"></div>
          </div>
        </div>

        {/* Main Map Area */}
        <div className="flex-1 bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden relative flex flex-col min-h-[420px]">
          <div className="p-sm md:p-md border-b border-outline-variant flex flex-wrap justify-between items-center bg-surface-bright gap-2">
            <h2 className="font-headline-md text-headline-md text-on-surface">Live GIS Map</h2>
            <div className="flex flex-wrap gap-sm">
              <span className="flex items-center gap-base px-sm py-1 rounded bg-error/10 border border-error text-error font-label-md text-label-md">
                <span className="w-2 h-2 rounded-full bg-error"></span> Settlements (5)
              </span>
              <span className="flex items-center gap-base px-sm py-1 rounded bg-primary-container/10 border border-primary-container text-primary-container font-label-md text-label-md">
                <span className="w-2 h-2 rounded-full bg-primary-container"></span> Water Spread (SE)
              </span>
              <span className="flex items-center gap-base px-sm py-1 rounded bg-[#f59e0b]/10 border border-[#f59e0b] text-[#f59e0b] font-label-md text-label-md">
                <span className="w-2 h-2 rounded-full bg-[#f59e0b]"></span> Road Alerts (5)
              </span>
              <span className="flex items-center gap-base px-sm py-1 rounded bg-emerald-600/10 border border-emerald-600 text-emerald-700 font-label-md text-label-md">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Infra Monitored (4)
              </span>
            </div>
          </div>

          <div className="flex-1 relative bg-[#eef2f5] min-h-[350px]" data-location="Sector 12">
            {/* GIS Map Image Background */}
            <div
              className="w-full h-full bg-cover bg-center absolute inset-0"
              data-alt="Top-down GIS map of urban flood zones"
              style={{
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDHUHvTauXo11PCYMgAxhVjsv8KX3CJ5ULE8I21bP8zvnBzbg2VoCYmtdcYFE13HdSBZGFpZZcmSkh2-QELLretfBtt5chwktUPXkd7m3YGYCGiqSEj3R6MiDMy6b77vqI0pFPUKnL9C4GsS5GetoLqAQPB_mAzXLo-Y4I-V0_xZ451Ezr7NVUW156dSFl9qtCcppZLZTGudciGkmg_i1yDEu5-RBdsmQlwTX1ZgCHBXtiAzIHAaR2j')`,
              }}
            />

            {/* Water Spread Direction Overlay Vector */}
            <div className="absolute top-[32%] left-[44%] pointer-events-none flex items-center gap-1 bg-primary/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs shadow-md border border-white/40 animate-pulse">
              <span className="material-symbols-outlined text-[13px]">south_east</span>
              <span>Spread: South-East (+13%)</span>
            </div>

            {/* Map Overlay Markers - Settlements */}
            <div className="absolute top-[34%] left-[46%] flex flex-col items-center cursor-pointer group">
              <div className="w-3.5 h-3.5 rounded-full bg-error animate-ping absolute" />
              <div className="w-3.5 h-3.5 rounded-full bg-error border-2 border-white shadow-sm relative flex items-center justify-center">
              </div>
              <div className="bg-error text-white text-[9px] font-bold px-1.5 py-0.2 rounded shadow-xs mt-0.5 whitespace-nowrap">
                Sector 12 Village (Affected)
              </div>
            </div>

            <div className="absolute top-[56%] left-[50%] flex flex-col items-center cursor-pointer group">
              <div className="w-3 h-3 rounded-full bg-error border-2 border-white shadow-sm" />
              <div className="bg-error-container text-error text-[9px] font-bold px-1.5 py-0.2 rounded shadow-xs mt-0.5 whitespace-nowrap border border-error/30">
                Riverside Colony (Submerged)
              </div>
            </div>

            {/* Infrastructure Markers */}
            <div className="absolute top-[40%] left-[45%] flex flex-col items-center cursor-pointer">
              <div className="bg-[#f59e0b] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm border border-white flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[11px]">bridge</span> Bridge B-02 (Risk)
              </div>
            </div>

            <div className="absolute top-[30%] left-[72%] flex flex-col items-center cursor-pointer">
              <div className="bg-emerald-700 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm border border-white flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[11px]">local_hospital</span> Hospital H-01 (Safe)
              </div>
            </div>

            {/* Relief Camp Pin */}
            <div className="absolute top-[68%] left-[62%] bg-[#10b981] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm border border-white flex items-center gap-0.5 cursor-pointer">
              <span className="material-symbols-outlined text-[12px]">home</span> Camp Alpha (2.4 km)
            </div>

            {/* Map Zoom Controls */}
            <div className="absolute bottom-md right-md bg-surface-container-lowest border border-outline-variant p-1 rounded-lg shadow-sm flex flex-col gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-surface-container-low transition-colors text-on-surface">
                <span className="material-symbols-outlined text-sm" data-icon="add">add</span>
              </button>
              <div className="h-px bg-outline-variant w-full" />
              <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-surface-container-low transition-colors text-on-surface">
                <span className="material-symbols-outlined text-sm" data-icon="remove">remove</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Recent Alerts & Live Assessments */}
      <div className="w-full xl:w-[320px] bg-surface-container-lowest border border-outline-variant rounded-lg flex flex-col shrink-0">
        <div className="p-md border-b border-outline-variant bg-surface-bright flex justify-between items-center">
          <h2 className="font-headline-md text-headline-md text-on-surface">Recent Alerts</h2>
          <span className="text-[11px] font-mono text-on-surface-variant font-semibold">LIVE LOG</span>
        </div>
        <div className="flex-1 overflow-y-auto p-md flex flex-col gap-md">
          {/* Critical Alert */}
          <div className="border border-outline-variant rounded-lg bg-surface-bright relative overflow-hidden shadow-xs">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-error" />
            <div className="p-md pl-lg flex flex-col gap-sm">
              <div className="flex justify-between items-start">
                <span className="font-label-md text-label-md text-error font-bold flex items-center gap-xs">
                  <span className="material-symbols-outlined text-[16px]" data-icon="warning">warning</span>
                  CRITICAL ALERT
                </span>
                <span className="font-label-md text-label-md text-on-surface-variant">14:32</span>
              </div>
              <h3 className="font-body-md text-body-md font-semibold text-on-surface">NEW IMPACTED ZONE DETECTED</h3>
              <div className="font-data-mono text-data-mono text-on-surface-variant text-sm">
                Loc: Sector 12 Village<br />
                Src: DRONE-001
              </div>
              <button className="mt-sm bg-surface-container-lowest border border-outline-variant text-primary font-label-md text-label-md py-sm px-md rounded hover:bg-surface-container-low transition-colors w-full flex items-center justify-center gap-xs">
                <span className="material-symbols-outlined text-[16px]" data-icon="my_location">my_location</span>
                View on Map
              </button>
            </div>
          </div>

          {/* Infrastructure Alert */}
          <div className="border border-outline-variant rounded-lg bg-surface-bright p-md flex flex-col gap-sm">
            <div className="flex justify-between items-start">
              <span className="font-label-md text-label-md text-tertiary-container flex items-center gap-xs font-bold">
                <span className="material-symbols-outlined text-[16px]" data-icon="bridge">bridge</span>
                INFRASTRUCTURE RISK
              </span>
              <span className="font-label-md text-label-md text-on-surface-variant">14:20</span>
            </div>
            <h3 className="font-body-md text-body-md text-on-surface">Bridge B-02: Flow shear 12k m³/s exceeding baseline.</h3>
          </div>

          {/* Road Accessibility Alert */}
          <div className="border border-outline-variant rounded-lg bg-surface-bright p-md flex flex-col gap-sm">
            <div className="flex justify-between items-start">
              <span className="font-label-md text-label-md text-[#f59e0b] flex items-center gap-xs font-bold">
                <span className="material-symbols-outlined text-[16px]" data-icon="alt_route">alt_route</span>
                ROAD ACCESS UPDATE
              </span>
              <span className="font-label-md text-label-md text-on-surface-variant">13:45</span>
            </div>
            <h3 className="font-body-md text-body-md text-on-surface">Highway 4 blocked by debris. North Ring Corridor open.</h3>
          </div>
        </div>
      </div>
    </div>
  );
};
