import React, { useState, useEffect } from 'react';
import { getFloodProgressionTimeline, getWaterCoverageSummary } from '../api/disasterApi';
import type { ProgressionStep } from '../data/mockData';

export const FloodProgressionPrediction: React.FC = () => {
  const [timeline, setTimeline] = useState<ProgressionStep[]>([]);
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [tl, sum] = await Promise.all([
          getFloodProgressionTimeline(),
          getWaterCoverageSummary(),
        ]);
        if (isMounted) {
          setTimeline(tl);
          setSummary(sum);
        }
      } catch (err) {
        console.error('Failed to load progression data:', err);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  const waterSpreadData = summary || {
    coveragePercentage: 68,
    trend: 'Increasing',
    direction: 'South-East',
    changeSincePreviousSurvey: '+13%',
  };
  return (
    <div className="p-4 md:p-6 lg:p-xl w-full min-h-full flex flex-col gap-6">
      {/* Header & Actions */}
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div>
          <h1 className="font-display-lg text-2xl md:text-display-lg text-on-surface font-bold">
            Flood Impact Analysis
          </h1>
          <p className="font-body-lg text-sm md:text-body-lg text-on-surface-variant mt-1">
            Real-time water level regression analysis, water spread dynamics, and accessibility evolution.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 bg-surface-container-high rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-variant transition-colors text-xs font-semibold shadow-xs">
            <span className="material-symbols-outlined text-base">download</span>
            <span>Export Data</span>
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 bg-primary-container text-on-primary-container rounded-lg hover:opacity-90 transition-colors text-xs font-bold shadow-xs">
            <span className="material-symbols-outlined text-base">refresh</span>
            <span>Refresh Models</span>
          </button>
        </div>
      </div>

      {/* Dynamic Summary Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Evolution Card 1: Water Coverage Trend */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-xs">
          <div className="flex justify-between items-center text-on-surface-variant mb-1">
            <span className="text-xs uppercase font-bold tracking-wider">Water Coverage Trend</span>
            <span className="material-symbols-outlined text-primary-container">water</span>
          </div>
          <div className="text-2xl font-bold text-on-surface flex items-baseline gap-2">
            42% <span className="text-sm font-normal text-on-surface-variant">→</span> 55% <span className="text-sm font-normal text-on-surface-variant">→</span> <span className="text-error font-extrabold">68%</span>
          </div>
          <p className="text-[11px] text-error mt-1 font-medium flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px]">trending_up</span> {waterSpreadData.changeSincePreviousSurvey} in past 4 hours
          </p>
        </div>

        {/* Evolution Card 2: Road Accessibility */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-xs">
          <div className="flex justify-between items-center text-on-surface-variant mb-1">
            <span className="text-xs uppercase font-bold tracking-wider">Road Accessibility</span>
            <span className="material-symbols-outlined text-[#f59e0b]">alt_route</span>
          </div>
          <div className="text-2xl font-bold text-on-surface flex items-baseline gap-2">
            78% <span className="text-sm font-normal text-on-surface-variant">→</span> 70% <span className="text-sm font-normal text-on-surface-variant">→</span> <span className="text-[#a33500] font-extrabold">62%</span>
          </div>
          <p className="text-[11px] text-on-surface-variant mt-1 font-medium">
            12 Open · 2 Blocked · 3 Submerged
          </p>
        </div>

        {/* Evolution Card 3: Affected Settlements */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-xs">
          <div className="flex justify-between items-center text-on-surface-variant mb-1">
            <span className="text-xs uppercase font-bold tracking-wider">Settlements Inundated</span>
            <span className="material-symbols-outlined text-error">location_city</span>
          </div>
          <div className="text-2xl font-bold text-on-surface flex items-baseline gap-2">
            2 <span className="text-sm font-normal text-on-surface-variant">→</span> 3 <span className="text-sm font-normal text-on-surface-variant">→</span> <span className="text-error font-extrabold">5 Settlements</span>
          </div>
          <p className="text-[11px] text-error mt-1 font-medium">
            Sector 12 &amp; Riverside affected
          </p>
        </div>

        {/* Evolution Card 4: Water Spread Direction */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-xs">
          <div className="flex justify-between items-center text-on-surface-variant mb-1">
            <span className="text-xs uppercase font-bold tracking-wider">Spread Velocity &amp; Vector</span>
            <span className="material-symbols-outlined text-primary">south_east</span>
          </div>
          <div className="text-lg font-bold text-primary flex items-baseline gap-1">
            {waterSpreadData.trend} · {waterSpreadData.direction}
          </div>
          <p className="text-[11px] text-on-surface-variant mt-1 font-medium">
            Velocity: {waterSpreadData.flowVelocity} · Peak: {waterSpreadData.peakHeight}
          </p>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Progression Chart & Inundation Timeline */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Historical Progression & Hourly Timeline Table */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-xs">
            <h3 className="font-headline-md text-sm font-bold text-on-surface mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-base">history_toggle_off</span>
              Flood Evolution Chronology (Hourly Survey)
            </h3>
            <div className="overflow-x-auto rounded-lg border border-outline-variant">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant text-primary font-bold uppercase tracking-wider">
                    <th className="py-2.5 px-3">Time</th>
                    <th className="py-2.5 px-3">Water Coverage</th>
                    <th className="py-2.5 px-3">Spread Vector</th>
                    <th className="py-2.5 px-3">Road Access</th>
                    <th className="py-2.5 px-3">Settlements</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/40 text-on-surface">
                  {timeline.map((step, idx) => (
                    <tr key={idx} className={`hover:bg-surface-container-low/40 transition-colors ${idx === 2 ? 'bg-primary-container/5 font-semibold' : ''}`}>
                      <td className="py-2.5 px-3 font-mono">
                        {step.time} {idx === 2 && <span className="text-[10px] bg-primary text-white px-1.5 py-0.2 rounded font-sans ml-1">LATEST</span>}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-surface-variant h-1.5 rounded-full overflow-hidden">
                            <div className="bg-primary-container h-full rounded-full" style={{ width: `${step.waterCoverage}%` }} />
                          </div>
                          <span>{step.waterCoverage}%</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="text-on-surface-variant">{step.spreadTrend} ({step.spreadDirection})</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`font-semibold ${step.roadAccessibility < 65 ? 'text-[#a33500]' : 'text-emerald-700'}`}>
                          {step.roadAccessibility}% ({step.openRoads} Open)
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-error font-medium">
                        {step.affectedSettlements} Inundated
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Chart Panel */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-xs">
            <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
              <h3 className="font-headline-md text-sm font-bold text-on-surface">
                Water Level Progression (Sector 12 &amp; Riverside)
              </h3>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5 font-medium text-on-surface-variant">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span> Past 24h Actual
                </span>
                <span className="flex items-center gap-1.5 font-medium text-on-surface-variant">
                  <span className="w-2.5 h-2.5 rounded-full bg-error border border-error-container border-dashed"></span>
                  Predicted (Next 12h)
                </span>
              </div>
            </div>

            {/* SVG Chart Visualization */}
            <div className="w-full h-72 bg-surface-container rounded-lg border border-outline-variant flex items-center justify-center relative overflow-hidden">
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                {/* Historical line */}
                <path
                  d="M0,80 Q10,75 20,70 T40,60 T60,40 T70,30"
                  fill="none"
                  stroke="#595e6c"
                  strokeWidth="2"
                />
                {/* Projected dashed line */}
                <path
                  d="M70,30 Q80,20 90,15 T100,5"
                  fill="none"
                  stroke="#ba1a1a"
                  strokeDasharray="4 2"
                  strokeWidth="2"
                />

                {/* Threshold lines */}
                <line opacity="0.5" stroke="#ba1a1a" strokeDasharray="2 2" strokeWidth="0.5" x1="0" x2="100" y1="20" y2="20" />
                <text className="font-data-mono" fill="#ba1a1a" fontSize="3" x="2" y="18">Critical Threshold (4.0m)</text>

                <line opacity="0.5" stroke="#a33500" strokeDasharray="2 2" strokeWidth="0.5" x1="0" x2="100" y1="50" y2="50" />
                <text className="font-data-mono" fill="#a33500" fontSize="3" x="2" y="48">Warning Threshold (2.5m)</text>

                {/* Current time indicator */}
                <line opacity="0.3" stroke="#434654" strokeWidth="0.5" x1="70" x2="70" y1="0" y2="100" />
                <text className="font-data-mono" fill="#434654" fontSize="2.5" x="66" y="96">NOW (14:30)</text>
              </svg>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Probability Metrics & Meteorological Data */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Probability Metrics */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-outline-variant">
              <span className="material-symbols-outlined text-primary">pie_chart</span>
              <h3 className="font-headline-md text-sm font-bold text-on-surface">Probability Risk Indices</h3>
            </div>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center p-2.5 bg-surface-container rounded-md">
                <span className="font-medium text-on-surface-variant">Bridge B-02 Structural Shear</span>
                <span className="font-mono font-bold text-error">87% (Severe)</span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-surface-container rounded-md">
                <span className="font-medium text-on-surface-variant">Settlement Evacuation Need</span>
                <span className="font-mono font-bold text-[#a33500]">92% (Mandatory)</span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-surface-container rounded-md">
                <span className="font-medium text-on-surface-variant">Submerged Highway 4 Clearance</span>
                <span className="font-mono font-bold text-on-surface">18% (Slow Recede)</span>
              </div>
            </div>
          </div>

          {/* Meteorological Telemetry */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-xs flex-1">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-outline-variant">
              <span className="material-symbols-outlined text-primary">cloud</span>
              <h3 className="font-headline-md text-sm font-bold text-on-surface">Meteorological Telemetry</h3>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-surface-container p-3 rounded-lg border border-outline-variant">
                <div className="text-[11px] font-semibold text-on-surface-variant mb-1">Rainfall Rate</div>
                <div className="font-display-lg text-xl font-bold text-on-surface">
                  45<span className="text-xs text-on-surface-variant font-normal ml-0.5">mm/h</span>
                </div>
              </div>
              <div className="bg-surface-container p-3 rounded-lg border border-outline-variant">
                <div className="text-[11px] font-semibold text-on-surface-variant mb-1">River Discharge</div>
                <div className="font-display-lg text-xl font-bold text-error">
                  12k<span className="text-xs text-on-surface-variant font-normal ml-0.5">m³/s</span>
                </div>
              </div>
            </div>

            <div className="bg-surface-container p-3 rounded-lg border border-outline-variant">
              <div className="text-[11px] font-semibold text-on-surface-variant mb-2">Soil Saturation Index</div>
              <div className="w-full h-2 bg-outline-variant rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[95%]"></div>
              </div>
              <div className="flex justify-between mt-1 text-[10px] font-mono">
                <span className="text-on-surface-variant">0% Dry</span>
                <span className="text-error font-bold">95% (Fully Saturated)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
