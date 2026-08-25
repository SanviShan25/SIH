import React, { useState } from 'react';

interface Unit {
  id: string;
  name: string;
  type: string;
  location: string;
  status: 'En Route' | 'On Site' | 'Available';
  personnel: number;
}

const initialUnits: Unit[] = [
  { id: 'U-01', name: 'NDRF Team Alpha', type: 'Special Rescue Squad', location: 'Sector 12 (North)', status: 'En Route', personnel: 8 },
  { id: 'U-02', name: 'Boat Unit 03', type: 'Zodiac Swiftwater', location: 'Riverbend District', status: 'On Site', personnel: 4 },
  { id: 'U-03', name: 'Medical Response 1', type: 'Paramedic Mobile', location: 'Camp Bravo Base', status: 'Available', personnel: 6 },
  { id: 'U-04', name: 'Air Recon Wing 2', type: 'Drone & Helicopter Hub', location: 'Sector 4 Airfield', status: 'On Site', personnel: 5 },
];

export const RescueCoordination: React.FC = () => {
  const [units] = useState<Unit[]>(initialUnits);

  return (
    <div className="p-4 md:p-6 lg:p-xl w-full min-h-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div>
          <h1 className="font-display-lg text-2xl md:text-display-lg text-on-background font-bold">
            Response Planning
          </h1>
          <p className="font-body-lg text-sm md:text-body-lg text-on-surface-variant mt-1">
            Live overview of deployed units, active field incidents, and resource availability.
          </p>
        </div>
        <button className="bg-primary-container text-on-primary font-label-md text-xs font-bold py-2.5 px-4 rounded-lg flex items-center gap-2 hover:bg-primary transition-colors shadow-xs cursor-pointer">
          <span className="material-symbols-outlined text-base">person_add</span>
          Deploy New Unit
        </button>
      </div>

      {/* 3-Column Operations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active Rescue Units Table */}
        <section className="lg:col-span-5 flex flex-col bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-outline-variant bg-surface-container-lowest flex justify-between items-center">
            <h3 className="font-headline-md text-sm font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-base">groups</span>
              Active Field Units ({units.length})
            </h3>
            <span className="text-[11px] font-mono text-on-surface-variant font-semibold">4 DEPLOYED</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-low text-on-surface-variant font-semibold">
                  <th className="p-3">Unit / Name</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {units.map((unit) => (
                  <tr key={unit.id} className="hover:bg-surface-container-low/60 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-on-surface">{unit.name}</div>
                      <div className="text-[10px] text-on-surface-variant">{unit.type} · {unit.personnel} pax</div>
                    </td>
                    <td className="p-3 text-on-surface font-medium whitespace-nowrap">
                      {unit.location}
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          unit.status === 'On Site'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : unit.status === 'En Route'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                            : 'bg-blue-100 text-blue-800 border border-blue-300'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {unit.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button className="text-primary hover:underline font-bold text-xs">
                        Dispatch
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Center Column: Priority Incidents */}
        <section className="lg:col-span-4 flex flex-col bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-outline-variant bg-surface-container-lowest flex justify-between items-center">
            <h3 className="font-headline-md text-sm font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-error text-base">emergency_home</span>
              Priority Incidents
            </h3>
            <span className="px-2 py-0.5 rounded bg-error/10 text-error text-[10px] font-bold">2 Urgent</span>
          </div>

          <div className="p-4 flex flex-col gap-3 overflow-y-auto max-h-[500px]">
            {/* Incident 1 */}
            <div className="relative pl-3 py-2.5 pr-2.5 rounded-r-lg border border-outline-variant border-l-4 border-l-error bg-surface-bright shadow-xs hover:shadow-sm transition-shadow">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-bold text-xs text-on-surface">Family Stranded on Rooftop (4 Pax)</h4>
                <span className="font-mono text-[10px] text-on-surface-variant">2m ago</span>
              </div>
              <p className="text-[11px] text-on-surface-variant mb-2">
                Rapidly rising flood waters in residential block. Swiftwater boat rescue required urgently.
              </p>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1 text-[11px] text-on-surface font-medium bg-surface-variant px-2 py-0.5 rounded">
                  <span className="material-symbols-outlined text-[13px]">location_on</span> Sector 12 North
                </div>
                <button className="text-primary font-bold text-xs hover:underline">
                  Assign Unit
                </button>
              </div>
            </div>

            {/* Incident 2 */}
            <div className="relative pl-3 py-2.5 pr-2.5 rounded-r-lg border border-outline-variant border-l-4 border-l-[#a33500] bg-surface-bright shadow-xs hover:shadow-sm transition-shadow">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-bold text-xs text-on-surface">Medical Trauma Emergency</h4>
                <span className="font-mono text-[10px] text-on-surface-variant">5m ago</span>
              </div>
              <p className="text-[11px] text-on-surface-variant mb-2">
                Elderly patient requiring immediate trauma care. Access road currently submerged.
              </p>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1 text-[11px] text-on-surface font-medium bg-surface-variant px-2 py-0.5 rounded">
                  <span className="material-symbols-outlined text-[13px]">location_on</span> Bridge Road
                </div>
                <button className="text-primary font-bold text-xs hover:underline">
                  Assign Unit
                </button>
              </div>
            </div>

            {/* Incident 3 */}
            <div className="relative pl-3 py-2.5 pr-2.5 rounded-r-lg border border-outline-variant border-l-4 border-l-secondary bg-surface-bright shadow-xs hover:shadow-sm transition-shadow">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-bold text-xs text-on-surface">Supply Route Cleared</h4>
                <span className="font-mono text-[10px] text-on-surface-variant">12m ago</span>
              </div>
              <p className="text-[11px] text-on-surface-variant mb-2">
                Engineering team has successfully cleared Highway 4 for heavy humanitarian transport.
              </p>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1 text-[11px] text-on-surface font-medium bg-surface-variant px-2 py-0.5 rounded">
                  <span className="material-symbols-outlined text-[13px]">location_on</span> Highway 4 Pass
                </div>
                <button className="text-primary font-bold text-xs hover:underline">
                  View Route
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Resource Allocation Bento */}
        <section className="lg:col-span-3 flex flex-col bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-outline-variant bg-surface-container-lowest">
            <h3 className="font-headline-md text-sm font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-base">inventory_2</span>
              Field Resources
            </h3>
          </div>

          <div className="flex-1 p-4 flex flex-col gap-3">
            {/* Boats */}
            <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-primary-fixed text-lg">sailing</span>
                </div>
                <div>
                  <h4 className="font-bold text-xs text-on-surface">Rescue Boats</h4>
                  <p className="text-[10px] text-on-surface-variant uppercase">Available for Ops</p>
                </div>
              </div>
              <span className="text-2xl font-black text-primary">4</span>
            </div>

            {/* Life Jackets */}
            <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#ffdbcf] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#380d00] text-lg">safety_check</span>
                </div>
                <div>
                  <h4 className="font-bold text-xs text-on-surface">Life Jackets</h4>
                  <p className="text-[10px] text-on-surface-variant uppercase">In Stock</p>
                </div>
              </div>
              <span className="text-2xl font-black text-[#a33500]">50</span>
            </div>

            {/* Medical Kits */}
            <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-error-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-error-container text-lg">medical_services</span>
                </div>
                <div>
                  <h4 className="font-bold text-xs text-on-surface">Trauma Kits</h4>
                  <p className="text-[10px] text-on-surface-variant uppercase">Ready to Deploy</p>
                </div>
              </div>
              <span className="text-2xl font-black text-error">12</span>
            </div>

            <div className="mt-auto pt-3 border-t border-outline-variant">
              <button className="w-full bg-surface-container-lowest border border-outline-variant text-primary font-bold text-xs py-2 px-3 rounded-lg hover:bg-surface-container-high transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer">
                <span className="material-symbols-outlined text-sm">local_shipping</span>
                Request Resupply Batch
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
