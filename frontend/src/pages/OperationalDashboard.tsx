import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { getDashboardSummary } from '../api/disasterApi';
import type { DashboardSummaryResponse } from '../api/disasterApi';
import { getSocket } from '../api/socketClient';

export const OperationalDashboard: React.FC = () => {
  const [data, setData] = useState<DashboardSummaryResponse | null>(null);
  const [liveTelemetry, setLiveTelemetry] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const summary = await getDashboardSummary();
        if (isMounted) {
          setData(summary);
        }
      } catch (err) {
        console.error('Failed to load dashboard summary:', err);
      }
    }

    loadData();

    // Subscribe to live telemetry and alerts
    const socket = getSocket();
    socket.on('telemetry:update', (telemetry) => {
      if (isMounted) setLiveTelemetry(telemetry);
    });

    socket.on('alert:new', (newAlert) => {
      if (isMounted) {
        setData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            recentAlerts: [newAlert, ...prev.recentAlerts.slice(0, 2)],
          };
        });
      }
    });

    return () => {
      isMounted = false;
      socket.off('telemetry:update');
      socket.off('alert:new');
    };
  }, []);

  const waterSpread = data?.waterSpread || {
    coveragePercentage: 68,
    trend: 'Increasing',
    direction: 'South-East',
    changeSincePreviousSurvey: '+13%',
  };

  const settlements = data?.settlements || { totalCount: 5, inundatedCount: 5 };
  const roadAccessibility = data?.roadAccessibility || { overallPercentage: 62, openRoads: 12, blockedRoads: 2, submergedRoads: 3 };
  const infrastructureImpact = data?.infrastructureImpact || { totalTracked: 4, atRisk: 1, flooded: 1, accessible: 2 };
  const dronesAvailable = data?.dronesAvailable || { active: 1, standby: 1, total: 2 };
  const alerts = data?.recentAlerts || [];

  return (
    <div className="p-4 md:p-6 lg:p-gutter w-full h-full flex flex-col xl:flex-row gap-gutter">
      {/* Left / Center Section */}
      <div className="flex-1 flex flex-col gap-gutter min-w-0">
        {/* Stats Row - 5 Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-gutter">
          {/* Stat Card 1: Water Coverage & Spread */}
          <Link
            to="/water-coverage"
            className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md flex flex-col gap-xs relative overflow-hidden group shadow-xs hover:border-primary transition-all cursor-pointer"
          >
            <div className="flex justify-between items-center text-on-surface-variant">
              <span className="font-label-md text-label-md uppercase tracking-wider">Water Coverage</span>
              <span className="material-symbols-outlined text-primary-container" data-icon="water">water</span>
            </div>
            <div className="flex items-baseline gap-sm">
              <span className="font-headline-lg text-headline-lg text-on-surface">{waterSpread.coveragePercentage}%</span>
              <span className="font-data-mono text-data-mono text-error flex items-center text-xs font-semibold">
                <span className="material-symbols-outlined text-[14px]" data-icon="trending_up">trending_up</span>
                {waterSpread.changeSincePreviousSurvey}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-on-surface-variant font-medium">
              <span>Spread: {waterSpread.trend} ({waterSpread.direction})</span>
            </div>
            <div className="absolute bottom-0 left-0 h-1 bg-primary-container w-[68%] transition-all"></div>
          </Link>

          {/* Stat Card 2: Affected Settlements */}
          <Link
            to="/affected-settlements"
            className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md flex flex-col gap-xs relative overflow-hidden group shadow-xs hover:border-error transition-all cursor-pointer"
          >
            <div className="flex justify-between items-center text-on-surface-variant">
              <span className="font-label-md text-label-md uppercase tracking-wider">Affected Settlements</span>
              <span className="material-symbols-outlined text-error" data-icon="location_city">location_city</span>
            </div>
            <div className="flex items-baseline gap-sm">
              <span className="font-headline-lg text-headline-lg text-error">{settlements.totalCount}</span>
              <span className="text-[11px] text-error font-medium">Zones Inundated</span>
            </div>
            <div className="text-[11px] text-on-surface-variant truncate font-medium">
              Sector 12, Riverside +3
            </div>
            <div className="absolute bottom-0 left-0 h-1 bg-error w-full"></div>
          </Link>

          {/* Stat Card 3: Road Accessibility */}
          <Link
            to="/road-accessibility"
            className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md flex flex-col gap-xs relative overflow-hidden group shadow-xs hover:border-[#f59e0b] transition-all cursor-pointer"
          >
            <div className="flex justify-between items-center text-on-surface-variant">
              <span className="font-label-md text-label-md uppercase tracking-wider">Road Accessibility</span>
              <span className="material-symbols-outlined text-[#f59e0b]" data-icon="alt_route">alt_route</span>
            </div>
            <div className="flex items-baseline gap-sm">
              <span className="font-headline-lg text-headline-lg text-on-surface">{roadAccessibility.overallPercentage}%</span>
              <span className="text-[11px] text-on-surface-variant font-medium">Accessible</span>
            </div>
            <div className="text-[11px] text-on-surface-variant truncate font-medium">
              {roadAccessibility.openRoads} Open · {roadAccessibility.blockedRoads} Blocked · {roadAccessibility.submergedRoads} Submerged
            </div>
            <div className="absolute bottom-0 left-0 h-1 bg-[#f59e0b] w-[62%] opacity-80"></div>
          </Link>

          {/* Stat Card 4: Infrastructure Impact */}
          <Link
            to="/infrastructure-impact"
            className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md flex flex-col gap-xs relative overflow-hidden group shadow-xs hover:border-primary transition-all cursor-pointer"
          >
            <div className="flex justify-between items-center text-on-surface-variant">
              <span className="font-label-md text-label-md uppercase tracking-wider">Infra Impact</span>
              <span className="material-symbols-outlined text-primary-container" data-icon="domain">domain</span>
            </div>
            <div className="flex items-baseline gap-sm">
              <span className="font-headline-lg text-headline-lg text-on-surface">{infrastructureImpact.totalTracked}</span>
              <span className="text-[11px] text-on-surface-variant font-medium">Assets Tracked</span>
            </div>
            <div className="text-[11px] text-on-surface-variant truncate font-medium">
              {infrastructureImpact.atRisk} Risk · {infrastructureImpact.flooded} Flooded · {infrastructureImpact.accessible} Accessible
            </div>
            <div className="absolute bottom-0 left-0 h-1 bg-primary-container w-full opacity-30"></div>
          </Link>

          {/* Stat Card 5: Drones Available */}
          <Link
            to="/drone-missions"
            className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md flex flex-col gap-xs relative overflow-hidden group shadow-xs col-span-2 sm:col-span-1 hover:border-[#10b981] transition-all cursor-pointer"
          >
            <div className="flex justify-between items-center text-on-surface-variant">
              <span className="font-label-md text-label-md uppercase tracking-wider">Drones Available</span>
              <Logo className="w-8 h-7 text-[#10b981] shrink-0" />
            </div>
            <div className="flex items-baseline gap-sm">
              <span className="font-headline-lg text-headline-lg text-on-surface">{dronesAvailable.active + dronesAvailable.standby}</span>
              <span className="text-[11px] text-emerald-600 font-medium">
                {liveTelemetry ? `DRONE-001 · ${liveTelemetry.battery}%` : 'Mission Ready'}
              </span>
            </div>
            <div className="text-[11px] text-on-surface-variant truncate font-medium">
              Drone-01 &amp; Drone-02
            </div>
            <div className="absolute bottom-0 left-0 h-1 bg-[#10b981] w-full opacity-50"></div>
          </Link>
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
                <span className="material-symbols-outlined text-[11px]">deck</span> Bridge B-02 (Risk)
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
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`border border-outline-variant rounded-lg bg-surface-bright p-md flex flex-col gap-sm relative overflow-hidden shadow-xs ${
                alert.severity === 'Critical' ? 'border-l-4 border-l-error' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <span
                  className={`font-label-md text-label-md flex items-center gap-xs font-bold ${
                    alert.severity === 'Critical'
                      ? 'text-error'
                      : alert.severity === 'Warning'
                      ? 'text-[#f59e0b]'
                      : 'text-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {alert.severity === 'Critical' ? 'warning' : alert.severity === 'Warning' ? 'deck' : 'info'}
                  </span>
                  {alert.title}
                </span>
                <span className="font-label-md text-label-md text-on-surface-variant shrink-0">{alert.time}</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface text-xs leading-relaxed">{alert.body}</p>
              {alert.area && (
                <div className="font-data-mono text-[10px] text-on-surface-variant font-semibold">
                  Area: {alert.area}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
