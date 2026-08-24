import React from 'react';

export const FloodReport: React.FC = () => {
  return (
    <div className="p-4 md:p-6 lg:p-xl max-w-5xl mx-auto w-full min-h-full flex flex-col gap-6">
      {/* Report Container */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-md overflow-hidden">
        {/* Report Header */}
        <div className="bg-surface-container py-4 px-6 border-b border-outline-variant flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase">
                Official SitRep
              </span>
              <span className="font-mono text-xs text-on-surface-variant">DOC-ID: SITREP-2023-1027-12</span>
            </div>
            <h1 className="font-headline-lg text-xl md:text-2xl font-extrabold text-on-surface">
              FLOOD SITUATION REPORT - Sector 12
            </h1>
            <p className="font-body-md text-xs text-on-surface-variant mt-1">
              Generated: 2023-10-27 14:45 UTC · Source: SKY GUARDIANS Automated Telemetry
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="font-label-md text-xs font-bold bg-surface border border-outline-variant text-on-surface hover:bg-surface-container px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">print</span>
              Print SitRep
            </button>
            <button className="font-label-md text-xs font-bold bg-primary text-on-primary hover:bg-primary/90 px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer">
              <span className="material-symbols-outlined text-base">download</span>
              Export PDF
            </button>
          </div>
        </div>

        {/* Report Body Table */}
        <div className="p-4 md:p-6">
          <div className="overflow-x-auto rounded-lg border border-outline-variant">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-low text-primary font-bold uppercase tracking-wider">
                  <th className="py-3 px-4 w-1/2">Assessment Parameter</th>
                  <th className="py-3 px-4 w-1/2">Current Status / Observation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/60 font-body-md text-on-surface">
                {/* Row 1 */}
                <tr className="hover:bg-surface-container-low/40 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary-container text-base">water</span>
                    Water Coverage
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-surface-variant h-2.5 rounded-full overflow-hidden">
                        <div className="bg-primary-container h-full rounded-full" style={{ width: '68%' }} />
                      </div>
                      <span className="font-mono font-bold text-on-surface">68% Total Inundation</span>
                    </div>
                  </td>
                </tr>

                {/* Row 2 */}
                <tr className="hover:bg-surface-container-low/40 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-error text-base">person_alert</span>
                    Victims Detected (AI Vision)
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-error-container text-error text-xs font-bold border border-error/30">
                      <span className="material-symbols-outlined text-[16px] mr-1.5 fill">warning</span>
                      7 Persons Stranded (Sector 12 North)
                    </span>
                  </td>
                </tr>

                {/* Row 3 */}
                <tr className="hover:bg-surface-container-low/40 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#f59e0b] text-base">block</span>
                    Road Blockages
                  </td>
                  <td className="py-3.5 px-4 text-on-surface-variant font-mono">
                    2 Major Arterial Routes Blocked (Highway 4, Bridge Rd)
                  </td>
                </tr>

                {/* Row 4 */}
                <tr className="hover:bg-surface-container-low/40 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary-container text-base">waves</span>
                    Submerged Roads
                  </td>
                  <td className="py-3.5 px-4 text-on-surface-variant font-mono">
                    3 Primary Intersections (&gt;0.8m Depth)
                  </td>
                </tr>

                {/* Row 5 */}
                <tr className="hover:bg-surface-container-low/40 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#a33500] text-base">bridge</span>
                    Bridge Structural Status
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#ffdbcf] text-[#a33500] text-xs font-bold border border-[#a33500]/30">
                      Structural Risk Detected · Flow Shear 12k m³/s
                    </span>
                  </td>
                </tr>

                {/* Row 6 */}
                <tr className="hover:bg-surface-container-low/40 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-base">location_away</span>
                    Nearest Active Relief Camp
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center text-primary font-bold">
                      <span className="material-symbols-outlined text-[16px] mr-1">location_on</span>
                      Camp Alpha / Sector 14 Shelter (2.4 km)
                    </span>
                  </td>
                </tr>

                {/* Row 7 */}
                <tr className="hover:bg-surface-container-low/40 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-600 text-base">sailing</span>
                    Available Rescue Boats
                  </td>
                  <td className="py-3.5 px-4 text-on-surface font-semibold font-mono">
                    2 Active Units Ready for Dispatch
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Report Footer */}
        <div className="bg-surface py-3 px-6 border-t border-outline-variant flex flex-wrap justify-between items-center gap-3 text-xs">
          <p className="font-label-md text-on-surface-variant uppercase tracking-wider text-[11px]">
            Official sitrep generated by National Disaster Response Operations
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-mono text-on-surface font-semibold">VERIFIED & ARCHIVED</span>
          </div>
        </div>
      </div>
    </div>
  );
};
