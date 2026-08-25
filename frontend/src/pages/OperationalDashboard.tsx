import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { getDashboardSummary } from '../api/disasterApi';
import type { DashboardSummaryResponse } from '../api/disasterApi';
import { getSocket } from '../api/socketClient';
import { DisasterGoogleMap } from '../components/DisasterGoogleMap';

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

          <div className="flex-1 relative min-h-[360px] overflow-hidden rounded-b-lg" data-location="Sector 12">
            <DisasterGoogleMap
              layers={{
                waterLevels: true,
                waterSpread: true,
                settlements: true,
                roadStatus: true,
                infrastructure: true,
                activeAssets: true,
                safeRoutes: true,
              }}
              className="w-full h-full min-h-[360px]"
            />
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
