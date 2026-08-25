import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

interface TopbarProps {
  onToggleMobile?: () => void;
}

interface SearchLocation {
  name: string;
  category: string;
  lat: number;
  lng: number;
  keywords: string;
}

const KNOWN_LOCATIONS: SearchLocation[] = [
  { name: 'Sector 12 (Command Hub)', category: 'Disaster Sector', lat: 28.6139, lng: 77.2090, keywords: 'sector 12 flood riverbank hq basin' },
  { name: 'Riverside Colony', category: 'Affected Settlement', lat: 28.6110, lng: 77.2135, keywords: 'riverside colony settlement residential flood 340' },
  { name: 'East Hamlet', category: 'Affected Settlement', lat: 28.6075, lng: 77.2185, keywords: 'east hamlet settlement residential flood 180' },
  { name: 'North District Zone', category: 'Affected Settlement', lat: 28.6220, lng: 77.2050, keywords: 'north district settlement residential' },
  { name: 'Bridge B-02', category: 'Critical Infrastructure', lat: 28.6145, lng: 77.2050, keywords: 'bridge b-02 river crossing risk infrastructure' },
  { name: 'Hospital H-01', category: 'Emergency Facility', lat: 28.6215, lng: 77.2210, keywords: 'hospital h-01 medical emergency safe' },
  { name: 'Substation Sub-04', category: 'Power Infrastructure', lat: 28.6070, lng: 77.2015, keywords: 'substation sub-04 power grid electrical risk' },
  { name: 'Highway 4 (Blocked Road)', category: 'Transport Route', lat: 28.6180, lng: 77.2060, keywords: 'highway 4 road blocked clearance transport' },
  { name: 'Main Street Junction', category: 'Submerged Road', lat: 28.6110, lng: 77.2105, keywords: 'main street junction submerged road intersection' },
  { name: 'Relief Camp Alpha', category: 'Relief Shelter', lat: 28.6240, lng: 77.2100, keywords: 'camp alpha shelter sector 14 relief rations' },
  { name: 'Relief Camp Bravo', category: 'Relief Shelter', lat: 28.6050, lng: 77.2200, keywords: 'camp bravo shelter relief rations' },
  { name: 'DRONE-001 Patrol', category: 'Live Aerial Unit', lat: 28.6141, lng: 77.2095, keywords: 'drone-001 matrice drone telemetry aerial' },
  { name: 'NDRF Team Alpha', category: 'Rescue Squad', lat: 28.6180, lng: 77.2060, keywords: 'ndrf team alpha rescue squad field unit' },
  { name: 'Boat Unit 03', category: 'Swiftwater Boat', lat: 28.6110, lng: 77.2135, keywords: 'boat unit 03 zodiac swiftwater rescue' },
];

const pageTitles: Record<string, { title: string; category?: string }> = {
  '/dashboard': { title: 'Operational Dashboard', category: 'HQ Command' },
  '/water-coverage': { title: 'Water Coverage & Spread', category: 'Hydrology & Inundation' },
  '/affected-settlements': { title: 'Affected Settlements', category: 'Civil Protection' },
  '/road-accessibility': { title: 'Road Accessibility', category: 'Transport & Logistics' },
  '/infrastructure-impact': { title: 'Infrastructure Impact', category: 'Critical Facilities' },
  '/flood-map': { title: 'Flood Map Intelligence', category: 'GIS & Satellite' },
  '/drone-missions': { title: 'Drone Mission Control', category: 'Autonomous Aerial Ops' },
  '/detection-analysis': { title: 'Detection & Analysis Workspace', category: 'Computer Vision AI' },
  '/rescue-coordination': { title: 'Response Planning', category: 'Field Operations' },
  '/relief-camps': { title: 'Relief Camps Oversight', category: 'Logistics & Camp Welfare' },
  '/alerts': { title: 'Emergency Alert Management', category: 'Public Warning System' },
  '/incident-records': { title: 'Incident Records & Logs', category: 'Historical Archive' },
  '/flood-progression': { title: 'Flood Impact Analysis', category: 'Hydrological Modeling' },
  '/flood-report': { title: 'Assessment Report', category: 'Executive Summary' },
};

export const Topbar: React.FC<TopbarProps> = ({ onToggleMobile }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const current = pageTitles[location.pathname] || { title: 'Flood Management', category: 'Authority' };

  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeLocation, setActiveLocation] = useState('Sector 12');
  const [activeCoords, setActiveCoords] = useState('28.614, 77.209');

  // Match suggestions based on query
  const qLower = query.toLowerCase().trim();
  const suggestions = qLower
    ? KNOWN_LOCATIONS.filter(
        (loc) =>
          loc.name.toLowerCase().includes(qLower) ||
          loc.category.toLowerCase().includes(qLower) ||
          loc.keywords.toLowerCase().includes(qLower)
      ).slice(0, 5)
    : [];

  const handleSelectLocation = (loc: { lat: number; lng: number; name: string; category: string }) => {
    setActiveLocation(loc.name);
    setActiveCoords(`${loc.lat.toFixed(3)}, ${loc.lng.toFixed(3)}`);

    // If not on a page with map (dashboard or flood-map), navigate to dashboard
    if (location.pathname !== '/dashboard' && location.pathname !== '/flood-map') {
      navigate('/dashboard');
    }

    // Dispatch flyto event to map
    setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent('map:flyto', {
          detail: {
            lat: loc.lat,
            lng: loc.lng,
            zoom: 16,
            label: loc.name,
            category: loc.category,
          },
        })
      );
    }, 150);

    setQuery('');
    setShowDropdown(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Check if query is direct lat, lng coordinates e.g. "28.6139, 77.2090" or "28.6139 77.2090"
    const coordMatch = query.match(/^([-+]?\d{1,2}(?:\.\d+)?)[,\s]+([-+]?\d{1,3}(?:\.\d+)?)$/);

    if (coordMatch) {
      const lat = parseFloat(coordMatch[1]);
      const lng = parseFloat(coordMatch[2]);

      if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        handleSelectLocation({
          lat,
          lng,
          name: `GPS ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
          category: 'Coordinate Target',
        });
        return;
      }
    }

    // If matches suggestion, take first suggestion
    if (suggestions.length > 0) {
      handleSelectLocation(suggestions[0]);
    } else {
      // Custom named search
      handleSelectLocation({
        lat: 28.6139,
        lng: 77.2090,
        name: query.trim(),
        category: 'Searched Zone',
      });
    }
  };

  return (
    <header className="h-16 px-4 md:px-xl bg-surface border-b border-outline-variant flex items-center justify-between sticky top-0 z-30 shrink-0">
      {/* Left: Mobile Toggle & Page Context */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobile}
          className="md:hidden p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors"
          aria-label="Open navigation"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        <div>
          <h2 className="font-headline-md text-base md:text-lg font-bold text-on-surface truncate">
            {current.title}
          </h2>
        </div>
      </div>

      {/* Center: Live Coordinate & Location Search (Desktop) */}
      <div className="relative hidden lg:block">
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center bg-surface-container-high/80 rounded-full px-md py-1.5 w-80 border border-outline-variant focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all shadow-xs"
        >
          <span className="material-symbols-outlined text-on-surface-variant text-sm mr-2">search</span>
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            placeholder="Search coordinates, sectors, units..."
            className="bg-transparent border-none outline-none w-full text-xs text-on-surface placeholder:text-on-surface-variant"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setShowDropdown(false);
              }}
              className="text-on-surface-variant hover:text-on-surface cursor-pointer text-xs"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
        </form>

        {/* Dropdown Suggestions */}
        {showDropdown && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-outline-variant rounded-xl shadow-xl z-50 overflow-hidden text-xs animate-in fade-in zoom-in-95 duration-100">
            <div className="p-2 border-b border-outline-variant bg-surface-container-low text-[11px] font-bold text-on-surface-variant uppercase tracking-wider flex justify-between items-center">
              <span>Matching Locations ({suggestions.length})</span>
              <span className="text-[10px] lowercase font-normal">Press Enter to pan</span>
            </div>
            <div className="divide-y divide-outline-variant/60 max-h-60 overflow-y-auto">
              {suggestions.map((loc, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectLocation(loc)}
                  className="p-2.5 hover:bg-surface-container transition-colors cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm group-hover:scale-110 transition-transform">
                      location_on
                    </span>
                    <div>
                      <div className="font-semibold text-on-surface group-hover:text-primary transition-colors">
                        {loc.name}
                      </div>
                      <div className="text-[10px] text-on-surface-variant font-mono">
                        {loc.category} · {loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    Locate →
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right: Dynamic Location Badge, Notification, Profile */}
      <div className="flex items-center gap-2 md:gap-4">
        <div className="hidden sm:flex items-center gap-2 bg-surface-container-low px-3 py-1 rounded-full border border-outline-variant text-xs shadow-xs transition-all">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-bold text-primary truncate max-w-[170px]">{activeLocation}</span>
          <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
          <span className="text-on-surface-variant font-mono text-[11px]">{activeCoords}</span>
        </div>

        <Link
          to="/alerts"
          className="relative p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-full transition-colors"
          title="Emergency Alerts"
        >
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full ring-2 ring-surface animate-ping"></span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full"></span>
        </Link>

        {/* Profile Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-outline-variant">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant bg-surface-container-high shrink-0">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhAqj2Ns6QjX39Zy4IzU4OPcLixqXsFox82fNB_7tapSHqdK8KECiHXlmRkaQob3jY0YxEO2n1mob0dedb2U6rewXQS86Caq_spSe1tItV7a1dvQNYWi3zQAcOMzSf6l6zuJmJGPHxrpItSNkgdBgmHFHhQCkRfiHVsXEgPQHF8z0a45Wi_blzNOC89dJ9mRmFPNc6d1WxvbC2wSSIBeXHlgixajywq2RZ9Rq5QfnbTn3sis0kahFZ"
              alt="Authority Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-semibold text-on-surface leading-tight">Cmdr. S. Verma</div>
            <div className="text-[10px] text-on-surface-variant leading-tight">NDRF Sector Ops</div>
          </div>
        </div>
      </div>
    </header>
  );
};
