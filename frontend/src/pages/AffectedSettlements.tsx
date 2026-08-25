import React, { useState } from 'react';
import { settlementsData } from '../data/mockData';

interface SettlementDetail {
  id: string;
  name: string;
  location: string;
  status: 'Flood Affected' | 'Partially Submerged' | 'Safe' | 'Inaccessible';
  population: number;
  households: number;
  waterDepth: string;
  evacuationPriority: 'Immediate' | 'High' | 'Moderate' | 'Low';
  evacuatedPercentage: number;
  nearestCamp: string;
  lastUpdated: string;
}

const mockSettlementDetails: SettlementDetail[] = [
  {
    id: 'SET-01',
    name: 'Sector 12 Village',
    location: 'Sector 12 North Riverbank',
    status: 'Flood Affected',
    population: 620,
    households: 140,
    waterDepth: '1.4m',
    evacuationPriority: 'Immediate',
    evacuatedPercentage: 65,
    nearestCamp: 'Sector 14 Shelter (1.8 km)',
    lastUpdated: '14:30 UTC',
  },
  {
    id: 'SET-02',
    name: 'Riverside Colony',
    location: 'Sector 12 South Embankment',
    status: 'Partially Submerged',
    population: 450,
    households: 95,
    waterDepth: '1.8m',
    evacuationPriority: 'Immediate',
    evacuatedPercentage: 80,
    nearestCamp: 'Riverside High School (1.2 km)',
    lastUpdated: '14:25 UTC',
  },
  {
    id: 'SET-03',
    name: 'East Hamlet',
    location: 'East Levee Approach',
    status: 'Flood Affected',
    population: 280,
    households: 60,
    waterDepth: '0.9m',
    evacuationPriority: 'High',
    evacuatedPercentage: 50,
    nearestCamp: 'Camp Bravo (3.1 km)',
    lastUpdated: '14:15 UTC',
  },
  {
    id: 'SET-04',
    name: 'Old Market Settlement',
    location: 'Central Sector 12',
    status: 'Partially Submerged',
    population: 510,
    households: 115,
    waterDepth: '0.7m',
    evacuationPriority: 'High',
    evacuatedPercentage: 40,
    nearestCamp: 'Sector 14 Shelter (2.4 km)',
    lastUpdated: '14:10 UTC',
  },
  {
    id: 'SET-05',
    name: 'Greenfields Basti',
    location: 'West Lowlands Catchment',
    status: 'Flood Affected',
    population: 340,
    households: 75,
    waterDepth: '1.1m',
    evacuationPriority: 'Immediate',
    evacuatedPercentage: 70,
    nearestCamp: 'South Hills Stadium (2.9 km)',
    lastUpdated: '13:55 UTC',
  },
];

export const AffectedSettlements: React.FC = () => {
  const [filter, setFilter] = useState<'All' | 'Flood Affected' | 'Partially Submerged'>('All');
  const [search, setSearch] = useState('');

  const filteredSettlements = mockSettlementDetails.filter((s) => {
    const matchesFilter = filter === 'All' || s.status === filter;
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.location.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalPopulation = mockSettlementDetails.reduce((sum, s) => sum + s.population, 0);
  const totalHouseholds = mockSettlementDetails.reduce((sum, s) => sum + s.households, 0);

  return (
    <div className="p-4 md:p-6 lg:p-xl w-full min-h-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div>
          <h1 className="font-headline-lg text-2xl md:text-headline-lg text-on-surface font-bold">
            Affected Settlements
          </h1>
          <p className="font-body-md text-sm text-on-surface-variant mt-1">
            Civilian population monitoring, inundation impact, household vulnerability, and evacuation progress.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-surface border border-outline-variant rounded-lg font-label-md text-xs font-semibold text-on-surface flex items-center gap-1.5 hover:bg-surface-container transition-colors shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">print</span>
            Print Census
          </button>
          <button className="px-3.5 py-2 bg-primary-container text-on-primary rounded-lg font-label-md text-xs font-semibold flex items-center gap-1.5 hover:bg-primary transition-colors shadow-xs cursor-pointer">
            <span className="material-symbols-outlined text-base">download</span>
            Export Settlement Sitrep
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-xs">
          <div className="flex justify-between items-center text-on-surface-variant mb-1">
            <span className="text-xs uppercase font-bold tracking-wider">Settlements Inundated</span>
            <span className="material-symbols-outlined text-error">location_city</span>
          </div>
          <div className="text-2xl font-bold text-error">
            {settlementsData.length} Zones
          </div>
          <p className="text-[11px] text-error mt-1 font-medium">
            100% Monitored via Drone-001
          </p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-xs">
          <div className="flex justify-between items-center text-on-surface-variant mb-1">
            <span className="text-xs uppercase font-bold tracking-wider">Population at Risk</span>
            <span className="material-symbols-outlined text-primary">groups</span>
          </div>
          <div className="text-2xl font-bold text-on-surface">
            {totalPopulation.toLocaleString()}
          </div>
          <p className="text-[11px] text-on-surface-variant mt-1 font-medium">
            Across {totalHouseholds} households
          </p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-xs">
          <div className="flex justify-between items-center text-on-surface-variant mb-1">
            <span className="text-xs uppercase font-bold tracking-wider">Immediate Evacuation</span>
            <span className="material-symbols-outlined text-error">crisis_alert</span>
          </div>
          <div className="text-2xl font-bold text-error">
            3 Settlements
          </div>
          <p className="text-[11px] text-error mt-1 font-medium">
            Water depth exceeding 1.0m
          </p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-xs">
          <div className="flex justify-between items-center text-on-surface-variant mb-1">
            <span className="text-xs uppercase font-bold tracking-wider">Average Evacuation</span>
            <span className="material-symbols-outlined text-[#137333]">check_circle</span>
          </div>
          <div className="text-2xl font-bold text-on-surface">
            61%
          </div>
          <p className="text-[11px] text-[#137333] mt-1 font-medium">
            1,350+ Relocated to Safe Camps
          </p>
        </div>
      </div>

      {/* Settlements Table */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-xs">
        {/* Controls */}
        <div className="p-4 border-b border-outline-variant bg-surface-container-low flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">home_pin</span>
            <h3 className="font-headline-md text-sm font-bold text-on-surface">
              Settlement Status &amp; Evacuation Register ({filteredSettlements.length})
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search settlement name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-surface border border-outline-variant rounded-lg text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary"
              />
              <span className="material-symbols-outlined text-[16px] text-on-surface-variant absolute left-2 top-2">
                search
              </span>
            </div>

            <div className="flex bg-surface border border-outline-variant rounded-lg p-0.5 text-xs font-semibold">
              {(['All', 'Flood Affected', 'Partially Submerged'] as const).map((st) => (
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
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Settlement Name</th>
                <th className="py-3 px-4">Location / Sector</th>
                <th className="py-3 px-4">Flood Status</th>
                <th className="py-3 px-4">Water Depth</th>
                <th className="py-3 px-4">Population (HH)</th>
                <th className="py-3 px-4">Evacuation Priority</th>
                <th className="py-3 px-4">Evacuated</th>
                <th className="py-3 px-4">Assigned Relief Hub</th>
                <th className="py-3 px-4 text-right">Last Survey</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant text-on-surface">
              {filteredSettlements.map((s) => (
                <tr key={s.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-primary">{s.id}</td>
                  <td className="py-3 px-4 font-semibold">{s.name}</td>
                  <td className="py-3 px-4 text-on-surface-variant">{s.location}</td>
                  <td className="py-3 px-4">
                    <span className={s.status === 'Flood Affected' ? 'text-error font-semibold' : 'text-[#a33500] font-semibold'}>
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono">{s.waterDepth}</td>
                  <td className="py-3 px-4">
                    {s.population} <span className="text-on-surface-variant text-[11px]">({s.households} HH)</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={s.evacuationPriority === 'Immediate' ? 'text-error font-bold' : 'text-[#a33500] font-semibold'}>
                      {s.evacuationPriority}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold">{s.evacuatedPercentage}%</td>
                  <td className="py-3 px-4 text-on-surface-variant">{s.nearestCamp}</td>
                  <td className="py-3 px-4 text-right font-mono text-on-surface-variant">{s.lastUpdated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Field Support & Evacuation Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 md:p-5 shadow-xs">
          <h3 className="font-headline-md text-sm font-bold text-on-surface flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-primary text-base">support</span>
            Active Field Directives
          </h3>
          <ul className="space-y-2 text-xs text-on-surface-variant">
            <li>• <strong>Sector 12 Village:</strong> NDRF Swiftwater Boat Unit 03 deployed to assist high-water extraction from northern clusters.</li>
            <li>• <strong>Riverside Colony:</strong> Primary bridge access blocked. Relief operations being routed through North Ridge high-clearance bypass.</li>
            <li>• <strong>Greenfields Basti:</strong> Continuous drone surveillance active to monitor low-lying embankment levee seepage.</li>
          </ul>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 md:p-5 shadow-xs">
          <h3 className="font-headline-md text-sm font-bold text-on-surface flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-primary text-base">emergency_home</span>
            Relief &amp; Shelter Allocation
          </h3>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            All registered evacuees are being accounted for at Sector 14 Primary Shelter and Riverside High School. Regular rations and medical supplies are being delivered by ground teams under NDRF Sector 12 Coordination.
          </p>
        </div>
      </div>
    </div>
  );
};
