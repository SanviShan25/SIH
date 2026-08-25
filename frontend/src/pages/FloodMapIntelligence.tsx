import React, { useState } from 'react';
import { settlementsData, infrastructureData, roadAccessibilityData, waterSpreadData } from '../data/mockData';

export const FloodMapIntelligence: React.FC = () => {
  const [layers, setLayers] = useState({
    waterLevels: true,
    waterSpread: true,
    settlements: true,
    roadStatus: true,
    infrastructure: true,
    activeAssets: true,
    safeRoutes: true,
  });

  return (
    <div className="relative w-full h-[calc(100vh-64px)] min-h-[600px] overflow-hidden bg-surface-container-low flex flex-col">
      {/* Map Interactive Canvas */}
      <div className="absolute inset-0 bg-[#e5e9ec] overflow-hidden">
        {/* Top-down GIS Map Layer */}
        <div
          className="w-full h-full bg-cover bg-center absolute inset-0 transition-transform duration-700 ease-out"
          data-alt="High resolution GIS satellite map of flood zones"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDHUHvTauXo11PCYMgAxhVjsv8KX3CJ5ULE8I21bP8zvnBzbg2VoCYmtdcYFE13HdSBZGFpZZcmSkh2-QELLretfBtt5chwktUPXkd7m3YGYCGiqSEj3R6MiDMy6b77vqI0pFPUKnL9C4GsS5GetoLqAQPB_mAzXLo-Y4I-V0_xZ451Ezr7NVUW156dSFl9qtCcppZLZTGudciGkmg_i1yDEu5-RBdsmQlwTX1ZgCHBXtiAzIHAaR2j')`,
          }}
        />

        {/* Flood Inundation Polygon Visual Overlays */}
        {layers.waterLevels && (
          <>
            <div className="absolute top-[28%] left-[34%] w-60 h-44 bg-blue-600/35 rounded-full blur-xl animate-pulse pointer-events-none" />
            <div className="absolute top-[45%] left-[48%] w-80 h-52 bg-blue-500/30 rounded-full blur-2xl pointer-events-none" />
          </>
        )}

        {/* Water Spread Vector Direction Indicator */}
        {layers.waterSpread && (
          <div className="absolute top-[38%] left-[46%] pointer-events-none flex flex-col items-center">
            <div className="bg-primary/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-lg border border-white/50 flex items-center gap-1.5 backdrop-blur-xs animate-pulse">
              <span className="material-symbols-outlined text-[15px]">trending_up</span>
              <span>Spread: {waterSpreadData.direction} ({waterSpreadData.changeSincePreviousSurvey})</span>
            </div>
            <div className="w-0.5 h-12 bg-gradient-to-b from-primary to-transparent mt-1" />
          </div>
        )}

        {/* Road Accessibility Overlays */}
        {layers.roadStatus && (
          <>
            {/* Blocked Road Marker (Highway 4) */}
            <div className="absolute top-[35%] left-[30%] flex items-center gap-1 bg-[#ef4444] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-md cursor-pointer">
              <span className="material-symbols-outlined text-[12px]">block</span> Highway 4 (Blocked)
            </div>
            {/* Submerged Road Marker (Main St) */}
            <div className="absolute top-[52%] left-[45%] flex items-center gap-1 bg-[#f59e0b] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-md cursor-pointer">
              <span className="material-symbols-outlined text-[12px]">waves</span> Main St. (Submerged &gt;0.8m)
            </div>
          </>
        )}

        {/* Safe Evacuation Route */}
        {layers.safeRoutes && (
          <div className="absolute top-[22%] left-[55%] flex items-center gap-1 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-md cursor-pointer border border-white">
            <span className="material-symbols-outlined text-[13px]">check_circle</span> North Ring (Safe Route)
          </div>
        )}

        {/* Affected Settlements Markers */}
        {layers.settlements && (
          <>
            {settlementsData.map((s) => (
              <div
                key={s.id}
                className="absolute flex flex-col items-center cursor-pointer group z-10"
                style={{ top: s.coordinates.top, left: s.coordinates.left }}
              >
                <div className={`w-3.5 h-3.5 rounded-full ${s.status === 'Partially Submerged' ? 'bg-red-600 animate-ping absolute' : 'bg-red-500'}`} />
                <div className="w-3.5 h-3.5 rounded-full bg-red-600 border-2 border-white shadow-md relative" />
                <div className="bg-surface-container-lowest border border-outline-variant text-on-surface text-[10px] font-bold px-1.5 py-0.5 rounded shadow-xs mt-1 whitespace-nowrap">
                  {s.name} <span className="text-error font-medium">({s.status})</span>
                </div>
              </div>
            ))}
          </>
        )}

        {/* Infrastructure Markers */}
        {layers.infrastructure && (
          <>
            {infrastructureData.map((item) => (
              <div
                key={item.id}
                className="absolute flex flex-col items-center cursor-pointer group z-10"
                style={{ top: item.coordinates.top, left: item.coordinates.left }}
              >
                <div className={`text-[10px] font-bold px-2 py-0.5 rounded shadow-md border border-white flex items-center gap-1 ${
                  item.status === 'Risk Detected'
                    ? 'bg-[#a33500] text-white'
                    : item.status === 'Accessible' || item.status === 'Safe'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-error text-white'
                }`}>
                  <span className="material-symbols-outlined text-[12px]">
                    {item.type === 'Bridge' ? 'deck' : item.type === 'Hospital' ? 'local_hospital' : 'domain'}
                  </span>
                  {item.name}: {item.status}
                </div>
              </div>
            ))}
          </>
        )}

        {/* Active Field & Drone Assets */}
        {layers.activeAssets && (
          <>
            {/* Drone Mission Pin */}
            <div className="absolute top-[26%] left-[42%] flex flex-col items-center group cursor-pointer z-10">
              <div className="bg-primary text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-md mb-1 whitespace-nowrap">
                DRONE-ALPHA (Live Patrol)
              </div>
              <div className="w-8 h-8 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center animate-bounce">
                <span className="material-symbols-outlined text-primary text-sm">precision_manufacturing</span>
              </div>
            </div>

            {/* Rescue Boat Pin */}
            <div className="absolute top-[60%] left-[54%] flex flex-col items-center group cursor-pointer z-10">
              <div className="bg-emerald-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-md mb-1 whitespace-nowrap">
                RESCUE BOAT 02
              </div>
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 border-2 border-emerald-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-emerald-700 text-sm">sailing</span>
              </div>
            </div>

            {/* Relief Camp Pin */}
            <div className="absolute top-[72%] left-[64%] flex flex-col items-center cursor-pointer z-10">
              <div className="bg-[#10b981] text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-md mb-1 whitespace-nowrap flex items-center gap-1 border border-white">
                <span className="material-symbols-outlined text-[13px]">home</span> Camp Alpha (2.4 km)
              </div>
            </div>
          </>
        )}

        {/* Zoom & View Controls */}
        <div className="absolute bottom-6 right-6 bg-surface-container-lowest/90 backdrop-blur-xs border border-outline-variant rounded-xl p-1 shadow-md flex flex-col gap-1 z-20">
          <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-container-low transition-colors text-on-surface">
            <span className="material-symbols-outlined text-sm">add</span>
          </button>
          <div className="h-px bg-outline-variant w-full" />
          <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-container-low transition-colors text-on-surface">
            <span className="material-symbols-outlined text-sm">remove</span>
          </button>
          <div className="h-px bg-outline-variant w-full" />
          <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-container-low transition-colors text-on-surface" title="Reset View">
            <span className="material-symbols-outlined text-sm">my_location</span>
          </button>
        </div>
      </div>

      {/* Top Floating Search & Quick Filters Bar */}
      <div className="relative z-20 p-4 md:px-6 flex flex-wrap items-center justify-between gap-4 pointer-events-none">
        <div className="pointer-events-auto flex items-center w-full max-w-md relative shadow-sm">
          <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-sm">search</span>
          <input
            type="text"
            placeholder="Search Settlements, Infrastructure, Roads, or GPS..."
            className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest/95 backdrop-blur-xs border border-outline-variant rounded-lg font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary text-on-surface placeholder:text-on-surface-variant/70 shadow-xs"
          />
        </div>

        <div className="pointer-events-auto flex items-center gap-2 bg-surface-container-lowest/95 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-outline-variant shadow-xs">
          <span className="text-xs font-semibold uppercase text-primary tracking-wider">Active Sector:</span>
          <span className="text-xs font-bold text-on-surface">Sector 12 &amp; Riverside Hub</span>
        </div>
      </div>

      {/* Main Overlay Bento Grid Panels */}
      <div className="relative z-20 flex-1 p-4 md:p-6 flex flex-col justify-between pointer-events-none">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
          {/* Left Panel: Map Layer Controls */}
          <div className="pointer-events-auto w-full sm:w-80 bg-surface-container-lowest/95 backdrop-blur-md rounded-xl border border-outline-variant shadow-lg flex flex-col max-h-[70vh] overflow-y-auto">
            <div className="p-3 border-b border-outline-variant bg-surface-bright/80 rounded-t-xl flex justify-between items-center sticky top-0 bg-surface-container-lowest">
              <h3 className="font-headline-md text-sm font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-base">layers</span>
                Map Layers &amp; Overlays
              </h3>
              <span className="text-[11px] font-mono text-on-surface-variant uppercase">7 Feeds</span>
            </div>

            <div className="p-3 space-y-2 text-xs">
              {/* Layer 1: Water Inundation */}
              <label className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={layers.waterLevels}
                  onChange={(e) => setLayers({ ...layers, waterLevels: e.target.checked })}
                  className="mt-0.5 rounded border-outline-variant text-primary focus:ring-primary"
                />
                <div className="flex-1">
                  <span className="font-semibold text-on-surface block">Water Inundation ({waterSpreadData.coveragePercentage}%)</span>
                  <span className="text-on-surface-variant text-[11px] block">Live flood extent boundaries</span>
                </div>
              </label>

              {/* Layer 2: Water Spread */}
              <label className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={layers.waterSpread}
                  onChange={(e) => setLayers({ ...layers, waterSpread: e.target.checked })}
                  className="mt-0.5 rounded border-outline-variant text-primary focus:ring-primary"
                />
                <div className="flex-1">
                  <span className="font-semibold text-on-surface block">Water Spread ({waterSpreadData.direction})</span>
                  <span className="text-on-surface-variant text-[11px] block">Trend: {waterSpreadData.trend} ({waterSpreadData.changeSincePreviousSurvey})</span>
                </div>
              </label>

              {/* Layer 3: Affected Settlements */}
              <label className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={layers.settlements}
                  onChange={(e) => setLayers({ ...layers, settlements: e.target.checked })}
                  className="mt-0.5 rounded border-outline-variant text-primary focus:ring-primary"
                />
                <div className="flex-1">
                  <span className="font-semibold text-on-surface block">Affected Settlements ({settlementsData.length})</span>
                  <span className="text-on-surface-variant text-[11px] block">Sector 12, Riverside, East Hamlet...</span>
                </div>
              </label>

              {/* Layer 4: Road Accessibility */}
              <label className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={layers.roadStatus}
                  onChange={(e) => setLayers({ ...layers, roadStatus: e.target.checked })}
                  className="mt-0.5 rounded border-outline-variant text-primary focus:ring-primary"
                />
                <div className="flex-1">
                  <span className="font-semibold text-on-surface block">Road Accessibility ({roadAccessibilityData.overallPercentage}%)</span>
                  <span className="text-on-surface-variant text-[11px] block">{roadAccessibilityData.blockedRoads} Blocked · {roadAccessibilityData.submergedRoads} Submerged</span>
                </div>
              </label>

              {/* Layer 5: Infrastructure */}
              <label className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={layers.infrastructure}
                  onChange={(e) => setLayers({ ...layers, infrastructure: e.target.checked })}
                  className="mt-0.5 rounded border-outline-variant text-primary focus:ring-primary"
                />
                <div className="flex-1">
                  <span className="font-semibold text-on-surface block">Infrastructure Impact ({infrastructureData.length})</span>
                  <span className="text-on-surface-variant text-[11px] block">Bridges, Hospitals, Govt Buildings</span>
                </div>
              </label>

              {/* Layer 6: Safe Routes */}
              <label className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={layers.safeRoutes}
                  onChange={(e) => setLayers({ ...layers, safeRoutes: e.target.checked })}
                  className="mt-0.5 rounded border-outline-variant text-primary focus:ring-primary"
                />
                <div className="flex-1">
                  <span className="font-semibold text-on-surface block">Safe Evacuation Routes</span>
                  <span className="text-on-surface-variant text-[11px] block">Verified passable evacuation lanes</span>
                </div>
              </label>

              {/* Layer 7: Active Assets & Camps */}
              <label className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={layers.activeAssets}
                  onChange={(e) => setLayers({ ...layers, activeAssets: e.target.checked })}
                  className="mt-0.5 rounded border-outline-variant text-primary focus:ring-primary"
                />
                <div className="flex-1">
                  <span className="font-semibold text-on-surface block">Active Units &amp; Relief Camps</span>
                  <span className="text-on-surface-variant text-[11px] block">Drones, NDRF boats, Camp Alpha</span>
                </div>
              </label>
            </div>
          </div>

          {/* Right Panel: Sector 12 Intelligence Summary */}
          <div className="pointer-events-auto w-full sm:w-80 bg-surface-container-lowest/95 backdrop-blur-md rounded-xl border border-outline-variant shadow-lg flex flex-col">
            <div className="p-3 border-b border-outline-variant bg-surface-bright/80 rounded-t-xl flex justify-between items-center">
              <div>
                <h3 className="font-headline-md text-sm font-bold text-on-surface">Sector 12 Assessment</h3>
                <p className="text-[11px] text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px] text-emerald-600">sync</span> Real-Time Telemetry
                </p>
              </div>
              <span className="px-2 py-0.5 bg-error/10 text-error border border-error/30 text-[10px] font-bold rounded">
                CRITICAL
              </span>
            </div>

            <div className="p-3 grid grid-cols-2 gap-2 text-xs">
              {/* Metric 1 */}
              <div className="col-span-2 bg-surface-container-lowest rounded-lg border border-outline-variant p-2.5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-blue-700 text-base">water</span>
                </div>
                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase font-semibold">Water Spread</p>
                  <p className="text-base font-bold text-on-surface flex items-baseline gap-1">
                    {waterSpreadData.trend} · {waterSpreadData.direction}
                  </p>
                  <p className="text-[10px] text-error font-medium">Height: {waterSpreadData.peakHeight} ({waterSpreadData.changeSincePreviousSurvey})</p>
                </div>
              </div>

              {/* Metric 2 */}
              <div className="col-span-1 bg-surface-container-lowest rounded-lg border border-outline-variant p-2.5 flex flex-col justify-between">
                <p className="text-[10px] text-on-surface-variant uppercase font-semibold">Settlements</p>
                <div className="mt-1">
                  <p className="text-base font-bold text-error">{settlementsData.length}</p>
                  <p className="text-[10px] text-error font-medium">2 Submerged</p>
                </div>
              </div>

              {/* Metric 3 */}
              <div className="col-span-1 bg-surface-container-lowest rounded-lg border border-outline-variant p-2.5 flex flex-col justify-between">
                <p className="text-[10px] text-on-surface-variant uppercase font-semibold">Road Access</p>
                <div className="mt-1">
                  <p className="text-base font-bold text-on-surface">{roadAccessibilityData.overallPercentage}%</p>
                  <p className="text-[10px] text-[#f59e0b] font-medium">{roadAccessibilityData.blockedRoads} Blocked</p>
                </div>
              </div>

              {/* Metric 4 */}
              <div className="col-span-2 bg-surface-container-lowest rounded-lg border border-outline-variant p-2.5 flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase font-semibold">Bridge B-02 Status</p>
                  <p className="text-xs font-bold text-[#a33500]">Risk Detected (12k m³/s)</p>
                </div>
                <span className="px-2 py-0.5 bg-[#ffdbcf] text-[#a33500] text-[10px] font-bold rounded">
                  ALERT
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-3 pt-0 flex flex-col gap-2">
              <button className="w-full bg-surface-container-lowest border border-outline-variant text-primary py-2 rounded-lg font-bold text-xs uppercase hover:bg-surface-container-low transition-colors flex justify-center items-center gap-1.5">
                <span className="material-symbols-outlined text-base">download</span> Export GIS GeoJSON
              </button>
              <button className="w-full bg-primary text-on-primary py-2 rounded-lg font-bold text-xs uppercase hover:bg-primary/90 transition-colors flex justify-center items-center gap-1.5 shadow-sm">
                <span className="material-symbols-outlined text-base">my_location</span> Center on Sector 12
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Floating Status Bar */}
        <div className="pointer-events-auto self-center bg-surface-container-lowest/90 backdrop-blur-md rounded-full px-5 py-2 flex items-center gap-4 shadow-md border border-outline-variant text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-mono text-on-surface font-semibold">GIS INTELLIGENCE ACTIVE</span>
          </div>
          <div className="w-px h-3.5 bg-outline-variant"></div>
          <div className="font-mono text-on-surface-variant text-[11px]">
            Sector 12 · Water Spread: South-East (+13%) · 5 Settlements Monitored
          </div>
        </div>
      </div>
    </div>
  );
};
