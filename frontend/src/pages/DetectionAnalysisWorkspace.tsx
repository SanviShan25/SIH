import React, { useState, useEffect } from 'react';
import { getLatestDetections, triggerAiInference } from '../api/disasterApi';
import { getSocket } from '../api/socketClient';

export const DetectionAnalysisWorkspace: React.FC = () => {
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);
  const [detectionsData, setDetectionsData] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const data = await getLatestDetections();
        if (isMounted) {
          setDetectionsData(data);
        }
      } catch (err) {
        console.error('Failed to load detection metadata:', err);
      }
    }
    loadData();

    const socket = getSocket();
    socket.on('detection:new', (newFrame) => {
      if (isMounted) {
        setDetectionsData(newFrame);
      }
    });

    return () => {
      isMounted = false;
      socket.off('detection:new');
    };
  }, []);

  const handleRunAiScan = async () => {
    setIsScanning(true);
    try {
      const result = await triggerAiInference({ missionId: 'MISSION-DRONE-001', scanType: 'YOLOv8-Disaster Vision' });
      setDetectionsData(result);
    } catch (err) {
      console.error('Failed to run AI inference:', err);
    } finally {
      setTimeout(() => setIsScanning(false), 800);
    }
  };

  const detectionsList = detectionsData?.detections || [
    { id: '1', class: 'Person', type: 'person', confidence: 0.94, bbox: { top: '30%', left: '45%', width: '48px', height: '68px' } },
    { id: '2', class: 'Rescue Boat', type: 'boat', confidence: 0.96, bbox: { top: '40%', left: '20%', width: '130px', height: '55px' } },
    { id: '3', class: 'Submerged Vehicle', type: 'vehicle', confidence: 0.88, bbox: { top: '60%', right: '30%', width: '90px', height: '75px' } },
  ];

  const victimsCount = detectionsList.filter((d: any) => d.type === 'person').length;
  const boatsCount = detectionsList.filter((d: any) => d.type === 'boat').length;
  const vehiclesCount = detectionsList.filter((d: any) => d.type === 'vehicle').length;

  return (
    <div className="p-4 md:p-6 lg:p-xl w-full min-h-full flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div>
          <h1 className="font-headline-lg text-2xl md:text-headline-lg text-on-surface font-bold">
            Detection &amp; Analysis Workspace
          </h1>
          <p className="font-body-md text-sm text-on-surface-variant mt-1">
            Sector 12 · DRONE-001 · AI Vision Model: <span className="font-mono font-semibold text-primary">YOLOv8-Disaster-v4.2</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleRunAiScan}
            disabled={isScanning}
            className="px-md py-sm bg-primary-container text-on-primary rounded-lg font-label-md text-xs font-semibold flex items-center gap-1.5 hover:bg-primary transition-colors shadow-xs cursor-pointer disabled:opacity-50"
          >
            <span className={`material-symbols-outlined text-base ${isScanning ? 'animate-spin' : ''}`}>
              {isScanning ? 'sync' : 'auto_awesome'}
            </span>
            {isScanning ? 'Processing Inference...' : 'Run YOLOv8 AI Scan'}
          </button>
          <button
            onClick={() => setShowBoundingBoxes((prev) => !prev)}
            className="px-md py-sm bg-surface border border-outline-variant rounded-lg font-label-md text-xs font-semibold text-on-surface flex items-center gap-1.5 hover:bg-surface-container transition-colors shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">filter_list</span>
            {showBoundingBoxes ? 'Hide Overlays' : 'Show Overlays'}
          </button>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 min-h-[600px]">
        {/* Left Panel: Survey Footage Analysis */}
        <div className="xl:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden flex flex-col relative shadow-xs p-3 md:p-4">
          <div className="px-3 py-2 border-b border-outline-variant bg-surface rounded-t-lg flex justify-between items-center z-10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-label-md text-xs text-on-surface font-bold">MISSION FOOTAGE (AI VISION ENHANCED)</span>
            </div>
            <span className="font-data-mono text-xs text-on-surface-variant">REC 00:14:32:05 · HD 1080P · YOLOv8 CONF: 94.2%</span>
          </div>

          <div className="relative flex-1 bg-inverse-surface w-full min-h-[380px] overflow-hidden rounded-lg mt-2">
            <img
              alt="Drone Reconnaissance Frame"
              className="w-full h-full object-cover opacity-90"
              data-alt="Aerial view of flooded suburban sector with computer vision overlays"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAuWBn-OvaKI4G019GpMSeEw6JfjDjpMZdlgKq4sI9jb9kO9ZzZYpMCI6_b0yKBCNgLU6fPAfq4UPHx5kfw2TOnPHPTZZWO5P07BZlYJtONa8biKbG9YNDETWfxgGUFzflKPK4LLpXVhNJFWCKhJY49SLGJ3uZFn_n0dbyhumLlX8pcAQKASwa0Slj2Tz9aTIhy2f714EspXnFSg6Prjg_dmU26gdwFoETUsk2Nd_Vd-SN75hK3vt4i"
            />

            {/* Scanning Beam Animation */}
            {isScanning && (
              <div className="absolute inset-0 bg-primary/10 pointer-events-none flex flex-col justify-between">
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-bounce" />
                <div className="text-center font-mono font-bold text-xs text-cyan-300 pb-4 tracking-widest uppercase">
                  ⚡ Executing Neural Feature Extraction...
                </div>
              </div>
            )}

            {/* Bounding Boxes Overlay */}
            {showBoundingBoxes && (
              <div className="absolute inset-0 pointer-events-none">
                {detectionsList.map((d: any, idx: number) => {
                  const isPerson = d.type === 'person' || d.class === 'Person';
                  const isBoat = d.type === 'boat' || d.class.includes('Boat');
                  const borderCol = isPerson ? 'border-error bg-error/15 text-error' : isBoat ? 'border-primary bg-primary/15 text-primary' : 'border-[#a33500] bg-[#a33500]/15 text-[#a33500]';
                  const badgeBg = isPerson ? 'bg-error text-white' : isBoat ? 'bg-primary text-white' : 'bg-[#a33500] text-white';

                  return (
                    <div
                      key={d.id || idx}
                      style={{
                        position: 'absolute',
                        top: d.bbox?.top,
                        left: d.bbox?.left,
                        right: d.bbox?.right,
                        width: d.bbox?.width,
                        height: d.bbox?.height,
                      }}
                      className={`border-2 ${borderCol} rounded-xs animate-pulse`}
                    >
                      <div className={`absolute -top-[20px] -left-[2px] ${badgeBg} px-1.5 py-0.5 text-[9px] font-mono font-bold whitespace-nowrap rounded-t-xs shadow-xs`}>
                        {d.class} - {Math.round((d.confidence || 0.9) * 100)}%
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Telemetry HUD Overlay (Bottom) */}
            <div className="absolute bottom-3 left-3 right-3 flex flex-wrap justify-between items-center text-white font-data-mono text-[11px] bg-on-background/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 gap-2">
              <span>LAT: 28.6139° N</span>
              <span>LONG: 77.2090° E</span>
              <span>ALT: 82.4m AGL</span>
              <span>SPD: 14.2 m/s</span>
              <span>CONFIDENCE: 94.2%</span>
            </div>
          </div>
        </div>

        {/* Right Panel: Mission Telemetry & Detection Summary */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          {/* Mission Info Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 md:p-5 shadow-xs">
            <h3 className="font-headline-md text-sm font-bold text-on-surface mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-base">flight_takeoff</span>
              Mission Status & Health
            </h3>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-surface p-3 rounded-lg border border-outline-variant">
                <p className="text-[11px] font-semibold text-on-surface-variant mb-1 uppercase">Battery</p>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary-container text-[20px]">battery_5_bar</span>
                  <span className="font-data-mono text-base font-bold text-on-surface">74%</span>
                </div>
              </div>
              <div className="bg-surface p-3 rounded-lg border border-outline-variant">
                <p className="text-[11px] font-semibold text-on-surface-variant mb-1 uppercase">Signal Link</p>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary-container text-[20px]">signal_cellular_4_bar</span>
                  <span className="font-data-mono text-base font-bold text-on-surface">Strong</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs divide-y divide-surface-variant">
              <div className="flex justify-between items-center py-1.5">
                <span className="text-on-surface-variant">Target Altitude</span>
                <span className="font-mono font-bold text-on-surface">82m</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-on-surface-variant">Area Scanned</span>
                <span className="font-mono font-bold text-on-surface">3.2 km²</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-on-surface-variant">Return ETA</span>
                <span className="font-mono font-bold text-on-surface">18m 42s</span>
              </div>
            </div>
          </div>

          {/* Detection Summary Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 md:p-5 shadow-xs flex-1">
            <h3 className="font-headline-md text-sm font-bold text-on-surface mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-base">troubleshoot</span>
              AI Detection Summary
            </h3>

            <div className="space-y-2.5 mt-3">
              {/* Victims */}
              <div className="bg-error-container/20 border border-error/30 p-3 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-error/15 flex items-center justify-center">
                    <span className="material-symbols-outlined text-error text-[18px]">person_alert</span>
                  </div>
                  <div>
                    <p className="font-semibold text-xs text-on-surface">Victims Detected</p>
                    <p className="text-[11px] text-error font-semibold">Critical Priority</p>
                  </div>
                </div>
                <span className="font-data-mono text-2xl font-black text-error">{victimsCount}</span>
              </div>

              {/* Boats */}
              <div className="bg-primary-container/10 border border-primary-container/25 p-3 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-primary-container/15 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary-container text-[18px]">sailing</span>
                  </div>
                  <div>
                    <p className="font-semibold text-xs text-on-surface">Rescue Boats</p>
                    <p className="text-[11px] text-on-surface-variant">Active Assets</p>
                  </div>
                </div>
                <span className="font-data-mono text-2xl font-black text-primary-container">{boatsCount}</span>
              </div>

              {/* Vehicles */}
              <div className="bg-[#a33500]/10 border border-[#a33500]/25 p-3 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-[#a33500]/15 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#a33500] text-[18px]">directions_car</span>
                  </div>
                  <div>
                    <p className="font-semibold text-xs text-on-surface">Vehicles</p>
                    <p className="text-[11px] text-on-surface-variant">Stranded / Submerged</p>
                  </div>
                </div>
                <span className="font-data-mono text-2xl font-black text-[#a33500]">{vehiclesCount}</span>
              </div>

              {/* Obstacles */}
              <div className="bg-surface border border-outline-variant p-3 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-surface-variant flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-surface-variant text-[18px]">warning</span>
                  </div>
                  <div>
                    <p className="font-semibold text-xs text-on-surface">Road Obstacles</p>
                    <p className="text-[11px] text-on-surface-variant">Debris & Fallen Trees</p>
                  </div>
                </div>
                <span className="font-data-mono text-2xl font-black text-on-surface">3</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
