export interface Settlement {
  id: string;
  name: string;
  location: string;
  status: 'Flood Affected' | 'Partially Submerged' | 'Safe' | 'Inaccessible';
  population: number;
  coordinates: { top: string; left: string };
}

export interface InfrastructureItem {
  id: string;
  name: string;
  type: 'Bridge' | 'Hospital' | 'Government Building' | 'Power Station' | 'Clinic';
  location: string;
  status: 'Safe' | 'Accessible' | 'Flood Affected' | 'Risk Detected' | 'Inaccessible';
  detail: string;
  coordinates: { top: string; left: string };
}

export interface RoadAccessibilityData {
  overallPercentage: number;
  openRoads: number;
  partiallyAffected: number;
  submergedRoads: number;
  blockedRoads: number;
  inaccessibleRoads: number;
  routes: Array<{
    id: string;
    name: string;
    status: 'Open' | 'Partially Affected' | 'Submerged' | 'Blocked' | 'Inaccessible';
    condition: string;
  }>;
}

export interface WaterSpreadData {
  coveragePercentage: number;
  trend: 'Increasing' | 'Decreasing' | 'Stable';
  direction: string;
  changeSincePreviousSurvey: string;
  peakHeight: string;
  flowVelocity: string;
}

export interface ProgressionStep {
  time: string;
  waterCoverage: number;
  spreadTrend: string;
  spreadDirection: string;
  changeRate: string;
  affectedSettlements: number;
  roadAccessibility: number;
  openRoads: number;
  submergedRoads: number;
}

export const settlementsData: Settlement[] = [
  {
    id: 'SET-01',
    name: 'Sector 12 Village',
    location: 'Sector 12 North',
    status: 'Flood Affected',
    population: 620,
    coordinates: { top: '34%', left: '46%' },
  },
  {
    id: 'SET-02',
    name: 'Riverside Colony',
    location: 'Sector 12 South',
    status: 'Partially Submerged',
    population: 450,
    coordinates: { top: '56%', left: '50%' },
  },
  {
    id: 'SET-03',
    name: 'East Hamlet',
    location: 'East Levee Approach',
    status: 'Flood Affected',
    population: 280,
    coordinates: { top: '42%', left: '68%' },
  },
  {
    id: 'SET-04',
    name: 'Old Market Settlement',
    location: 'Central Sector 12',
    status: 'Partially Submerged',
    population: 510,
    coordinates: { top: '48%', left: '38%' },
  },
  {
    id: 'SET-05',
    name: 'Greenfields Basti',
    location: 'West Lowlands',
    status: 'Flood Affected',
    population: 340,
    coordinates: { top: '65%', left: '32%' },
  },
];

export const infrastructureData: InfrastructureItem[] = [
  {
    id: 'B-02',
    name: 'Bridge B-02',
    type: 'Bridge',
    location: 'Sector 12 River Crossing',
    status: 'Risk Detected',
    detail: 'Structural Risk Detected · Flow Shear 12k m³/s',
    coordinates: { top: '40%', left: '45%' },
  },
  {
    id: 'H-01',
    name: 'Hospital H-01',
    type: 'Hospital',
    location: 'Sector 12 East Medical Corridor',
    status: 'Accessible',
    detail: 'Fully Accessible · Backup Power Operational',
    coordinates: { top: '30%', left: '72%' },
  },
  {
    id: 'G-03',
    name: 'Government Building G-03',
    type: 'Government Building',
    location: 'Civic Administrative Center',
    status: 'Flood Affected',
    detail: 'Ground Floor Water Ingress (0.4m)',
    coordinates: { top: '52%', left: '42%' },
  },
  {
    id: 'PS-01',
    name: 'Substation Sub-04',
    type: 'Power Station',
    location: 'Sector 14 Grid',
    status: 'Risk Detected',
    detail: 'Telemetry offline · Levee protection deployed',
    coordinates: { top: '62%', left: '60%' },
  },
];

export const roadAccessibilityData: RoadAccessibilityData = {
  overallPercentage: 62,
  openRoads: 12,
  partiallyAffected: 4,
  submergedRoads: 3,
  blockedRoads: 2,
  inaccessibleRoads: 1,
  routes: [
    { id: 'R-01', name: 'Highway 4', status: 'Blocked', condition: 'Blocked by major landslide & debris' },
    { id: 'R-02', name: 'Bridge Rd', status: 'Blocked', condition: 'Structural safety cordon active' },
    { id: 'R-03', name: 'Main St. Intersection', status: 'Submerged', condition: 'Water depth >0.8m' },
    { id: 'R-04', name: 'River Access Way', status: 'Submerged', condition: 'Water depth >1.1m' },
    { id: 'R-05', name: 'Sector 14 Arterial', status: 'Partially Affected', condition: 'Single lane passable with high clearance' },
    { id: 'R-06', name: 'North Ring Corridor', status: 'Open', condition: 'Designated primary safe evacuation route' },
  ],
};

export const waterSpreadData: WaterSpreadData = {
  coveragePercentage: 68,
  trend: 'Increasing',
  direction: 'South-East',
  changeSincePreviousSurvey: '+13%',
  peakHeight: '3.2m',
  flowVelocity: '1.8 m/s',
};

export const progressionTimeline: ProgressionStep[] = [
  {
    time: '10:00 AM',
    waterCoverage: 42,
    spreadTrend: 'Stable',
    spreadDirection: 'South-East',
    changeRate: '+4%',
    affectedSettlements: 2,
    roadAccessibility: 78,
    openRoads: 16,
    submergedRoads: 1,
  },
  {
    time: '12:00 PM',
    waterCoverage: 55,
    spreadTrend: 'Increasing',
    spreadDirection: 'South-East',
    changeRate: '+8%',
    affectedSettlements: 3,
    roadAccessibility: 70,
    openRoads: 14,
    submergedRoads: 2,
  },
  {
    time: '02:00 PM',
    waterCoverage: 68,
    spreadTrend: 'Increasing',
    spreadDirection: 'South-East',
    changeRate: '+13%',
    affectedSettlements: 5,
    roadAccessibility: 62,
    openRoads: 12,
    submergedRoads: 3,
  },
  {
    time: '04:00 PM (Forecast)',
    waterCoverage: 74,
    spreadTrend: 'Increasing',
    spreadDirection: 'South-East',
    changeRate: '+6%',
    affectedSettlements: 6,
    roadAccessibility: 54,
    openRoads: 10,
    submergedRoads: 5,
  },
];
