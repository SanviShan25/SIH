import React, { useState } from 'react';

interface FacilityDetail {
  id: string;
  name: string;
  type: 'Bridge' | 'Hospital' | 'Government Building' | 'Power Station' | 'Water Utility';
  location: string;
  status: 'Accessible' | 'Risk Detected' | 'Flood Affected' | 'Inaccessible';
  structuralIntegrity: 'Nominal (100%)' | 'Monitored (85%)' | 'Critical (60%)' | 'Compromised';
  waterLevel: string;
  backupPower: 'Grid Online' | 'Generator 100%' | 'Battery Offline' | 'Solar Active';
  detail: string;
  actionTaken: string;
  lastInspection: string;
}

const mockFacilitiesList: FacilityDetail[] = [
  {
    id: 'B-02',
    name: 'Bridge B-02 River Crossing',
    type: 'Bridge',
    location: 'Sector 12 River Crossing',
    status: 'Risk Detected',
    structuralIntegrity: 'Critical (60%)',
    waterLevel: '1.8m (Pier Submerged)',
    backupPower: 'Solar Active',
    detail: 'Structural Risk Detected · Flow Shear 12,000 m³/s impacting central pier foundation',
    actionTaken: 'Vehicular traffic cordoned; drone structural sensor active',
    lastInspection: '14:25 UTC',
  },
  {
    id: 'H-01',
    name: 'Hospital H-01 Regional Center',
    type: 'Hospital',
    location: 'Sector 12 East Medical Corridor',
    status: 'Accessible',
    structuralIntegrity: 'Nominal (100%)',
    waterLevel: '0.0m (Dry perimeter)',
    backupPower: 'Grid Online',
    detail: 'Fully Accessible · 120 Bed Trauma Care & ICU completely operational',
    actionTaken: 'Designated primary casualty intake facility',
    lastInspection: '14:30 UTC',
  },
  {
    id: 'G-03',
    name: 'Government Building G-03',
    type: 'Government Building',
    location: 'Civic Administrative Center',
    status: 'Flood Affected',
    structuralIntegrity: 'Monitored (85%)',
    waterLevel: '0.4m Ingress',
    backupPower: 'Generator 100%',
    detail: 'Ground Floor Water Ingress (0.4m); records moved to upper floors',
    actionTaken: 'Temporary field ops shifted to Sector 14 HQ',
    lastInspection: '14:15 UTC',
  },
  {
    id: 'PS-01',
    name: 'Substation Sub-04 Grid',
    type: 'Power Station',
    location: 'Sector 14 Grid Corridor',
    status: 'Risk Detected',
    structuralIntegrity: 'Monitored (85%)',
    waterLevel: '0.5m Perimeter',
    backupPower: 'Battery Offline',
    detail: 'Telemetry offline · Flood barrier sandbags deployed around transformer bays',
    actionTaken: 'Power diverted via Sector 10 redundancy feeder',
    lastInspection: '14:00 UTC',
  },
  {
    id: 'WT-02',
    name: 'Sector 12 Water Treatment Plant',
    type: 'Water Utility',
    location: 'West Intake Canal',
    status: 'Flood Affected',
    structuralIntegrity: 'Monitored (85%)',
    waterLevel: '0.7m Ingress',
    backupPower: 'Generator 100%',
    detail: 'Main intake filters isolated to avoid flood silt contamination',
    actionTaken: 'Emergency chlorination tanks online for relief camps',
    lastInspection: '13:50 UTC',
  },
];

export const InfrastructureImpact: React.FC = () => {
  const [filter, setFilter] = useState<'All' | 'Accessible' | 'Risk Detected' | 'Flood Affected'>('All');
  const [search, setSearch] = useState('');

  const filteredFacilities = mockFacilitiesList.filter((f) => {
    const matchesFilter = filter === 'All' || f.status === filter;
    const matchesSearch =
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.id.toLowerCase().includes(search.toLowerCase()) ||
      f.type.toLowerCase().includes(search.toLowerCase()) ||
      f.location.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-4 md:p-6 lg:p-xl w-full min-h-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div>
          <h1 className="font-headline-lg text-2xl md:text-headline-lg text-on-surface font-bold">
            Infrastructure Impact
          </h1>
          <p className="font-body-md text-sm text-on-surface-variant mt-1">
            Status of critical civil assets, bridges, hospitals, power substations, and utilities.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-surface border border-outline-variant rounded-lg font-label-md text-xs font-semibold text-on-surface flex items-center gap-1.5 hover:bg-surface-container transition-colors shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">print</span>
            Print Asset Sitrep
          </button>
          <button className="px-3.5 py-2 bg-primary-container text-on-primary rounded-lg font-label-md text-xs font-semibold flex items-center gap-1.5 hover:bg-primary transition-colors shadow-xs cursor-pointer">
            <span className="material-symbols-outlined text-base">download</span>
            Export Infrastructure Report
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-xs">
          <div className="flex justify-between items-center text-on-surface-variant mb-1">
            <span className="text-xs uppercase font-bold tracking-wider">Tracked Facilities</span>
            <span className="material-symbols-outlined text-primary">domain</span>
          </div>
          <div className="text-2xl font-bold text-on-surface">
            {mockFacilitiesList.length} Assets
          </div>
          <p className="text-[11px] text-on-surface-variant mt-1 font-medium">
            Across Sector 12 &amp; 14
          </p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-xs">
          <div className="flex justify-between items-center text-on-surface-variant mb-1">
            <span className="text-xs uppercase font-bold tracking-wider">Fully Accessible</span>
            <span className="material-symbols-outlined text-[#137333]">check_circle</span>
          </div>
          <div className="text-2xl font-bold text-[#137333]">
            1 Facility
          </div>
          <p className="text-[11px] text-[#137333] mt-1 font-medium">
            Hospital H-01 100% Operational
          </p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-xs">
          <div className="flex justify-between items-center text-on-surface-variant mb-1">
            <span className="text-xs uppercase font-bold tracking-wider">Structural Risk</span>
            <span className="material-symbols-outlined text-error">warning</span>
          </div>
          <div className="text-2xl font-bold text-error">
            2 Facilities
          </div>
          <p className="text-[11px] text-error mt-1 font-medium">
            Bridge B-02 &amp; Substation Sub-04
          </p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-xs">
          <div className="flex justify-between items-center text-on-surface-variant mb-1">
            <span className="text-xs uppercase font-bold tracking-wider">Water Ingress</span>
            <span className="material-symbols-outlined text-[#a33500]">water_damage</span>
          </div>
          <div className="text-2xl font-bold text-[#a33500]">
            2 Facilities
          </div>
          <p className="text-[11px] text-[#a33500] mt-1 font-medium">
            Govt Bldg &amp; Water Treatment
          </p>
        </div>
      </div>

      {/* Facilities Table */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-xs">
        {/* Controls */}
        <div className="p-4 border-b border-outline-variant bg-surface-container-low flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">apartment</span>
            <h3 className="font-headline-md text-sm font-bold text-on-surface">
              Critical Infrastructure Inventory &amp; Integrity Log ({filteredFacilities.length})
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search facility name or type..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-surface border border-outline-variant rounded-lg text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary"
              />
              <span className="material-symbols-outlined text-[16px] text-on-surface-variant absolute left-2 top-2">
                search
              </span>
            </div>

            <div className="flex bg-surface border border-outline-variant rounded-lg p-0.5 text-xs font-semibold">
              {(['All', 'Accessible', 'Risk Detected', 'Flood Affected'] as const).map((st) => (
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
                <th className="py-3 px-4">Asset ID</th>
                <th className="py-3 px-4">Facility Name</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Structural Health</th>
                <th className="py-3 px-4">Water Level</th>
                <th className="py-3 px-4">Backup Power</th>
                <th className="py-3 px-4">Mitigation &amp; Safety Action</th>
                <th className="py-3 px-4 text-right">Last Survey</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant text-on-surface">
              {filteredFacilities.map((f) => (
                <tr key={f.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-primary">{f.id}</td>
                  <td className="py-3 px-4 font-semibold">{f.name}</td>
                  <td className="py-3 px-4 text-on-surface-variant">{f.type}</td>
                  <td className="py-3 px-4 text-on-surface-variant">{f.location}</td>
                  <td className="py-3 px-4">
                    <span
                      className={
                        f.status === 'Risk Detected'
                          ? 'text-error font-semibold'
                          : f.status === 'Flood Affected'
                          ? 'text-[#a33500] font-semibold'
                          : 'text-[#137333] font-semibold'
                      }
                    >
                      {f.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono">{f.structuralIntegrity}</td>
                  <td className="py-3 px-4 font-mono">{f.waterLevel}</td>
                  <td className="py-3 px-4 text-on-surface-variant">{f.backupPower}</td>
                  <td className="py-3 px-4">{f.actionTaken}</td>
                  <td className="py-3 px-4 text-right font-mono text-on-surface-variant">{f.lastInspection}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Structural Diagnostics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 md:p-5 shadow-xs">
          <h3 className="font-headline-md text-sm font-bold text-on-surface flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-primary text-base">engineering</span>
            Bridge &amp; Crossing Structural Safety
          </h3>
          <p className="text-xs text-on-surface-variant leading-relaxed mb-2">
            <strong>Bridge B-02:</strong> Real-time sonar and optical sensors deployed by Drone-001 indicate scouring around the central support piling. Safety cordons remain strictly in place until hydraulic load drops below 8,000 m³/s.
          </p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 md:p-5 shadow-xs">
          <h3 className="font-headline-md text-sm font-bold text-on-surface flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-primary text-base">bolt</span>
            Power &amp; Utilities Redundancy
          </h3>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            All vital medical equipment at Hospital H-01 remains powered via uninterrupted primary grid connection with secondary 500kVA diesel backup on standby. Substation Sub-04 load has been successfully isolated.
          </p>
        </div>
      </div>
    </div>
  );
};
