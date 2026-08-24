import React, { useState } from 'react';

export const DroneMissionControl: React.FC = () => {
  const [activeMediaTab, setActiveMediaTab] = useState<'all' | 'images' | 'videos'>('all');

  return (
    <div className="p-4 md:p-6 lg:p-xl w-full min-h-full flex flex-col gap-6">
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Mission Command</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-base">
            Sector 12 Aerial Reconnaissance & Telemetry
          </p>
        </div>
        <button className="bg-primary-container text-on-primary px-lg py-sm rounded-lg font-label-md text-label-md flex items-center gap-sm hover:bg-primary transition-colors shadow-xs cursor-pointer">
          <span className="material-symbols-outlined text-[18px]">add</span>
          New Mission
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column: Mission Details, Telemetry, Captured Media */}
        <div className="col-span-12 xl:col-span-8 flex flex-col gap-6">
          {/* Status Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col gap-6 shadow-xs">
            <div className="flex flex-wrap justify-between items-start border-b border-outline-variant pb-md gap-4">
              <div>
                <div className="flex items-center gap-md mb-xs">
                  <h3 className="font-headline-md text-headline-md text-on-surface">MISSION-DRONE-001</h3>
                  <span className="bg-primary-fixed text-primary px-sm py-xs rounded-full font-label-md text-label-md border border-primary-fixed-dim">
                    Active Mission
                  </span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Target Area: Riverbend District • Assigned: 13:45 UTC
                </p>
              </div>
              <div className="bg-[#e6f4ea] border border-[#34a853] text-[#137333] px-md py-sm rounded-lg font-label-md text-label-md flex items-center gap-sm shadow-xs">
                <span className="material-symbols-outlined text-[16px] fill">check_circle</span>
                Analysis Completed
              </div>
            </div>

            {/* Telemetry Bento Grid */}
            <div>
              <h4 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-3">
                Telemetry & Avionics Data
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {/* Battery */}
                <div className="bg-surface-container border border-outline-variant rounded-lg p-3 flex flex-col items-center justify-center text-center">
                  <span className="material-symbols-outlined text-secondary mb-1">battery_charging_full</span>
                  <span className="font-headline-md text-headline-md text-on-surface font-bold">84%</span>
                  <span className="text-[11px] text-on-surface-variant uppercase font-semibold">Battery Level</span>
                </div>

                {/* Altitude */}
                <div className="bg-surface-container border border-outline-variant rounded-lg p-3 flex flex-col items-center justify-center text-center">
                  <span className="material-symbols-outlined text-secondary mb-1">flight_takeoff</span>
                  <span className="font-headline-md text-headline-md text-on-surface font-bold">120m</span>
                  <span className="text-[11px] text-on-surface-variant uppercase font-semibold">Altitude AGL</span>
                </div>

                {/* Speed */}
                <div className="bg-surface-container border border-outline-variant rounded-lg p-3 flex flex-col items-center justify-center text-center">
                  <span className="material-symbols-outlined text-secondary mb-1">speed</span>
                  <span className="font-headline-md text-headline-md text-on-surface font-bold">45 km/h</span>
                  <span className="text-[11px] text-on-surface-variant uppercase font-semibold">Ground Speed</span>
                </div>

                {/* Coordinates */}
                <div className="bg-surface-container border border-outline-variant rounded-lg p-3 flex flex-col items-center justify-center text-center">
                  <span className="material-symbols-outlined text-secondary mb-1">pin_drop</span>
                  <span className="font-data-mono text-xs text-on-surface font-bold truncate w-full">28.61, 77.20</span>
                  <span className="text-[11px] text-on-surface-variant uppercase font-semibold">Coordinates</span>
                </div>

                {/* Signal Quality */}
                <div className="bg-surface-container border border-outline-variant rounded-lg p-3 flex flex-col items-center justify-center text-center col-span-2 sm:col-span-1">
                  <span className="material-symbols-outlined text-secondary mb-1">cell_tower</span>
                  <span className="font-headline-md text-headline-md text-on-surface font-bold">98%</span>
                  <span className="text-[11px] text-on-surface-variant uppercase font-semibold">Link Signal</span>
                </div>
              </div>
            </div>
          </div>

          {/* Captured Media Gallery */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col gap-4 shadow-xs">
            <div className="flex flex-wrap justify-between items-center border-b border-outline-variant pb-3 gap-2">
              <h4 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                Mission Footage & Recorded Media
              </h4>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveMediaTab('all')}
                  className={`font-label-md text-xs px-2.5 py-1 rounded transition-colors ${
                    activeMediaTab === 'all' ? 'bg-primary text-white' : 'text-primary hover:bg-primary-fixed'
                  }`}
                >
                  All (14)
                </button>
                <button
                  onClick={() => setActiveMediaTab('images')}
                  className={`font-label-md text-xs px-2.5 py-1 rounded transition-colors ${
                    activeMediaTab === 'images' ? 'bg-primary text-white' : 'text-primary hover:bg-primary-fixed'
                  }`}
                >
                  Images (8)
                </button>
                <button
                  onClick={() => setActiveMediaTab('videos')}
                  className={`font-label-md text-xs px-2.5 py-1 rounded transition-colors ${
                    activeMediaTab === 'videos' ? 'bg-primary text-white' : 'text-primary hover:bg-primary-fixed'
                  }`}
                >
                  Recordings (6)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Image Card */}
              <div className="relative group rounded-lg overflow-hidden border border-outline-variant h-52 bg-surface-container">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  data-alt="Aerial drone photograph of flooded suburban neighborhood"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8PmaUnhnK2n_zte5GtDuyHiHQTtqq9Iq1jENOlVyZ12fFpxCd5WfJagACM2ZBM8NSXzOvKD-OYRbp_KJmxwwTrXjo03-lPmZj2nVa1wg-tMpLk1kIkjCNme5R5OV7OIUzmVIATCputu2T4ELAZt6Ey21ZumseGa193luTjOJqJy4Zxb-6EcNUJ_bHcaByM7D8Ir5M9Iq-SHTZ8chq1JMq21xkvEPCJMoRv2-_-8293ErEe33Yj0wP"
                  alt="Sector 12 Aerial View"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-on-surface/90 via-on-surface/20 to-transparent opacity-90 transition-opacity flex flex-col justify-end p-3">
                  <span className="text-white font-semibold text-xs">Captured Image • Sector 12 North</span>
                  <span className="text-white/80 font-mono text-[11px]">14:22 PM UTC · GPS Locked</span>
                </div>
                <div className="absolute top-2 right-2 bg-surface-container-lowest/90 backdrop-blur-xs px-2 py-0.5 rounded flex items-center gap-1 shadow-xs">
                  <span className="material-symbols-outlined text-[14px] text-primary">photo_camera</span>
                  <span className="text-[10px] font-bold text-on-surface">SURVEY IMG</span>
                </div>
              </div>

              {/* Video Card */}
              <div className="relative group rounded-lg overflow-hidden border border-outline-variant h-52 bg-surface-container cursor-pointer">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  data-alt="Aerial drone video still of breached river dam"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCB4FeUnPBXQ_n5bhiQSHN46fEk8zqT66EpLo231IFHN0cd70PymSQllcYC1qfvA7CKfz-cnOmnRQBOl52PG8-M4ZMUsLdQ2m1ZFUzSbitjhI5o0LgefY2vfqYlrZY8tX2iWVxk-6cPAb-2nw8gbDCYHRSyYyBRS4Dx5AvGsnrjxRLvoggnr9yG8voKBYbFYSQTg4oOpsz3iacKFuSiFwqg4qCFsgHO-nkOBJkgJljgtz3JAcfpZEP-"
                  alt="River Dam Recorded Footage"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-on-surface/60 rounded-full w-12 h-12 flex items-center justify-center backdrop-blur-sm group-hover:bg-primary transition-all group-hover:scale-110 shadow-lg">
                    <span className="material-symbols-outlined text-white text-2xl fill">play_arrow</span>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-on-surface/90 via-on-surface/20 to-transparent opacity-90 transition-opacity flex flex-col justify-end p-3 pointer-events-none">
                  <span className="text-white font-semibold text-xs">Recorded Footage • River Dam Approach</span>
                  <span className="text-white/80 font-mono text-[11px]">2:45 Duration · 4K 60fps</span>
                </div>
                <div className="absolute top-2 right-2 bg-surface-container-lowest/90 backdrop-blur-xs px-2 py-0.5 rounded flex items-center gap-1 shadow-xs">
                  <span className="material-symbols-outlined text-[14px] text-error">videocam</span>
                  <span className="text-[10px] font-bold text-on-surface">RECORDED</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Flight Path Tracking Map & Mission Queue */}
        <div className="col-span-12 xl:col-span-4 flex flex-col gap-6">
          {/* Map Preview */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl h-64 overflow-hidden relative shadow-xs">
            <img
              className="w-full h-full object-cover"
              data-alt="Digital map interface showing drone flight route"
              data-location="Sector 12"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4EZn0sG9Bj46bMcddknowIeUlL5PEB5QvOEsTeUfYJfyMhvOyowd5VtkFtH9FmKpVKP7tdvgn6SP6R_7dh9n7ADIyNNic5A1ykO_itD2glRYze_Wrl_at6u_9uud-BoFudNaCknq19X7CjnqOMXGvQ83bCDDtWkyzIsZhpstfikBJfQ61H-t_7qPpa1Oq0CJ5E6S-NTFSOeFMOgZin-GseAC8I40w7PdPvspibYdd2Pf0YgS1K-_M"
              alt="Drone Flight Path Map"
            />
            <div className="absolute top-3 left-3 bg-surface-container-lowest/95 backdrop-blur-md px-3 py-1 rounded-md border border-outline-variant flex items-center gap-2 shadow-xs">
              <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
              <span className="font-label-md text-xs text-on-surface font-bold">GPS Flight Path</span>
            </div>
            <div className="absolute bottom-3 right-3 bg-surface-container-lowest/90 backdrop-blur-xs px-2 py-1 rounded text-[10px] font-mono text-on-surface border border-outline-variant">
              Waypoints: 14/16
            </div>
          </div>

          {/* Mission Queue */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl flex flex-col overflow-hidden shadow-xs">
            <div className="p-4 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
              <h4 className="font-label-md text-xs text-on-surface-variant uppercase tracking-wider font-bold">
                Mission Queue
              </h4>
              <span className="text-[11px] font-semibold text-primary">3 Scheduled</span>
            </div>
            <div className="flex flex-col divide-y divide-outline-variant">
              {/* Queue Item 1 */}
              <div className="p-4 hover:bg-surface-container-low transition-colors flex items-center justify-between cursor-pointer group">
                <div>
                  <h5 className="font-semibold text-sm text-on-surface group-hover:text-primary transition-colors">
                    MISSION-DRONE-002
                  </h5>
                  <p className="text-xs text-on-surface-variant mt-0.5">Sector 14 Survey • Scheduled 15:00 UTC</p>
                </div>
                <span className="material-symbols-outlined text-outline group-hover:translate-x-1 transition-transform">
                  chevron_right
                </span>
              </div>

              {/* Queue Item 2 */}
              <div className="p-4 hover:bg-surface-container-low transition-colors flex items-center justify-between cursor-pointer group">
                <div>
                  <h5 className="font-semibold text-sm text-on-surface group-hover:text-primary transition-colors">
                    MISSION-DRONE-003
                  </h5>
                  <p className="text-xs text-on-surface-variant mt-0.5">East Bridge Inspection • Pending Approval</p>
                </div>
                <span className="material-symbols-outlined text-outline group-hover:translate-x-1 transition-transform">
                  chevron_right
                </span>
              </div>

              {/* Queue Item 3 */}
              <div className="p-4 hover:bg-surface-container-low transition-colors flex items-center justify-between cursor-pointer group">
                <div>
                  <h5 className="font-semibold text-sm text-on-surface group-hover:text-primary transition-colors">
                    MISSION-DRONE-004
                  </h5>
                  <p className="text-xs text-on-surface-variant mt-0.5">Relief Camp Bravo Perimeter • Scheduled 16:30</p>
                </div>
                <span className="material-symbols-outlined text-outline group-hover:translate-x-1 transition-transform">
                  chevron_right
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
