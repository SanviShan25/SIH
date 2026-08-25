import React, { useState, useEffect } from 'react';
import { getRoads } from '../api/disasterApi';

interface RouteDetail {
  id: string;
  name: string;
  category: 'Arterial Highway' | 'Bridge Crossing' | 'Secondary Road' | 'Evacuation Corridor' | 'Local Street';
  status: 'Open' | 'Partially Affected' | 'Submerged' | 'Blocked';
  waterDepth: string;
  clearance: 'All Vehicles' | 'High Clearance (>4x4)' | 'Emergency Vehicles Only' | 'Impassable';
  condition: string;
  alternativeRoute: string;
  lastSurvey: string;
}

export const RoadAccessibility: React.FC = () => {
  const [filter, setFilter] = useState<'All' | 'Open' | 'Partially Affected' | 'Submerged' | 'Blocked'>('All');
  const [search, setSearch] = useState('');
  const [routes, setRoutes] = useState<RouteDetail[]>([]);
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const res = await getRoads(filter, search);
        if (isMounted) {
          setRoutes(res.routes);
          setMetrics(res.metrics);
        }
      } catch (err) {
        console.error('Failed to load roads:', err);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [filter, search]);

  const filteredRoutes = routes.filter((r) => {
    const matchesFilter = filter === 'All' || r.status === filter;
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const roadAccessibilityData = metrics || {
    overallPercentage: 62,
    openRoads: 12,
    partiallyAffected: 4,
    submergedRoads: 3,
    blockedRoads: 2,
  };

  return (
    <div className="p-4 md:p-6 lg:p-xl w-full min-h-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div>
          <h1 className="font-headline-lg text-2xl md:text-headline-lg text-on-surface font-bold">
            Road Accessibility
          </h1>
          <p className="font-body-md text-sm text-on-surface-variant mt-1">
            Real-time road network status, submerged segments, vehicular clearance levels, and evacuation routes.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-surface border border-outline-variant rounded-lg font-label-md text-xs font-semibold text-on-surface flex items-center gap-1.5 hover:bg-surface-container transition-colors shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">print</span>
            Print Transport Sitrep
          </button>
          <button className="px-3.5 py-2 bg-primary-container text-on-primary rounded-lg font-label-md text-xs font-semibold flex items-center gap-1.5 hover:bg-primary transition-colors shadow-xs cursor-pointer">
            <span className="material-symbols-outlined text-base">download</span>
            Export Routing Data
          </button>
        </div>
      </div>

      {/* Primary Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-xs">
          <div className="flex justify-between items-center text-on-surface-variant mb-1">
            <span className="text-xs uppercase font-bold tracking-wider">Overall Passability</span>
            <span className="material-symbols-outlined text-primary">alt_route</span>
          </div>
          <div className="text-2xl font-bold text-on-surface">
            {roadAccessibilityData.overallPercentage}%
          </div>
          <p className="text-[11px] text-on-surface-variant mt-1 font-medium">
            12 of 19 Routes Clear
          </p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-xs">
          <div className="flex justify-between items-center text-on-surface-variant mb-1">
            <span className="text-xs uppercase font-bold tracking-wider">Open Routes</span>
            <span className="material-symbols-outlined text-[#137333]">check_circle</span>
          </div>
          <div className="text-2xl font-bold text-[#137333]">
            {roadAccessibilityData.openRoads} Roads
          </div>
          <p className="text-[11px] text-[#137333] mt-1 font-medium">
            All Vehicle Types Allowed
          </p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-xs">
          <div className="flex justify-between items-center text-on-surface-variant mb-1">
            <span className="text-xs uppercase font-bold tracking-wider">Partially Affected</span>
            <span className="material-symbols-outlined text-[#a33500]">warning</span>
          </div>
          <div className="text-2xl font-bold text-[#a33500]">
            {roadAccessibilityData.partiallyAffected} Roads
          </div>
          <p className="text-[11px] text-[#a33500] mt-1 font-medium">
            High Clearance (&gt;4x4) Only
          </p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-xs">
          <div className="flex justify-between items-center text-on-surface-variant mb-1">
            <span className="text-xs uppercase font-bold tracking-wider">Submerged</span>
            <span className="material-symbols-outlined text-error">water</span>
          </div>
          <div className="text-2xl font-bold text-error">
            {roadAccessibilityData.submergedRoads} Roads
          </div>
          <p className="text-[11px] text-error mt-1 font-medium">
            Depth &gt;0.6m (No Vehicle Transit)
          </p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-xs col-span-2 sm:col-span-1">
          <div className="flex justify-between items-center text-on-surface-variant mb-1">
            <span className="text-xs uppercase font-bold tracking-wider">Blocked / Closed</span>
            <span className="material-symbols-outlined text-error">block</span>
          </div>
          <div className="text-2xl font-bold text-error">
            {roadAccessibilityData.blockedRoads} Major
          </div>
          <p className="text-[11px] text-error mt-1 font-medium">
            Debris / Structural Cordons
          </p>
        </div>
      </div>

      {/* Routes Table */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-xs">
        {/* Controls */}
        <div className="p-4 border-b border-outline-variant bg-surface-container-low flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">traffic</span>
            <h3 className="font-headline-md text-sm font-bold text-on-surface">
              Road Network Transit &amp; Inundation Directory ({filteredRoutes.length})
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search route name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-surface border border-outline-variant rounded-lg text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary"
              />
              <span className="material-symbols-outlined text-[16px] text-on-surface-variant absolute left-2 top-2">
                search
              </span>
            </div>

            <div className="flex bg-surface border border-outline-variant rounded-lg p-0.5 text-xs font-semibold">
              {(['All', 'Open', 'Partially Affected', 'Submerged', 'Blocked'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setFilter(st)}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    filter === st ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {st}
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
                <th className="py-3 px-4">Route ID</th>
                <th className="py-3 px-4">Road Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Water Depth</th>
                <th className="py-3 px-4">Clearance Allowed</th>
                <th className="py-3 px-4">Condition &amp; Cause</th>
                <th className="py-3 px-4">Alternative Route</th>
                <th className="py-3 px-4 text-right">Last Survey</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant text-on-surface">
              {filteredRoutes.map((r) => (
                <tr key={r.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-primary">{r.id}</td>
                  <td className="py-3 px-4 font-semibold">{r.name}</td>
                  <td className="py-3 px-4 text-on-surface-variant">{r.category}</td>
                  <td className="py-3 px-4">
                    <span
                      className={
                        r.status === 'Blocked' || r.status === 'Submerged'
                          ? 'text-error font-semibold'
                          : r.status === 'Partially Affected'
                          ? 'text-[#a33500] font-semibold'
                          : 'text-[#137333] font-semibold'
                      }
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono">{r.waterDepth}</td>
                  <td className="py-3 px-4">{r.clearance}</td>
                  <td className="py-3 px-4 text-on-surface-variant">{r.condition}</td>
                  <td className="py-3 px-4 font-medium">{r.alternativeRoute}</td>
                  <td className="py-3 px-4 text-right font-mono text-on-surface-variant">{r.lastSurvey}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transit & Routing Advisories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 md:p-5 shadow-xs">
          <h3 className="font-headline-md text-sm font-bold text-on-surface flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-primary text-base">alt_route</span>
            Evacuation Corridor Advisory
          </h3>
          <p className="text-xs text-on-surface-variant leading-relaxed mb-2">
            <strong>North Ring Corridor</strong> is currently designated as the Primary Safe Evacuation Corridor for all civilian and emergency vehicle transport moving between Sector 12 and Sector 14 shelters.
          </p>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Traffic police checkpoints are stationed at Northern Ridge intersection to divert light vehicles away from the submerged Highway 4 overpass.
          </p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 md:p-5 shadow-xs">
          <h3 className="font-headline-md text-sm font-bold text-on-surface flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-primary text-base">emergency</span>
            Heavy Machinery &amp; Clearance Operations
          </h3>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Disaster Management Excavation Team Delta is currently operating on Highway 4 to clear debris. Estimated reopening for single-lane emergency transit is scheduled for 18:00 UTC pending upstream water stabilization.
          </p>
        </div>
      </div>
    </div>
  );
};
