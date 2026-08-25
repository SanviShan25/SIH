import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { getSocket } from '../api/socketClient';

export interface MapLayerState {
  waterLevels: boolean;
  waterSpread: boolean;
  settlements: boolean;
  roadStatus: boolean;
  infrastructure: boolean;
  activeAssets: boolean;
  safeRoutes: boolean;
}

interface DisasterGoogleMapProps {
  layers: MapLayerState;
  onSelectFeature?: (feature: any) => void;
  className?: string;
}

// Map Tile Providers
const TILE_LAYERS = {
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Esri, Maxar, Earthstar Geographics',
    maxZoom: 19,
  },
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    maxZoom: 19,
  },
  osm: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19,
  },
};

export const DisasterGoogleMap: React.FC<DisasterGoogleMapProps> = ({
  layers,
  className = 'w-full h-full min-h-[400px]',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const layersGroupRef = useRef<L.LayerGroup | null>(null);
  const droneMarkerRef = useRef<L.Marker | null>(null);
  const searchMarkerRef = useRef<L.Marker | null>(null);

  const [activeTile, setActiveTile] = useState<'satellite' | 'dark' | 'osm'>('satellite');
  const [currentTelemetry, setCurrentTelemetry] = useState<any>({
    lat: 28.6139,
    lng: 77.2090,
    altitude: 120,
    speed: 45,
    battery: 84,
  });

  // Default coordinate center (Sector 12 Riverbank Basin)
  const defaultCenter: [number, number] = [28.6139, 77.2090];

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Initialize Leaflet Map
    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: 14,
      zoomControl: false,
      attributionControl: false,
    });

    // Add Zoom Control at bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Add Initial Tile Layer
    const tileConfig = TILE_LAYERS[activeTile];
    const tile = L.tileLayer(tileConfig.url, {
      maxZoom: tileConfig.maxZoom,
      attribution: tileConfig.attribution,
    }).addTo(map);

    tileLayerRef.current = tile;

    // Initialize Layer Group for dynamic features
    const layerGroup = L.layerGroup().addTo(map);
    layersGroupRef.current = layerGroup;
    mapInstanceRef.current = map;

    // Ensure map tiles resize correctly after mounting
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer when user toggles Satellite / Dark / Street
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const tileConfig = TILE_LAYERS[activeTile];
    const newTile = L.tileLayer(tileConfig.url, {
      maxZoom: tileConfig.maxZoom,
      attribution: tileConfig.attribution,
    }).addTo(map);

    tileLayerRef.current = newTile;
  }, [activeTile]);

  // Update Dynamic Layers, Polygons, and Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !layersGroupRef.current) return;
    const group = layersGroupRef.current;
    group.clearLayers();

    // 1. Flood Inundation Polygons (Water Levels)
    if (layers.waterLevels) {
      const floodZone1Coords: [number, number][] = [
        [28.6190, 77.2020],
        [28.6230, 77.2100],
        [28.6200, 77.2190],
        [28.6120, 77.2150],
        [28.6100, 77.2040],
      ];

      const floodPoly1 = L.polygon(floodZone1Coords, {
        color: '#dc2626',
        weight: 2,
        fillColor: '#ef4444',
        fillOpacity: 0.38,
      }).bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px; color: #1e293b;">
          <h4 style="margin: 0 0 4px; font-weight: bold; color: #dc2626; font-size: 13px;">🌊 Sector 12 High Inundation Zone</h4>
          <p style="margin: 2px 0;"><strong>Peak Depth:</strong> 3.2m (Surging)</p>
          <p style="margin: 2px 0;"><strong>Risk Level:</strong> Critical Rise</p>
          <p style="margin: 2px 0;"><strong>Spread Velocity:</strong> 1.8 m/s South-East</p>
        </div>
      `);
      group.addLayer(floodPoly1);

      const floodZone2Coords: [number, number][] = [
        [28.6120, 77.2080],
        [28.6070, 77.2160],
        [28.6040, 77.2210],
        [28.6000, 77.2110],
      ];

      const floodPoly2 = L.polygon(floodZone2Coords, {
        color: '#f59e0b',
        weight: 2,
        fillColor: '#3b82f6',
        fillOpacity: 0.32,
      }).bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px; color: #1e293b;">
          <h4 style="margin: 0 0 4px; font-weight: bold; color: #0284c7; font-size: 13px;">💧 Lowland Catchment Basin</h4>
          <p style="margin: 2px 0;"><strong>Depth:</strong> 1.4m</p>
          <p style="margin: 2px 0;"><strong>Status:</strong> Elevated</p>
        </div>
      `);
      group.addLayer(floodPoly2);
    }

    // 2. Affected Settlements Markers
    if (layers.settlements) {
      const settlements = [
        { id: 'SET-01', name: 'Sector 12 Village', lat: 28.6165, lng: 77.2090, status: 'Flood Affected (1.4m Depth)', pop: 620, color: '#dc2626' },
        { id: 'SET-02', name: 'Riverside Colony', lat: 28.6110, lng: 77.2135, status: 'Partially Submerged (1.8m Depth)', pop: 450, color: '#b91c1c' },
        { id: 'SET-03', name: 'East Hamlet', lat: 28.6075, lng: 77.2185, status: 'Flood Affected (0.9m Depth)', pop: 280, color: '#dc2626' },
      ];

      settlements.forEach((s) => {
        const customIcon = L.divIcon({
          className: 'custom-settlement-icon',
          html: `
            <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer; transform: translate(-50%, -50%);">
              <div style="width: 14px; height: 14px; border-radius: 50%; background: ${s.color}; border: 2.5px solid #ffffff; box-shadow: 0 2px 6px rgba(0,0,0,0.5);"></div>
              <div style="background: #1e293b; color: #ffffff; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px; white-space: nowrap; margin-top: 3px; box-shadow: 0 2px 4px rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.3);">
                ${s.name}
              </div>
            </div>
          `,
          iconSize: [100, 30],
        });

        const marker = L.marker([s.lat, s.lng], { icon: customIcon }).bindPopup(`
          <div style="font-family: sans-serif; font-size: 12px; color: #0f172a; line-height: 1.4;">
            <h4 style="margin: 0 0 4px; font-weight: bold; color: #dc2626; font-size: 13px;">🚩 ${s.name}</h4>
            <p style="margin: 2px 0;"><strong>Status:</strong> ${s.status}</p>
            <p style="margin: 2px 0;"><strong>Population:</strong> ${s.pop} residents</p>
            <p style="margin: 2px 0; color: #0284c7; font-weight: bold;">Priority: Immediate Evacuation</p>
          </div>
        `);
        group.addLayer(marker);
      });
    }

    // 3. Infrastructure Assets
    if (layers.infrastructure) {
      const facilities = [
        { id: 'B-02', name: 'Bridge B-02', lat: 28.6145, lng: 77.2050, type: 'Bridge', status: 'Risk (Flow shear 12k m³/s)', bg: '#f59e0b', text: '#ffffff' },
        { id: 'H-01', name: 'Hospital H-01', lat: 28.6215, lng: 77.2210, type: 'Hospital', status: 'Fully Accessible / 120 Beds', bg: '#15803d', text: '#ffffff' },
        { id: 'PS-01', name: 'Substation Sub-04', lat: 28.6070, lng: 77.2015, type: 'Power Station', status: 'Risk (Sandbag cordon active)', bg: '#d97706', text: '#ffffff' },
      ];

      facilities.forEach((f) => {
        const customIcon = L.divIcon({
          className: 'custom-infra-icon',
          html: `
            <div style="background: ${f.bg}; color: ${f.text}; font-size: 10px; font-weight: bold; padding: 3px 7px; border-radius: 6px; white-space: nowrap; box-shadow: 0 2px 6px rgba(0,0,0,0.4); border: 1.5px solid #ffffff; display: flex; align-items: center; gap: 3px; transform: translate(-50%, -50%);">
              <span>🏢</span> ${f.name}
            </div>
          `,
          iconSize: [110, 26],
        });

        const marker = L.marker([f.lat, f.lng], { icon: customIcon }).bindPopup(`
          <div style="font-family: sans-serif; font-size: 12px; color: #0f172a; line-height: 1.4;">
            <h4 style="margin: 0 0 4px; font-weight: bold; font-size: 13px;">🏢 ${f.name}</h4>
            <p style="margin: 2px 0;"><strong>Type:</strong> ${f.type}</p>
            <p style="margin: 2px 0;"><strong>Condition:</strong> ${f.status}</p>
          </div>
        `);
        group.addLayer(marker);
      });
    }

    // 4. Roads Status (Blocked vs Open)
    if (layers.roadStatus) {
      // Highway 4 Overpass (Blocked - Red)
      const highway4Coords: [number, number][] = [
        [28.6240, 77.2005],
        [28.6180, 77.2060],
        [28.6140, 77.2090],
      ];
      const blockedRoad = L.polyline(highway4Coords, {
        color: '#ef4444',
        weight: 5,
        opacity: 0.9,
        dashArray: '8, 8',
      }).bindPopup('<b>Highway 4 Overpass</b><br/><span style="color:#ef4444;font-weight:bold;">BLOCKED (1.2m Water Surge)</span>');
      group.addLayer(blockedRoad);

      // Main Street Crossing (Submerged - Orange)
      const mainStCoords: [number, number][] = [
        [28.6150, 77.2090],
        [28.6110, 77.2105],
        [28.6080, 77.2130],
      ];
      const submergedRoad = L.polyline(mainStCoords, {
        color: '#f59e0b',
        weight: 4,
        opacity: 0.9,
      }).bindPopup('<b>Main Street & Sector 12 Junction</b><br/><span style="color:#d97706;font-weight:bold;">SUBMERGED (0.85m Depth)</span>');
      group.addLayer(submergedRoad);
    }

    // 5. Safe Evacuation Routes (Green)
    if (layers.safeRoutes) {
      const safeRouteCoords: [number, number][] = [
        [28.6155, 77.2150],
        [28.6205, 77.2185],
        [28.6260, 77.2260],
      ];
      const safeLine = L.polyline(safeRouteCoords, {
        color: '#10b981',
        weight: 5,
        opacity: 0.95,
      }).bindPopup('<b>North Ring Corridor</b><br/><span style="color:#059669;font-weight:bold;">OPEN PRIMARY SAFE EVACUATION ROUTE</span>');
      group.addLayer(safeLine);
    }

    // 6. Active Drone Telemetry Live Marker
    if (layers.activeAssets) {
      const droneIcon = L.divIcon({
        className: 'custom-drone-icon',
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -50%);">
            <div style="background: #0284c7; color: #ffffff; font-size: 10px; font-weight: bold; padding: 2px 7px; border-radius: 999px; white-space: nowrap; box-shadow: 0 2px 6px rgba(0,0,0,0.5); border: 1.5px solid #ffffff; margin-bottom: 3px;">
              🛸 DRONE-001 (${currentTelemetry.battery}%)
            </div>
            <div style="width: 28px; height: 28px; border-radius: 50%; background: rgba(2,132,199,0.25); border: 2px solid #0284c7; display: flex; align-items: center; justify-content: center; animation: pulse 2s infinite;">
              <div style="width: 10px; height: 10px; border-radius: 50%; background: #0284c7;"></div>
            </div>
          </div>
        `,
        iconSize: [120, 50],
      });

      const droneMarker = L.marker([currentTelemetry.lat, currentTelemetry.lng], { icon: droneIcon }).bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px; color: #0369a1; line-height: 1.4;">
          <h4 style="margin: 0 0 4px; font-weight: bold; font-size: 14px;">🛸 DRONE-001 (Live Flight Patrol)</h4>
          <p style="margin: 2px 0;"><strong>Altitude:</strong> ${currentTelemetry.altitude}m AGL</p>
          <p style="margin: 2px 0;"><strong>Ground Speed:</strong> ${currentTelemetry.speed} km/h</p>
          <p style="margin: 2px 0;"><strong>Battery:</strong> ${currentTelemetry.battery}%</p>
          <p style="margin: 2px 0;"><strong>Flight Mode:</strong> Autonomous Disaster Reconnaissance</p>
        </div>
      `);

      group.addLayer(droneMarker);
      droneMarkerRef.current = droneMarker;
    }
  }, [layers, activeTile, currentTelemetry]);

  // Live WebSocket updates for Drone Telemetry
  useEffect(() => {
    const socket = getSocket();
    const handleTelemetry = (telemetry: any) => {
      if (telemetry.coordinates) {
        const lat = telemetry.coordinates.lat || 28.6139;
        const lng = telemetry.coordinates.lng || 77.2090;

        setCurrentTelemetry({
          lat,
          lng,
          altitude: telemetry.altitude || 120,
          speed: telemetry.speed || 45,
          battery: telemetry.battery || 84,
        });

        if (droneMarkerRef.current) {
          droneMarkerRef.current.setLatLng([lat, lng]);
        }
      }
    };

    socket.on('telemetry:update', handleTelemetry);
    return () => {
      socket.off('telemetry:update', handleTelemetry);
    };
  }, []);

  // Listen for search navigation events (coordinates, landmarks, settlements)
  useEffect(() => {
    const handleFlyTo = (e: any) => {
      if (!mapInstanceRef.current || !layersGroupRef.current) return;
      const map = mapInstanceRef.current;
      const group = layersGroupRef.current;
      const { lat, lng, zoom = 16, label = 'Searched Location', category = 'Search Location' } = e.detail || {};

      if (lat && lng) {
        map.flyTo([lat, lng], zoom, { duration: 1.5 });

        // Remove previous search pin if any
        if (searchMarkerRef.current) {
          group.removeLayer(searchMarkerRef.current);
        }

        const searchIcon = L.divIcon({
          className: 'custom-search-pin',
          html: `
            <div style="display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -50%);">
              <div style="background: #f59e0b; color: #000000; font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 999px; white-space: nowrap; box-shadow: 0 2px 8px rgba(0,0,0,0.6); border: 2px solid #ffffff; margin-bottom: 2px;">
                📍 ${label}
              </div>
              <div style="width: 32px; height: 32px; border-radius: 50%; background: rgba(245, 158, 11, 0.35); border: 2.5px solid #f59e0b; display: flex; align-items: center; justify-content: center;">
                <div style="width: 12px; height: 12px; border-radius: 50%; background: #f59e0b;"></div>
              </div>
            </div>
          `,
          iconSize: [140, 60],
        });

        const newMarker = L.marker([lat, lng], { icon: searchIcon }).bindPopup(`
          <div style="font-family: sans-serif; font-size: 12px; color: #1e293b; min-width: 160px;">
            <h4 style="margin: 0 0 4px; font-weight: bold; color: #d97706; font-size: 13px;">📍 ${label}</h4>
            <p style="margin: 2px 0;"><strong>Category:</strong> ${category}</p>
            <p style="margin: 2px 0; font-family: monospace; font-size: 11px;"><strong>Coordinates:</strong> ${Number(lat).toFixed(4)}, ${Number(lng).toFixed(4)}</p>
          </div>
        `);

        group.addLayer(newMarker);
        searchMarkerRef.current = newMarker;
        setTimeout(() => newMarker.openPopup(), 1200);
      }
    };

    window.addEventListener('map:flyto', handleFlyTo);
    return () => {
      window.removeEventListener('map:flyto', handleFlyTo);
    };
  }, []);

  return (
    <div className={`relative ${className} bg-[#0b1329] overflow-hidden`}>
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[380px] z-0" />

      {/* Map Mode Switcher (Satellite / Tactical Dark / Street) */}
      <div className="absolute top-3 right-3 z-[1000] flex bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-lg p-1 shadow-lg gap-1">
        <button
          onClick={() => setActiveTile('satellite')}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
            activeTile === 'satellite'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          🛰️ Satellite HD
        </button>
        <button
          onClick={() => setActiveTile('dark')}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
            activeTile === 'dark'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          🌌 Tactical Dark
        </button>
        <button
          onClick={() => setActiveTile('osm')}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
            activeTile === 'osm'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          🗺️ Street Map
        </button>
      </div>

      {/* Interactive Legend / Live Telemetry HUD */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-lg p-2.5 shadow-lg text-xs font-mono flex items-center gap-3">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
        <div>
          <span className="font-bold text-white block">LIVE GIS MESH · SECTOR 12</span>
          <span className="text-slate-400 text-[11px]">
            Drone: {currentTelemetry.lat.toFixed(4)}, {currentTelemetry.lng.toFixed(4)} · Alt: {currentTelemetry.altitude}m
          </span>
        </div>
      </div>
    </div>
  );
};
