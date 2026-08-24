import React from 'react';

export const OperationalDashboard: React.FC = () => {
  return (
    <div className="p-4 md:p-6 lg:p-gutter w-full h-full flex flex-col xl:flex-row gap-gutter">
      {/* Left / Center Section */}
      <div className="flex-1 flex flex-col gap-gutter min-w-0">
        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-gutter">
          {/* Stat Card 1 */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md flex flex-col gap-xs relative overflow-hidden group shadow-xs">
            <div className="flex justify-between items-center text-on-surface-variant">
              <span className="font-label-md text-label-md uppercase tracking-wider">Water Coverage</span>
              <span className="material-symbols-outlined text-primary-container" data-icon="water">water</span>
            </div>
            <div className="flex items-baseline gap-sm">
              <span className="font-headline-lg text-headline-lg text-on-surface">68%</span>
              <span className="font-data-mono text-data-mono text-error flex items-center">
                <span className="material-symbols-outlined text-[16px]" data-icon="arrow_upward">arrow_upward</span>
              </span>
            </div>
            <div className="absolute bottom-0 left-0 h-1 bg-primary-container w-[68%] transition-all"></div>
          </div>

          {/* Stat Card 2 */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md flex flex-col gap-xs relative overflow-hidden group shadow-xs">
            <div className="flex justify-between items-center text-on-surface-variant">
              <span className="font-label-md text-label-md uppercase tracking-wider">Victims Detected</span>
              <span className="material-symbols-outlined text-error" data-icon="person_alert">person_alert</span>
            </div>
            <div className="flex items-baseline gap-sm">
              <span className="font-headline-lg text-headline-lg text-error">7</span>
            </div>
            <div className="absolute bottom-0 left-0 h-1 bg-error w-full"></div>
          </div>

          {/* Stat Card 3 */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md flex flex-col gap-xs relative overflow-hidden group shadow-xs">
            <div className="flex justify-between items-center text-on-surface-variant">
              <span className="font-label-md text-label-md uppercase tracking-wider">Road Blockages</span>
              <span className="material-symbols-outlined text-[#f59e0b]" data-icon="block">block</span>
            </div>
            <div className="flex items-baseline gap-sm">
              <span className="font-headline-lg text-headline-lg text-on-surface">2</span>
            </div>
            <div className="absolute bottom-0 left-0 h-1 bg-[#f59e0b] w-full opacity-50"></div>
          </div>

          {/* Stat Card 4 */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md flex flex-col gap-xs relative overflow-hidden group shadow-xs">
            <div className="flex justify-between items-center text-on-surface-variant">
              <span className="font-label-md text-label-md uppercase tracking-wider">Submerged Roads</span>
              <span className="material-symbols-outlined text-primary-container" data-icon="waves">waves</span>
            </div>
            <div className="flex items-baseline gap-sm">
              <span className="font-headline-lg text-headline-lg text-on-surface">3</span>
            </div>
            <div className="absolute bottom-0 left-0 h-1 bg-primary-container w-full opacity-30"></div>
          </div>

          {/* Stat Card 5 */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md flex flex-col gap-xs relative overflow-hidden group shadow-xs col-span-2 sm:col-span-1">
            <div className="flex justify-between items-center text-on-surface-variant">
              <span className="font-label-md text-label-md uppercase tracking-wider">Boats Available</span>
              <span className="material-symbols-outlined text-[#10b981]" data-icon="sailing">sailing</span>
            </div>
            <div className="flex items-baseline gap-sm">
              <span className="font-headline-lg text-headline-lg text-on-surface">2</span>
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
                <span className="w-2 h-2 rounded-full bg-error"></span> Victims
              </span>
              <span className="flex items-center gap-base px-sm py-1 rounded bg-primary-container/10 border border-primary-container text-primary-container font-label-md text-label-md">
                <span className="w-2 h-2 rounded-full bg-primary-container"></span> Flood Water
              </span>
              <span className="flex items-center gap-base px-sm py-1 rounded bg-[#f59e0b]/10 border border-[#f59e0b] text-[#f59e0b] font-label-md text-label-md">
                <span className="w-2 h-2 rounded-full bg-[#f59e0b]"></span> Relief Camps
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

            {/* Map Overlay Markers */}
            <div className="absolute top-[30%] left-[40%] bg-error w-3 h-3 rounded-full animate-ping opacity-75 pointer-events-none" />
            <div className="absolute top-[30%] left-[40%] bg-error w-3 h-3 rounded-full border-2 border-white shadow-sm" />

            <div className="absolute top-[50%] left-[60%] bg-[#f59e0b] w-5 h-5 rounded shadow-sm border border-white flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[14px]" data-icon="home">home</span>
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

      {/* Right Panel - Recent Alerts */}
      <div className="w-full xl:w-[320px] bg-surface-container-lowest border border-outline-variant rounded-lg flex flex-col shrink-0">
        <div className="p-md border-b border-outline-variant bg-surface-bright">
          <h2 className="font-headline-md text-headline-md text-on-surface">Recent Alerts</h2>
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
              <h3 className="font-body-md text-body-md font-semibold text-on-surface">NEW VICTIMS DETECTED</h3>
              <div className="font-data-mono text-data-mono text-on-surface-variant text-sm">
                Loc: Sector 12<br />
                Src: DRONE-001
              </div>
              <button className="mt-sm bg-surface-container-lowest border border-outline-variant text-primary font-label-md text-label-md py-sm px-md rounded hover:bg-surface-container-low transition-colors w-full flex items-center justify-center gap-xs">
                <span className="material-symbols-outlined text-[16px]" data-icon="my_location">my_location</span>
                View on Map
              </button>
            </div>
          </div>

          {/* Standard Alert 1 */}
          <div className="border border-outline-variant rounded-lg bg-surface-bright p-md flex flex-col gap-sm">
            <div className="flex justify-between items-start">
              <span className="font-label-md text-label-md text-primary-container flex items-center gap-xs">
                <span className="material-symbols-outlined text-[16px]" data-icon="info">info</span>
                UPDATE
              </span>
              <span className="font-label-md text-label-md text-on-surface-variant">14:15</span>
            </div>
            <h3 className="font-body-md text-body-md text-on-surface">Water level rising at Main St. intersection.</h3>
          </div>

          {/* Standard Alert 2 */}
          <div className="border border-outline-variant rounded-lg bg-surface-bright p-md flex flex-col gap-sm">
            <div className="flex justify-between items-start">
              <span className="font-label-md text-label-md text-[#f59e0b] flex items-center gap-xs">
                <span className="material-symbols-outlined text-[16px]" data-icon="construction">construction</span>
                WARNING
              </span>
              <span className="font-label-md text-label-md text-on-surface-variant">13:45</span>
            </div>
            <h3 className="font-body-md text-body-md text-on-surface">Route 4 blocked by debris. Re-routing recommended.</h3>
          </div>
        </div>
      </div>
    </div>
  );
};
