import React, { useState, useEffect } from 'react';
import { getReliefCamps } from '../api/disasterApi';
import { getSocket } from '../api/socketClient';

interface Camp {
  id: string;
  name: string;
  location: string;
  status: 'Critical' | 'Warning' | 'Stable';
  occupancy: number;
  capacity: number;
  foodDays: string;
  foodCritical?: boolean;
  waterDays: string;
  waterCritical?: boolean;
  medsStatus: 'Low' | 'Ok' | 'Adequate';
  personnel: number;
}

export const ReliefCampsOversight: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [camps, setCamps] = useState<Camp[]>([]);
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const res = await getReliefCamps(search, filter);
        if (isMounted) {
          setCamps(res.camps);
          setMetrics(res.metrics);
        }
      } catch (err) {
        console.error('Failed to load relief camps:', err);
      }
    }
    loadData();

    const socket = getSocket();
    socket.on('camp:status-change', (updatedCamp) => {
      if (isMounted) {
        setCamps((prev) => prev.map((c) => (c.id === updatedCamp.id ? updatedCamp : c)));
      }
    });

    return () => {
      isMounted = false;
      socket.off('camp:status-change');
    };
  }, [filter, search]);

  const filteredCamps = camps.filter((c) => {
    const matchesFilter = filter === 'all' || c.status.toLowerCase() === filter.toLowerCase();
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.location.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalOccupancy = metrics?.totalOccupancy || camps.reduce((acc, c) => acc + c.occupancy, 0);
  const totalCapacity = metrics?.totalCapacity || camps.reduce((acc, c) => acc + c.capacity, 0);
  const capacityPct = metrics?.capacityUtilizationPct || Math.round((totalOccupancy / (totalCapacity || 1)) * 100);
  const criticalCamps = metrics?.criticalCampsCount || camps.filter((c) => c.status === 'Critical' || c.foodCritical || c.waterCritical).length;

  return (
    <div className="p-4 md:p-6 lg:p-xl w-full min-h-full flex flex-col gap-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display-lg text-2xl md:text-display-lg text-on-surface font-bold">
            Relief Camps Oversight
          </h1>
          <p className="font-body-md text-sm md:text-body-md text-on-surface-variant mt-1">
            Real-time shelter capacity ({capacityPct}% Avg Utilized), {criticalCamps} critical camps requiring rations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search camp..."
            className="bg-surface border border-outline-variant rounded-lg px-3 py-2 text-xs text-on-surface focus:border-primary focus:outline-none"
          />

          <div className="relative min-w-[200px]">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full appearance-none bg-surface border border-outline-variant rounded-lg pl-4 pr-10 py-2 font-body-md text-xs md:text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all cursor-pointer shadow-xs"
            >
              <option value="all">Capacity Status: All</option>
              <option value="critical">Critical (&gt;90%)</option>
              <option value="warning">Warning (75-90%)</option>
              <option value="stable">Stable (&lt;75%)</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-base">
              expand_more
            </span>
          </div>

          <button className="bg-primary hover:bg-primary/90 text-on-primary font-label-md text-xs font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer">
            <span className="material-symbols-outlined text-base">add</span>
            Register New Camp
          </button>
        </div>
      </div>

      {/* Bento Grid of Camp Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCamps.map((camp) => {
          const occupancyRate = Math.round((camp.occupancy / camp.capacity) * 100);

          return (
            <div
              key={camp.id}
              className="bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-xs hover:border-outline hover:shadow-md transition-all group flex flex-col relative"
            >
              {/* Status accent bar */}
              <div
                className={`absolute top-0 left-0 bottom-0 w-1.5 ${
                  camp.status === 'Critical'
                    ? 'bg-error'
                    : camp.status === 'Warning'
                    ? 'bg-tertiary-container'
                    : 'bg-primary'
                }`}
              />

              {/* Card Header */}
              <div className="p-4 border-b border-surface-variant flex justify-between items-start pl-6">
                <div>
                  <h3 className="font-headline-md text-base font-bold text-on-surface">{camp.name}</h3>
                  <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                    {camp.location}
                  </p>
                </div>

                <span
                  className={`font-label-md text-xs px-2.5 py-1 rounded flex items-center gap-1 font-bold ${
                    camp.status === 'Critical'
                      ? 'bg-error-container text-error border border-error/30 animate-pulse'
                      : camp.status === 'Warning'
                      ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant border border-tertiary-container/30'
                      : 'bg-primary-container/10 text-primary border border-primary/20'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {camp.status === 'Critical' ? 'error' : camp.status === 'Warning' ? 'warning' : 'check_circle'}
                  </span>
                  {camp.status}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col gap-4 pl-6">
                {/* Occupancy Progress */}
                <div>
                  <div className="flex justify-between items-end mb-1 text-xs">
                    <span className="font-semibold text-on-surface-variant">Occupancy Rate</span>
                    <span
                      className={`font-mono font-bold ${
                        camp.status === 'Critical'
                          ? 'text-error'
                          : camp.status === 'Warning'
                          ? 'text-tertiary-container'
                          : 'text-primary'
                      }`}
                    >
                      {occupancyRate}%
                    </span>
                  </div>
                  <div className="w-full bg-surface-variant rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        camp.status === 'Critical'
                          ? 'bg-error'
                          : camp.status === 'Warning'
                          ? 'bg-tertiary-container'
                          : 'bg-primary'
                      }`}
                      style={{ width: `${occupancyRate}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-1 font-mono">
                    {camp.occupancy.toLocaleString()} / {camp.capacity.toLocaleString()} capacity
                  </p>
                </div>

                {/* Supplies Grid */}
                <div className="grid grid-cols-3 gap-2 border-t border-surface-variant pt-3">
                  <div className="text-center p-1.5 rounded bg-surface-container-low/50">
                    <span className="material-symbols-outlined text-secondary block text-lg mb-0.5">restaurant</span>
                    <span className="font-semibold text-[11px] text-on-surface block">Food</span>
                    <span
                      className={`font-mono text-xs font-bold ${
                        camp.foodCritical ? 'text-error animate-pulse' : 'text-on-surface-variant'
                      }`}
                    >
                      {camp.foodDays}
                    </span>
                  </div>

                  <div className="text-center p-1.5 rounded bg-surface-container-low/50">
                    <span className="material-symbols-outlined text-secondary block text-lg mb-0.5">water_drop</span>
                    <span className="font-semibold text-[11px] text-on-surface block">Water</span>
                    <span
                      className={`font-mono text-xs font-bold ${
                        camp.waterCritical ? 'text-error animate-pulse' : 'text-on-surface-variant'
                      }`}
                    >
                      {camp.waterDays}
                    </span>
                  </div>

                  <div className="text-center p-1.5 rounded bg-surface-container-low/50">
                    <span className="material-symbols-outlined text-secondary block text-lg mb-0.5">medical_services</span>
                    <span className="font-semibold text-[11px] text-on-surface block">Meds</span>
                    <span
                      className={`font-mono text-xs font-bold ${
                        camp.medsStatus === 'Low' ? 'text-error' : 'text-emerald-700'
                      }`}
                    >
                      {camp.medsStatus}
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-surface-variant pt-3 mt-auto text-xs">
                  <div className="flex items-center gap-1.5 text-on-surface-variant">
                    <span className="material-symbols-outlined text-secondary text-[16px]">group</span>
                    <span>
                      Personnel: <strong className="text-on-surface">{camp.personnel}</strong>
                    </span>
                  </div>
                  <button className="font-bold text-primary hover:text-primary-container transition-colors flex items-center gap-1">
                    Details <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
