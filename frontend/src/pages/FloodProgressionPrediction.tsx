import React from 'react';

export const FloodProgressionPrediction: React.FC = () => {
  return (
    <div className="p-4 md:p-6 lg:p-xl w-full min-h-full flex flex-col gap-6">
      {/* Header & Actions */}
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div>
          <h1 className="font-display-lg text-2xl md:text-display-lg text-on-surface font-bold">
            Flood Progression & Prediction
          </h1>
          <p className="font-body-lg text-sm md:text-body-lg text-on-surface-variant mt-1">
            Real-time water level regression analysis and predictive hydrological modeling.
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

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Progression Chart & Inundation Timeline */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Chart Panel */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-xs">
            <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
              <h3 className="font-headline-md text-sm font-bold text-on-surface">
                Water Level Progression (Sector 7)
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
            <div className="w-full h-80 bg-surface-container rounded-lg border border-outline-variant flex items-center justify-center relative overflow-hidden">
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

          {/* Timeline of Inundation */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-xs">
            <h3 className="font-headline-md text-sm font-bold text-on-surface mb-4">
              Projected Inundation Milestones
            </h3>
            <div className="relative pl-6 border-l-2 border-outline-variant space-y-4">
              {/* Timeline Item 1 */}
              <div className="relative">
                <div className="absolute w-3 h-3 bg-surface border-2 border-error rounded-full -left-[31px] top-1"></div>
                <div className="flex items-start gap-3">
                  <div className="w-16 shrink-0 font-mono text-xs text-on-surface-variant mt-0.5">15:00</div>
                  <div className="bg-error-container/10 border border-error-container rounded-lg p-3 flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-xs text-on-surface">Sector 7 Flood Barrier Breach</h4>
                      <span className="px-2 py-0.5 bg-error/10 text-error border border-error/20 rounded font-bold text-[10px]">
                        CRITICAL
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-1">
                      Water predicted to exceed levee height by 0.3m. Immediate sector evacuation recommended.
                    </p>
                  </div>
                </div>
              </div>

              {/* Timeline Item 2 */}
              <div className="relative">
                <div className="absolute w-3 h-3 bg-surface border-2 border-tertiary-container rounded-full -left-[31px] top-1"></div>
                <div className="flex items-start gap-3">
                  <div className="w-16 shrink-0 font-mono text-xs text-on-surface-variant mt-0.5">16:30</div>
                  <div className="bg-tertiary-container/10 border border-tertiary-fixed-dim rounded-lg p-3 flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-xs text-on-surface">Main St Submersion Risk</h4>
                      <span className="px-2 py-0.5 bg-[#a33500]/10 text-[#a33500] border border-[#a33500]/20 rounded font-bold text-[10px]">
                        WARNING
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-1">
                      Projected 0.5m standing water on primary arterial route. Reroute emergency vehicles.
                    </p>
                  </div>
                </div>
              </div>

              {/* Timeline Item 3 */}
              <div className="relative">
                <div className="absolute w-3 h-3 bg-surface border-2 border-outline rounded-full -left-[31px] top-1"></div>
                <div className="flex items-start gap-3">
                  <div className="w-16 shrink-0 font-mono text-xs text-on-surface-variant mt-0.5">20:00</div>
                  <div className="bg-surface-container border border-outline-variant rounded-lg p-3 flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-xs text-on-surface">Secondary Levee Stress Test</h4>
                      <span className="px-2 py-0.5 bg-surface-variant text-on-surface-variant border border-outline-variant rounded font-bold text-[10px]">
                        MONITOR
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-1">
                      Peak flow expected at North Dam. Structural integrity monitoring recommended.
                    </p>
                  </div>
                </div>
              </div>
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
                <span className="font-medium text-on-surface-variant">Breach Likelihood</span>
                <span className="font-mono font-bold text-error">87% (Severe)</span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-surface-container rounded-md">
                <span className="font-medium text-on-surface-variant">Evacuation Required</span>
                <span className="font-mono font-bold text-[#a33500]">92% (Mandatory)</span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-surface-container rounded-md">
                <span className="font-medium text-on-surface-variant">Power Grid Failure</span>
                <span className="font-mono font-bold text-on-surface">45% (Moderate)</span>
              </div>
            </div>
          </div>

          {/* Meteorological Telemetry */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-xs flex-1">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-outline-variant">
              <span className="material-symbols-outlined text-primary">cloud</span>
              <h3 className="font-headline-md text-sm font-bold text-on-surface">Meteorological Data</h3>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-surface-container p-3 rounded-lg border border-outline-variant">
                <div className="text-[11px] font-semibold text-on-surface-variant mb-1">Rainfall (1h)</div>
                <div className="font-display-lg text-xl font-bold text-on-surface">
                  45<span className="text-xs text-on-surface-variant font-normal ml-0.5">mm</span>
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
