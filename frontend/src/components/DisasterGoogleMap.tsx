import React, { useEffect, useRef, useState } from 'react';
import { GOOGLE_MAPS_API_KEY } from '../api/config';
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

// Tactical Dark/Slate Map Style
const disasterMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#1d2c4d' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1a3646' }] },
  { featureType: 'administrative.country', elementType: 'geometry.stroke', stylers: [{ color: '#4b6878' }] },
  { featureType: 'administrative.land_parcel', elementType: 'labels.text.fill', stylers: [{ color: '#64779e' }] },
  { featureType: 'administrative.province', elementType: 'geometry.stroke', stylers: [{ color: '#4b6878' }] },
  { featureType: 'landscape.man_made', elementType: 'geometry.stroke', stylers: [{ color: '#334e68' }] },
  { featureType: 'landscape.natural', elementType: 'geometry', stylers: [{ color: '#021019' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#283d6a' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#6f9ba5' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#304a7d' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#98a5be' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#2c6693' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#25577e' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e1626' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#4e6d97' }] },
];

export const DisasterGoogleMap: React.FC<DisasterGoogleMapProps> = ({
  layers,
  className = 'w-full h-full min-h-[500px]',
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid'>('hybrid');
  const googleMapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const polygonsRef = useRef<any[]>([]);
  const polylinesRef = useRef<any[]>([]);
  const droneMarkerRef = useRef<any>(null);

  // Default coordinate center (Sector 12 / Yamuna River Basin area)
  const defaultCenter = { lat: 28.6139, lng: 77.2090 };

  useEffect(() => {
    // Check if Google Maps script is already loaded
    if ((window as any).google && (window as any).google.maps) {
      initMap();
      return;
    }

    const existingScript = document.getElementById('google-maps-script');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=geometry,places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        initMap();
      };
      script.onerror = () => {
        console.warn('Google Maps JS SDK failed to load. Using tactical GIS fallback canvas.');
        setMapError(true);
      };
      document.head.appendChild(script);
    } else {
      existingScript.addEventListener('load', () => initMap());
    }

    function initMap() {
      if (!mapRef.current || !(window as any).google) return;
      try {
        const google = (window as any).google;
        const map = new google.maps.Map(mapRef.current, {
          center: defaultCenter,
          zoom: 14,
          mapTypeId: mapType,
          styles: mapType === 'roadmap' ? disasterMapStyle : undefined,
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        });

        googleMapInstance.current = map;
        setMapLoaded(true);
      } catch (err) {
        console.error('Error initializing Google Map:', err);
        setMapError(true);
      }
    }
  }, []);

  // Update map type
  useEffect(() => {
    if (googleMapInstance.current) {
      googleMapInstance.current.setMapTypeId(mapType);
      if (mapType === 'roadmap') {
        googleMapInstance.current.setOptions({ styles: disasterMapStyle });
      } else {
        googleMapInstance.current.setOptions({ styles: null });
      }
    }
  }, [mapType]);

  // Update Layers & Markers on the Map
  useEffect(() => {
    if (!mapLoaded || !googleMapInstance.current || !(window as any).google) return;
    const google = (window as any).google;
    const map = googleMapInstance.current;

    // Clear previous elements
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];
    polygonsRef.current.forEach((p) => p.setMap(null));
    polygonsRef.current = [];
    polylinesRef.current.forEach((l) => l.setMap(null));
    polylinesRef.current = [];

    const infoWindow = new google.maps.InfoWindow();

    // 1. Water Levels / Flood Inundation Polygons
    if (layers.waterLevels) {
      const floodZoneCoords1 = [
        { lat: 28.6180, lng: 77.2030 },
        { lat: 28.6220, lng: 77.2100 },
        { lat: 28.6190, lng: 77.2180 },
        { lat: 28.6120, lng: 77.2140 },
        { lat: 28.6110, lng: 77.2050 },
      ];

      const floodPolygon1 = new google.maps.Polygon({
        paths: floodZoneCoords1,
        strokeColor: '#dc2626',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#ef4444',
        fillOpacity: 0.35,
      });
      floodPolygon1.setMap(map);
      polygonsRef.current.push(floodPolygon1);

      const floodZoneCoords2 = [
        { lat: 28.6120, lng: 77.2080 },
        { lat: 28.6080, lng: 77.2150 },
        { lat: 28.6050, lng: 77.2200 },
        { lat: 28.6010, lng: 77.2120 },
      ];

      const floodPolygon2 = new google.maps.Polygon({
        paths: floodZoneCoords2,
        strokeColor: '#f59e0b',
        strokeOpacity: 0.7,
        strokeWeight: 2,
        fillColor: '#3b82f6',
        fillOpacity: 0.3,
      });
      floodPolygon2.setMap(map);
      polygonsRef.current.push(floodPolygon2);
    }

    // 2. Affected Settlements Markers
    if (layers.settlements) {
      const settlements = [
        { id: 'SET-01', name: 'Sector 12 Village', lat: 28.6160, lng: 77.2090, status: 'Flood Affected (1.4m Depth)', pop: 620, color: '#dc2626' },
        { id: 'SET-02', name: 'Riverside Colony', lat: 28.6110, lng: 77.2120, status: 'Partially Submerged (1.8m Depth)', pop: 450, color: '#b91c1c' },
        { id: 'SET-03', name: 'East Hamlet', lat: 28.6080, lng: 77.2180, status: 'Flood Affected (0.9m Depth)', pop: 280, color: '#dc2626' },
      ];

      settlements.forEach((s) => {
        const marker = new google.maps.Marker({
          position: { lat: s.lat, lng: s.lng },
          map,
          title: s.name,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 9,
            fillColor: s.color,
            fillOpacity: 0.9,
            strokeWeight: 2,
            strokeColor: '#ffffff',
          },
        });

        marker.addListener('click', () => {
          infoWindow.setContent(`
            <div style="padding: 8px; color: #1e293b; font-family: sans-serif; font-size: 12px; line-height: 1.4;">
              <h4 style="margin: 0 0 4px; font-weight: bold; font-size: 14px; color: #dc2626;">🚩 ${s.name}</h4>
              <p style="margin: 2px 0;"><strong>Status:</strong> ${s.status}</p>
              <p style="margin: 2px 0;"><strong>Population:</strong> ${s.pop} residents</p>
              <p style="margin: 2px 0; color: #0284c7;"><strong>Evacuation Priority:</strong> Immediate</p>
            </div>
          `);
          infoWindow.open(map, marker);
        });

        markersRef.current.push(marker);
      });
    }

    // 3. Infrastructure Assets
    if (layers.infrastructure) {
      const facilities = [
        { id: 'B-02', name: 'Bridge B-02', lat: 28.6145, lng: 77.2060, type: 'Bridge', status: 'Risk Detected (Flow shear 12k m³/s)', color: '#d97706' },
        { id: 'H-01', name: 'Hospital H-01 Regional', lat: 28.6210, lng: 77.2200, type: 'Hospital', status: 'Accessible / Fully Operational', color: '#15803d' },
        { id: 'PS-01', name: 'Substation Sub-04 Grid', lat: 28.6070, lng: 77.2020, type: 'Power Station', status: 'Risk (0.5m Perimeter Water)', color: '#d97706' },
      ];

      facilities.forEach((f) => {
        const marker = new google.maps.Marker({
          position: { lat: f.lat, lng: f.lng },
          map,
          title: f.name,
          icon: {
            path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
            scale: 6,
            fillColor: f.color,
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: '#ffffff',
          },
        });

        marker.addListener('click', () => {
          infoWindow.setContent(`
            <div style="padding: 8px; color: #1e293b; font-family: sans-serif; font-size: 12px; line-height: 1.4;">
              <h4 style="margin: 0 0 4px; font-weight: bold; font-size: 13px; color: #0f172a;">🏢 ${f.name}</h4>
              <p style="margin: 2px 0;"><strong>Type:</strong> ${f.type}</p>
              <p style="margin: 2px 0;"><strong>Condition:</strong> ${f.status}</p>
            </div>
          `);
          infoWindow.open(map, marker);
        });

        markersRef.current.push(marker);
      });
    }

    // 4. Roads Status (Polylines)
    if (layers.roadStatus) {
      // Blocked Highway 4 (Red)
      const highway4Coords = [
        { lat: 28.6230, lng: 77.2010 },
        { lat: 28.6180, lng: 77.2060 },
        { lat: 28.6140, lng: 77.2090 },
      ];
      const blockedRoad = new google.maps.Polyline({
        path: highway4Coords,
        geodesic: true,
        strokeColor: '#ef4444',
        strokeOpacity: 0.9,
        strokeWeight: 5,
      });
      blockedRoad.setMap(map);
      polylinesRef.current.push(blockedRoad);
    }

    // 5. Safe Evacuation Routes (Green Polyline)
    if (layers.safeRoutes) {
      const safeRouteCoords = [
        { lat: 28.6150, lng: 77.2150 },
        { lat: 28.6200, lng: 77.2180 },
        { lat: 28.6250, lng: 77.2250 },
      ];
      const safeLine = new google.maps.Polyline({
        path: safeRouteCoords,
        geodesic: true,
        strokeColor: '#10b981',
        strokeOpacity: 0.95,
        strokeWeight: 5,
      });
      safeLine.setMap(map);
      polylinesRef.current.push(safeLine);
    }

    // 6. Active Drone Telemetry Pin
    if (layers.activeAssets) {
      const dronePos = { lat: 28.6139, lng: 77.2090 };
      const droneMarker = new google.maps.Marker({
        position: dronePos,
        map,
        title: 'DRONE-001 (Active Reconnaissance)',
        icon: {
          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: 7,
          fillColor: '#0284c7',
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: '#ffffff',
          rotation: 45,
        },
      });

      droneMarker.addListener('click', () => {
        infoWindow.setContent(`
          <div style="padding: 8px; color: #0369a1; font-family: sans-serif; font-size: 12px;">
            <h4 style="margin: 0 0 4px; font-weight: bold; font-size: 14px;">🛸 DRONE-001</h4>
            <p style="margin: 2px 0;"><strong>Altitude:</strong> 120m AGL</p>
            <p style="margin: 2px 0;"><strong>Speed:</strong> 45 km/h</p>
            <p style="margin: 2px 0;"><strong>Flight Mode:</strong> Autonomous Reconnaissance</p>
          </div>
        `);
        infoWindow.open(map, droneMarker);
      });

      droneMarkerRef.current = droneMarker;
      markersRef.current.push(droneMarker);
    }
  }, [mapLoaded, layers]);

  // Live WebSocket updates for Drone Marker position
  useEffect(() => {
    const socket = getSocket();
    const handleTelemetry = (telemetry: any) => {
      if (droneMarkerRef.current && telemetry.coordinates) {
        const google = (window as any).google;
        if (google && google.maps) {
          const newPos = new google.maps.LatLng(
            telemetry.coordinates.lat || 28.6139,
            telemetry.coordinates.lng || 77.2090
          );
          droneMarkerRef.current.setPosition(newPos);
        }
      }
    };

    socket.on('telemetry:update', handleTelemetry);
    return () => {
      socket.off('telemetry:update', handleTelemetry);
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      {/* Google Maps Container */}
      <div ref={mapRef} className="w-full h-full rounded-xl overflow-hidden shadow-sm" />

      {/* Fallback Tactical Canvas if offline or without internet */}
      {mapError && (
        <div
          className="w-full h-full bg-cover bg-center absolute inset-0 rounded-xl overflow-hidden"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDHUHvTauXo11PCYMgAxhVjsv8KX3CJ5ULE8I21bP8zvnBzbg2VoCYmtdcYFE13HdSBZGFpZZcmSkh2-QELLretfBtt5chwktUPXkd7m3YGYCGiqSEj3R6MiDMy6b77vqI0pFPUKnL9C4GsS5GetoLqAQPB_mAzXLo-Y4I-V0_xZ451Ezr7NVUW156dSFl9qtCcppZLZTGudciGkmg_i1yDEu5-RBdsmQlwTX1ZgCHBXtiAzIHAaR2j')`,
          }}
        >
          <div className="absolute top-4 left-4 bg-surface/90 backdrop-blur-xs border border-outline-variant p-2 rounded-lg text-xs font-mono text-on-surface">
            Tactical GIS Satellite Mesh Mode
          </div>
        </div>
      )}

      {/* Map Style Switcher (Roadmap / Satellite / Hybrid) */}
      <div className="absolute top-4 right-4 z-10 flex bg-surface-container-lowest/90 backdrop-blur-xs border border-outline-variant rounded-lg p-1 shadow-sm gap-1">
        <button
          onClick={() => setMapType('hybrid')}
          className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
            mapType === 'hybrid' ? 'bg-primary text-white' : 'text-on-surface hover:bg-surface-container'
          }`}
        >
          Hybrid
        </button>
        <button
          onClick={() => setMapType('satellite')}
          className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
            mapType === 'satellite' ? 'bg-primary text-white' : 'text-on-surface hover:bg-surface-container'
          }`}
        >
          Satellite
        </button>
        <button
          onClick={() => setMapType('roadmap')}
          className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
            mapType === 'roadmap' ? 'bg-primary text-white' : 'text-on-surface hover:bg-surface-container'
          }`}
        >
          Tactical
        </button>
      </div>

      {/* Live Drone HUD Overlay */}
      <div className="absolute bottom-4 left-4 z-10 bg-surface-container-lowest/90 backdrop-blur-xs border border-outline-variant rounded-lg p-3 shadow-md text-xs font-mono flex items-center gap-3">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
        <div>
          <span className="font-bold text-on-surface block">LIVE GIS MESH · SECTOR 12</span>
          <span className="text-on-surface-variant text-[11px]">Yamuna Basin Drainage Vector</span>
        </div>
      </div>
    </div>
  );
};
