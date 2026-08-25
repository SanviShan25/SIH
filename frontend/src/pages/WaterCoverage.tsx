import React, { useState, useEffect } from 'react';
import { progressionTimeline } from '../data/mockData';
import { getWaterCoverageSummary, getWaterCoverageZones } from '../api/disasterApi';

interface InundationZone {
  id: string;
  name: string;
  waterDepth: string;
  coveragePct: number;
  flowDirection: string;
  status: 'Critical Rise' | 'Elevated' | 'Stable' | 'Receding';
  riskLevel: 'High' | 'Medium' | 'Low';
  lastSurvey: string;
}

export const WaterCoverage: React.FC = () => {
  const [filter, setFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');
  const [search, setSearch] = useState('');
  const [summary, setSummary] = useState<any>(null);
  const [zones, setZones] = useState<InundationZone[]>([]);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [sumData, zonesData] = await Promise.all([
          getWaterCoverageSummary(),
          getWaterCoverageZones(),
        ]);
        if (isMounted) {
          setSummary(sumData);
          setZones(zonesData);
        }
      } catch (err) {
        console.error('Failed to load water coverage data:', err);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  const filteredZones = zones.filter((z) => {
    const matchesFilter = filter === 'All' || z.riskLevel === filter;
    const matchesSearch = z.name.toLowerCase().includes(search.toLowerCase()) || z.id.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const waterSpreadData = summary || {
    coveragePercentage: 68,
    trend: 'Increasing',
    direction: 'South-East',
    changeSincePreviousSurvey: '+13%',
    peakHeight: '3.2m',
    flowVelocity: '1.8 m/s',
  };

  return (
    <div className="p-4 md:p-6 lg:p-xl w-full min-h-full flex flex-col gap-6">
      {/* Header Row */}
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div>
          <h1 className="font-headline-lg text-2xl md:text-headline-lg text-on-surface font-bold">
            Water Coverage &amp; Spread
          </h1>
          <p className="font-body-md text-sm text-on-surface-variant mt-1">
            Real-time floodwater extent, spread velocity, hydrological progression, and basin inundation metrics.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-surface border border-outline-variant rounded-lg font-label-md text-xs font-semibold text-on-surface flex items-center gap-1.5 hover:bg-surface-container transition-colors shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">print</span>
            Print Survey
          </button>
          <button className="px-3.5 py-2 bg-primary-container text-on-primary rounded-lg font-label-md text-xs font-semibold flex items-center gap-1.5 hover:bg-primary transition-colors shadow-xs cursor-pointer">
            <span className="material-symbols-outlined text-base">download</span>
            Export Hydrology Data
          </button>
        </div>
      </div>

      {/* Primary Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
        {/* Metric 1 */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-xs">
          <div className="flex justify-between items-center text-on-surface-variant mb-1">
            <span className="text-xs uppercase font-bold tracking-wider">Overall Coverage</span>
            <span className="material-symbols-outlined text-primary">water</span>
          </div>
          <div className="text-2xl font-bold text-on-surface">
            {waterSpreadData.coveragePercentage}%
          </div>
          <p className="text-[11px] text-error mt-1 font-medium flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px]">trending_up</span> {waterSpreadData.changeSincePreviousSurvey} in past 4h
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-xs">
          <div className="flex justify-between items-center text-on-surface-variant mb-1">
            <span className="text-xs uppercase font-bold tracking-wider">Spread Trend</span>
            <span className="material-symbols-outlined text-error">navigation</span>
          </div>
          <div className="text-2xl font-bold text-error">
            {waterSpreadData.trend}
          </div>
          <p className="text-[11px] text-on-surface-variant mt-1 font-medium">
            Vector: {waterSpreadData.direction}
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-xs">
          <div className="flex justify-between items-center text-on-surface-variant mb-1">
            <span className="text-xs uppercase font-bold tracking-wider">Peak Water Level</span>
            <span className="material-symbols-outlined text-[#a33500]">height</span>
          </div>
          <div className="text-2xl font-bold text-on-surface">
            {waterSpreadData.peakHeight}
          </div>
          <p className="text-[11px] text-on-surface-variant mt-1 font-medium">
            Recorded at Sector 12 Embankment
          </p>
        </div>

        {/* Metric 4 */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-xs">
          <div className="flex justify-between items-center text-on-surface-variant mb-1">
            <span className="text-xs uppercase font-bold tracking-wider">Flow Velocity</span>
            <span className="material-symbols-outlined text-primary">speed</span>
          </div>
          <div className="text-2xl font-bold text-on-surface">
            {waterSpreadData.flowVelocity}
          </div>
          <p className="text-[11px] text-on-surface-variant mt-1 font-medium">
            Downstream discharge vector
          </p>
        </div>

        {/* Metric 5 */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-xs col-span-2 sm:col-span-1">
          <div className="flex justify-between items-center text-on-surface-variant mb-1">
            <span className="text-xs uppercase font-bold tracking-wider">Monitored Zones</span>
            <span className="material-symbols-outlined text-primary">grid_view</span>
          </div>
          <div className="text-2xl font-bold text-on-surface">
            {zones.length} Sectors
          </div>
          <p className="text-[11px] text-error mt-1 font-medium">
            2 Critical · 2 Elevated · 1 Stable
          </p>
        </div>
      </div>

      {/* Inundation Zones Table Section */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-xs">
        {/* Table Controls */}
        <div className="p-4 border-b border-outline-variant bg-surface-container-low flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">water_loss</span>
            <h3 className="font-headline-md text-sm font-bold text-on-surface">
              Sector Inundation &amp; Drainage Analysis ({filteredZones.length})
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search sector or zone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-surface border border-outline-variant rounded-lg text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary"
              />
              <span className="material-symbols-outlined text-[16px] text-on-surface-variant absolute left-2 top-2">
                search
              </span>
            </div>

            {/* Filter Tabs */}
            <div className="flex bg-surface border border-outline-variant rounded-lg p-0.5 text-xs font-semibold">
              {(['All', 'High', 'Medium', 'Low'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setFilter(r)}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    filter === r ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {r} {r !== 'All' ? 'Risk' : ''}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-body-md">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container text-on-surface-variant font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Zone ID</th>
                <th className="py-3 px-4">Sector / Catchment Name</th>
                <th className="py-3 px-4">Water Depth</th>
                <th className="py-3 px-4">Area Coverage</th>
                <th className="py-3 px-4">Flow Velocity &amp; Vector</th>
                <th className="py-3 px-4">Inundation Status</th>
                <th className="py-3 px-4">Risk Level</th>
                <th className="py-3 px-4 text-right">Last Telemetry</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant text-on-surface">
              {filteredZones.map((z) => (
                <tr key={z.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-primary">{z.id}</td>
                  <td className="py-3 px-4 font-semibold">{z.name}</td>
                  <td className="py-3 px-4 font-mono">{z.waterDepth}</td>
                  <td className="py-3 px-4">{z.coveragePct}%</td>
                  <td className="py-3 px-4 text-on-surface-variant">{z.flowDirection}</td>
                  <td className="py-3 px-4">
                    <span className={z.status === 'Critical Rise' ? 'text-error font-semibold' : z.status === 'Elevated' ? 'text-[#a33500] font-semibold' : 'text-on-surface'}>
                      {z.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={z.riskLevel === 'High' ? 'text-error font-semibold' : z.riskLevel === 'Medium' ? 'text-[#a33500]' : 'text-on-surface-variant'}>
                      {z.riskLevel} Risk
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-on-surface-variant">{z.lastSurvey}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Progression Milestones Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Progression Overview */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 md:p-5 shadow-xs flex flex-col gap-3">
          <div className="flex items-center gap-2 border-b border-outline-variant pb-2">
            <span className="material-symbols-outlined text-primary text-base">history</span>
            <h3 className="font-headline-md text-sm font-bold text-on-surface">
              Hourly Water Spread Timeline
            </h3>
          </div>
          <div className="space-y-2.5">
            {progressionTimeline.map((step, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-lg border border-outline-variant bg-surface-container-low/40 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-on-surface">{step.time}</span>
                  <span className="text-on-surface-variant">Coverage: <strong>{step.waterCoverage}%</strong></span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-on-surface-variant">Rate: <strong className="text-error">{step.changeRate}</strong></span>
                  <span className="text-[11px] text-on-surface-variant font-mono">{step.spreadTrend} ({step.spreadDirection})</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Drainage & Inundation Summary */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 md:p-5 shadow-xs flex flex-col gap-3">
          <div className="flex items-center gap-2 border-b border-outline-variant pb-2">
            <span className="material-symbols-outlined text-primary text-base">info</span>
            <h3 className="font-headline-md text-sm font-bold text-on-surface">
              Hydrological Notes &amp; Discharge Summary
            </h3>
          </div>
          <div className="space-y-2 text-xs text-on-surface-variant leading-relaxed">
            <p>
              • <strong>Upstream River Inflow:</strong> The North Levee tributary is experiencing an inflow rate of 1,250 m³/s, maintaining sustained pressure on Sector 12 downstream sectors.
            </p>
            <p>
              • <strong>Drainage Bottlenecks:</strong> Debris accumulation near Bridge B-02 has reduced normal discharge throughput by approximately 35%, causing localized backflow into Riverside Colony.
            </p>
            <p>
              • <strong>Spread Vector:</strong> Water velocity continues trending South-East towards Lowland Agricultural Basin at 1.8 m/s. Forecast indicates expansion into Sector 14 peripheral zones by 16:00 UTC.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
