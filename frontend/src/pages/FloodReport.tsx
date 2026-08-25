import React from 'react';
import { settlementsData, infrastructureData, roadAccessibilityData, waterSpreadData } from '../data/mockData';

export const FloodReport: React.FC = () => {
  return (
    <div className="p-4 md:p-6 lg:p-xl max-w-5xl mx-auto w-full min-h-full flex flex-col gap-6">
      {/* Report Container */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-md overflow-hidden">
        {/* Report Header */}
        <div className="bg-surface-container py-4 px-6 border-b border-outline-variant flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-headline-lg text-xl md:text-2xl font-bold text-on-surface">
              ASSESSMENT REPORT - Sector 12
            </h1>
            <p className="font-body-md text-xs md:text-sm text-on-surface-variant mt-1">
              Generated: 2023-10-27 14:45 UTC · Source: Aerial Drone Telemetry &amp; GIS Mesh
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="font-label-md text-xs font-semibold bg-surface border border-outline-variant text-on-surface hover:bg-surface-container px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">print</span>
              Print
            </button>
            <button className="font-label-md text-xs font-semibold bg-primary text-on-primary hover:bg-primary/90 px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer">
              <span className="material-symbols-outlined text-base">download</span>
              Export PDF
            </button>
          </div>
        </div>

        {/* Report Body Table */}
        <div className="p-4 md:p-6">
          <div className="overflow-x-auto rounded-lg border border-outline-variant">
            <table className="w-full text-left border-collapse font-body-md text-sm">
              <thead>
                <tr className="border-b-2 border-outline-variant bg-surface-container-low text-primary font-bold uppercase tracking-wider text-xs">
                  <th className="py-3 px-4 w-1/2">Assessment Parameter</th>
                  <th className="py-3 px-4 w-1/2">Status / Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/50 text-on-surface">
                {/* 1. Area */}
                <tr className="hover:bg-surface-container-low/40 transition-colors">
                  <td className="py-3 px-4 font-medium text-on-surface">Area</td>
                  <td className="py-3 px-4 font-semibold text-on-surface">Sector 12</td>
                </tr>

                {/* 2. Water Coverage */}
                <tr className="hover:bg-surface-container-low/40 transition-colors">
                  <td className="py-3 px-4 font-medium text-on-surface">Water Coverage</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-28 bg-surface-variant h-2 rounded-full overflow-hidden">
                        <div className="bg-primary-container h-full rounded-full" style={{ width: `${waterSpreadData.coveragePercentage}%` }} />
                      </div>
                      <span className="font-semibold">{waterSpreadData.coveragePercentage}%</span>
                    </div>
                  </td>
                </tr>

                {/* 3. Water Spread */}
                <tr className="hover:bg-surface-container-low/40 transition-colors">
                  <td className="py-3 px-4 font-medium text-on-surface">Water Spread</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-100 text-primary-container text-xs font-semibold">
                      {waterSpreadData.trend} ({waterSpreadData.direction}, {waterSpreadData.changeSincePreviousSurvey})
                    </span>
                  </td>
                </tr>

                {/* 4. Affected Settlements */}
                <tr className="hover:bg-surface-container-low/40 transition-colors">
                  <td className="py-3 px-4 font-medium text-on-surface">Affected Settlements</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded bg-error-container/30 border border-error text-error text-xs font-semibold">
                      {settlementsData.length} Settlements Inundated
                    </span>
                  </td>
                </tr>

                {/* 5. Victims Detected */}
                <tr className="hover:bg-surface-container-low/40 transition-colors">
                  <td className="py-3 px-4 font-medium text-on-surface">Victims Detected</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded bg-error-container/30 border border-error text-error text-xs font-semibold">
                      7
                    </span>
                  </td>
                </tr>

                {/* 6. Road Blockage */}
                <tr className="hover:bg-surface-container-low/40 transition-colors">
                  <td className="py-3 px-4 font-medium text-on-surface">Road Blockage</td>
                  <td className="py-3 px-4 text-on-surface">{roadAccessibilityData.blockedRoads} Major Routes (Highway 4, Bridge Rd)</td>
                </tr>

                {/* 7. Submerged Roads */}
                <tr className="hover:bg-surface-container-low/40 transition-colors">
                  <td className="py-3 px-4 font-medium text-on-surface">Submerged Roads</td>
                  <td className="py-3 px-4 text-on-surface">{roadAccessibilityData.submergedRoads} Intersections (&gt;0.8m Depth)</td>
                </tr>

                {/* 8. Road Accessibility */}
                <tr className="hover:bg-surface-container-low/40 transition-colors">
                  <td className="py-3 px-4 font-medium text-on-surface">Road Accessibility</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-28 bg-surface-variant h-2 rounded-full overflow-hidden">
                        <div className="bg-[#f59e0b] h-full rounded-full" style={{ width: `${roadAccessibilityData.overallPercentage}%` }} />
                      </div>
                      <span className="font-semibold">{roadAccessibilityData.overallPercentage}% Passable ({roadAccessibilityData.openRoads} Open)</span>
                    </div>
                  </td>
                </tr>

                {/* 9. Infrastructure Impact */}
                <tr className="hover:bg-surface-container-low/40 transition-colors">
                  <td className="py-3 px-4 font-medium text-on-surface">Infrastructure Impact</td>
                  <td className="py-3 px-4 text-on-surface">{infrastructureData.length} Monitored Facilities</td>
                </tr>

                {/* 10. Bridge Status */}
                <tr className="hover:bg-surface-container-low/40 transition-colors">
                  <td className="py-3 px-4 font-medium text-on-surface">Bridge Status</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded bg-tertiary-container/10 border border-tertiary-container text-tertiary-container text-xs font-semibold">
                      Risk Detected (Bridge B-02)
                    </span>
                  </td>
                </tr>

                {/* 11. Nearest Relief Camp */}
                <tr className="hover:bg-surface-container-low/40 transition-colors">
                  <td className="py-3 px-4 font-medium text-on-surface">Nearest Relief Camp</td>
                  <td className="py-3 px-4 text-primary font-medium">
                    Camp A (2.4 km)
                  </td>
                </tr>

                {/* 12. Boats Available */}
                <tr className="hover:bg-surface-container-low/40 transition-colors">
                  <td className="py-3 px-4 font-medium text-on-surface">Boats Available</td>
                  <td className="py-3 px-4 text-on-surface">2 Active Units Ready for Dispatch</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
