import React, { useState } from 'react';

export const FloodMapIntelligence: React.FC = () => {
  const [layers, setLayers] = useState({
    waterLevels: true,
    roadStatus: true,
    activeAssets: true,
    powerInfra: false,
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

        {/* Flood Polygon Visual Overlays */}
        {layers.waterLevels && (
          <>
            <div className="absolute top-[28%] left-[34%] w-56 h-40 bg-blue-600/30 rounded-full blur-xl animate-pulse pointer-events-none" />
            <div className="absolute top-[45%] left-[52%] w-72 h-48 bg-blue-500/25 rounded-full blur-2xl pointer-events-none" />
          </>
        )}

        {/* Dynamic Markers */}
        {layers.activeAssets && (
          <>
            {/* Drone Mission Pin */}
            <div className="absolute top-[32%] left-[42%] flex flex-col items-center group cursor-pointer">
              <div className="bg-primary text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-md mb-1 whitespace-nowrap">
                DRONE-ALPHA
              </div>
              <div className="w-8 h-8 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center animate-bounce">
                <span className="material-symbols-outlined text-primary text-sm">precision_manufacturing</span>
              </div>
            </div>

            {/* Rescue Boat Pin */}
            <div className="absolute top-[55%] left-[58%] flex flex-col items-center group cursor-pointer">
              <div className="bg-emerald-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-md mb-1 whitespace-nowrap">
                RESCUE BOAT 04
              </div>
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 border-2 border-emerald-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-emerald-700 text-sm">sailing</span>
              </div>
            </div>
          </>
        )}

        {/* Critical Risk Area Pin */}
        <div className="absolute top-[48%] left-[38%] flex flex-col items-center cursor-pointer">
          <div className="w-4 h-4 rounded-full bg-error animate-ping absolute" />
          <div className="w-4 h-4 rounded-full bg-error border-2 border-white shadow-md relative" />
          <div className="bg-error-container text-on-error-container text-[10px] font-bold px-1.5 py-0.5 rounded mt-1 shadow-xs">
            Risk: 7 Victims
          </div>
        </div>

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
            placeholder="Search Location, Coordinates, or Incident ID..."
            className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest/95 backdrop-blur-xs border border-outline-variant rounded-lg font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary text-on-surface placeholder:text-on-surface-variant/70 shadow-xs"
          />
        </div>

        <div className="pointer-events-auto flex items-center gap-2 bg-surface-container-lowest/95 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-outline-variant shadow-xs">
          <span className="text-xs font-semibold uppercase text-primary tracking-wider">Active Sector:</span>
          <span className="text-xs font-bold text-on-surface">Sector 4 (North Riverbank)</span>
        </div>
      </div>

      {/* Main Overlay Bento Grid Panels */}
      <div className="relative z-20 flex-1 p-4 md:p-6 flex flex-col justify-between pointer-events-none">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
          {/* Left Panel: Map Layer Controls */}
          <div className="pointer-events-auto w-full sm:w-80 bg-surface-container-lowest/95 backdrop-blur-md rounded-xl border border-outline-variant shadow-lg flex flex-col">
            <div className="p-3 border-b border-outline-variant bg-surface-bright/80 rounded-t-xl flex justify-between items-center">
              <h3 className="font-headline-md text-sm font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-base">layers</span>
                Map Layers & Overlays
              </h3>
              <span className="text-[11px] font-mono text-on-surface-variant uppercase">4 Feeds</span>
            </div>

            <div className="p-3 space-y-2 text-xs">
              <label className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={layers.waterLevels}
                  onChange={(e) => setLayers({ ...layers, waterLevels: e.target.checked })}
                  className="mt-0.5 rounded border-outline-variant text-primary focus:ring-primary"
                />
                <div className="flex-1">
                  <span className="font-semibold text-on-surface block">Water Inundation (Live)</span>
                  <span className="text-on-surface-variant text-[11px] block">Displays current depth & flood boundary</span>
                  <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-blue-200 via-blue-500 to-blue-800 mt-1.5" />
                  <div className="flex justify-between mt-0.5 text-[9px] text-on-surface-variant font-medium">
                    <span>0m</span>
                    <span>&gt;3.5m</span>
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={layers.roadStatus}
                  onChange={(e) => setLayers({ ...layers, roadStatus: e.target.checked })}
                  className="mt-0.5 rounded border-outline-variant text-primary focus:ring-primary"
                />
                <div className="flex-1">
                  <span className="font-semibold text-on-surface block">Road Status & Blockages</span>
                  <span className="text-on-surface-variant text-[11px] block">Highlights impassable routes</span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={layers.activeAssets}
                  onChange={(e) => setLayers({ ...layers, activeAssets: e.target.checked })}
                  className="mt-0.5 rounded border-outline-variant text-primary focus:ring-primary"
                />
                <div className="flex-1">
                  <span className="font-semibold text-on-surface block">Active Aerial & Field Assets</span>
                  <span className="text-on-surface-variant text-[11px] block">Autonomous drones, NDRF boats</span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={layers.powerInfra}
                  onChange={(e) => setLayers({ ...layers, powerInfra: e.target.checked })}
                  className="mt-0.5 rounded border-outline-variant text-primary focus:ring-primary"
                />
                <div className="flex-1">
                  <span className="font-semibold text-on-surface block">Power Grid Infrastructure</span>
                  <span className="text-on-surface-variant text-[11px] block">Substations & telemetry status</span>
                </div>
              </label>
            </div>
          </div>

          {/* Right Panel: Sector 4 Statistics Bento */}
          <div className="pointer-events-auto w-full sm:w-80 bg-surface-container-lowest/95 backdrop-blur-md rounded-xl border border-outline-variant shadow-lg flex flex-col">
            <div className="p-3 border-b border-outline-variant bg-surface-bright/80 rounded-t-xl flex justify-between items-center">
              <div>
                <h3 className="font-headline-md text-sm font-bold text-on-surface">Sector 4 Overview</h3>
                <p className="text-[11px] text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px] text-emerald-600">sync</span> Mission Synced
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
                  <p className="text-[10px] text-on-surface-variant uppercase font-semibold">Peak Water Height</p>
                  <p className="text-xl font-bold text-on-surface flex items-baseline gap-1">
                    3.2<span className="text-xs font-normal text-on-surface-variant">m</span>
                  </p>
                </div>
              </div>

              {/* Metric 2 */}
              <div className="col-span-1 bg-surface-container-lowest rounded-lg border border-outline-variant p-2.5 flex flex-col justify-between">
                <p className="text-[10px] text-on-surface-variant uppercase font-semibold">Rainfall Rate</p>
                <div className="mt-1">
                  <p className="text-base font-bold text-on-surface">
                    12<span className="text-[10px] text-on-surface-variant ml-0.5">mm/h</span>
                  </p>
                  <p className="text-[10px] text-error font-semibold flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[12px]">trending_up</span> Rising
                  </p>
                </div>
              </div>

              {/* Metric 3 */}
              <div className="col-span-1 bg-error-container/60 rounded-lg border border-red-200 p-2.5 flex flex-col justify-between">
                <p className="text-[10px] text-on-tertiary-fixed-variant uppercase font-semibold">Affected Pop.</p>
                <div className="mt-1">
                  <p className="text-base font-bold text-on-error-container">1,400</p>
                  <p className="text-[10px] text-error font-semibold flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[12px]">warning</span> High Risk
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-3 pt-0 flex flex-col gap-2">
              <button className="w-full bg-surface-container-lowest border border-outline-variant text-primary py-2 rounded-lg font-bold text-xs uppercase hover:bg-surface-container-low transition-colors flex justify-center items-center gap-1.5">
                <span className="material-symbols-outlined text-base">download</span> Export GIS GeoJSON
              </button>
              <button className="w-full bg-primary text-on-primary py-2 rounded-lg font-bold text-xs uppercase hover:bg-primary/90 transition-colors flex justify-center items-center gap-1.5 shadow-sm">
                <span className="material-symbols-outlined text-base">my_location</span> Center Map on Sector
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Floating Status Bar */}
        <div className="pointer-events-auto self-center bg-surface-container-lowest/90 backdrop-blur-md rounded-full px-5 py-2 flex items-center gap-4 shadow-md border border-outline-variant text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-mono text-on-surface font-semibold">GIS MESH ONLINE</span>
          </div>
          <div className="w-px h-3.5 bg-outline-variant"></div>
          <div className="font-mono text-on-surface-variant text-[11px]">
            GPS: 28.6139° N, 77.2090° E · ELEV: 216m
          </div>
        </div>
      </div>
    </div>
  );
};
