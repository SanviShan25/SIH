import React, { useState, useEffect } from 'react';
import { getAssessmentReportCurrent } from '../api/disasterApi';

export const FloodReport: React.FC = () => {
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const data = await getAssessmentReportCurrent();
        if (isMounted) {
          setReport(data);
        }
      } catch (err) {
        console.error('Failed to load assessment report:', err);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  const parameters = report?.parameters || [
    { name: 'Area', value: 'Sector 12' },
    { name: 'Water Coverage', value: '68%' },
    { name: 'Water Spread', value: 'Increasing (South-East, +13%)' },
    { name: 'Affected Settlements', value: '5 Settlements Inundated' },
    { name: 'Victims Detected', value: '7' },
    { name: 'Road Blockage', value: '2 Major Routes (Highway 4, Bridge Rd)' },
    { name: 'Submerged Roads', value: '3 Intersections (>0.8m Depth)' },
    { name: 'Road Accessibility', value: '62% Passable (12 Open)' },
    { name: 'Infrastructure Impact', value: '4 Monitored Facilities' },
    { name: 'Bridge Status', value: 'Risk Detected (Bridge B-02)' },
    { name: 'Nearest Relief Camp', value: 'Camp A (2.4 km)' },
    { name: 'Boats Available', value: '2 Active Units Ready for Dispatch' },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-xl max-w-5xl mx-auto w-full min-h-full flex flex-col gap-6">
      {/* Report Container */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-md overflow-hidden">
        {/* Report Header */}
        <div className="bg-surface-container py-4 px-6 border-b border-outline-variant flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-headline-lg text-xl md:text-2xl font-bold text-on-surface">
              ASSESSMENT REPORT - {report?.sector || 'Sector 12'}
            </h1>
            <p className="font-body-md text-xs md:text-sm text-on-surface-variant mt-1">
              Generated: {report?.generatedAt || '2023-10-27 14:45 UTC'} · Source: {report?.source || 'Aerial Drone Telemetry & GIS Mesh'}
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
            <button
              onClick={() => {
                const apiBase = import.meta.env.VITE_API_BASE_URL || 'https://drone-flood-backend.onrender.com/api/v1';
                window.open(`${apiBase}/report/current/pdf?print=true`, '_blank');
              }}
              className="font-label-md text-xs font-semibold bg-primary text-on-primary hover:bg-primary/90 px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
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
                  <th className="py-3.5 px-4 w-1/2">ASSESSMENT PARAMETER</th>
                  <th className="py-3.5 px-4 w-1/2">STATUS / VALUE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/50 text-on-surface">
                {parameters.map((param: any, idx: number) => (
                  <tr key={idx} className="hover:bg-surface-container-low/40 transition-colors">
                    <td className="py-3.5 px-4">{param.name}</td>
                    <td className="py-3.5 px-4">{param.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
