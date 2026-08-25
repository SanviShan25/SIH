import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding for Sky Guardians Flood Operations...');

  // Clear existing data
  await prisma.floodSnapshot.deleteMany();
  await prisma.inundationZone.deleteMany();
  await prisma.settlement.deleteMany();
  await prisma.roadRoute.deleteMany();
  await prisma.infrastructureAsset.deleteMany();
  await prisma.mission.deleteMany();
  await prisma.detectionFrame.deleteMany();
  await prisma.fieldUnit.deleteMany();
  await prisma.incident.deleteMany();
  await prisma.reliefCamp.deleteMany();
  await prisma.alert.deleteMany();
  await prisma.assessmentReport.deleteMany();

  // 1. Seed Flood Snapshots (Hourly Timeline)
  await prisma.floodSnapshot.createMany({
    data: [
      {
        timeLabel: '10:00 AM',
        waterCoveragePct: 42.0,
        spreadTrend: 'Stable',
        spreadDirection: 'South-East',
        changeRate: '+4%',
        flowVelocity: '1.2 m/s',
        peakHeight: '2.1m',
        affectedSettlementsCount: 2,
        roadAccessibilityPct: 78.0,
        openRoadsCount: 16,
        submergedRoadsCount: 1,
        isForecast: false,
      },
      {
        timeLabel: '12:00 PM',
        waterCoveragePct: 55.0,
        spreadTrend: 'Increasing',
        spreadDirection: 'South-East',
        changeRate: '+8%',
        flowVelocity: '1.5 m/s',
        peakHeight: '2.7m',
        affectedSettlementsCount: 3,
        roadAccessibilityPct: 70.0,
        openRoadsCount: 14,
        submergedRoadsCount: 2,
        isForecast: false,
      },
      {
        timeLabel: '02:00 PM',
        waterCoveragePct: 68.0,
        spreadTrend: 'Increasing',
        spreadDirection: 'South-East',
        changeRate: '+13%',
        flowVelocity: '1.8 m/s',
        peakHeight: '3.2m',
        affectedSettlementsCount: 5,
        roadAccessibilityPct: 62.0,
        openRoadsCount: 12,
        submergedRoadsCount: 3,
        isForecast: false,
      },
      {
        timeLabel: '04:00 PM (Forecast)',
        waterCoveragePct: 74.0,
        spreadTrend: 'Increasing',
        spreadDirection: 'South-East',
        changeRate: '+6%',
        flowVelocity: '2.0 m/s',
        peakHeight: '3.6m',
        affectedSettlementsCount: 6,
        roadAccessibilityPct: 54.0,
        openRoadsCount: 10,
        submergedRoadsCount: 5,
        isForecast: true,
      },
    ],
  });

  // 2. Seed Inundation Catchment Zones
  await prisma.inundationZone.createMany({
    data: [
      {
        id: 'Z-01',
        name: 'Sector 12 Riverbank & Lower Embankment',
        waterDepth: '3.2m',
        coveragePct: 88.0,
        flowDirection: 'South-East (1.8 m/s)',
        status: 'Critical Rise',
        riskLevel: 'High',
        lastSurvey: '14:30 UTC',
      },
      {
        id: 'Z-02',
        name: 'Riverside Agricultural Basin',
        waterDepth: '2.1m',
        coveragePct: 74.0,
        flowDirection: 'South-East (1.4 m/s)',
        status: 'Critical Rise',
        riskLevel: 'High',
        lastSurvey: '14:25 UTC',
      },
      {
        id: 'Z-03',
        name: 'East Lowland Catchment Area',
        waterDepth: '1.4m',
        coveragePct: 62.0,
        flowDirection: 'East (0.9 m/s)',
        status: 'Elevated',
        riskLevel: 'Medium',
        lastSurvey: '14:15 UTC',
      },
      {
        id: 'Z-04',
        name: 'Old Market Central Basin',
        waterDepth: '0.8m',
        coveragePct: 45.0,
        flowDirection: 'South (0.6 m/s)',
        status: 'Elevated',
        riskLevel: 'Medium',
        lastSurvey: '14:10 UTC',
      },
      {
        id: 'Z-05',
        name: 'North-West Ridge Drainage Corridor',
        waterDepth: '0.3m',
        coveragePct: 22.0,
        flowDirection: 'South-East (1.1 m/s)',
        status: 'Stable',
        riskLevel: 'Low',
        lastSurvey: '13:50 UTC',
      },
    ],
  });

  // 3. Seed Affected Settlements
  await prisma.settlement.createMany({
    data: [
      {
        id: 'SET-01',
        name: 'Sector 12 Village',
        location: 'Sector 12 North Riverbank',
        status: 'Flood Affected',
        population: 620,
        households: 140,
        waterDepth: '1.4m',
        evacuationPriority: 'Immediate',
        evacuatedPercentage: 65.0,
        nearestCamp: 'Sector 14 Shelter (1.8 km)',
        coordTop: '34%',
        coordLeft: '46%',
        latitude: 28.6152,
        longitude: 77.2085,
        lastSurvey: '14:30 UTC',
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
        evacuatedPercentage: 80.0,
        nearestCamp: 'Riverside High School (1.2 km)',
        coordTop: '56%',
        coordLeft: '50%',
        latitude: 28.6115,
        longitude: 77.2102,
        lastSurvey: '14:25 UTC',
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
        evacuatedPercentage: 50.0,
        nearestCamp: 'Camp Bravo (3.1 km)',
        coordTop: '42%',
        coordLeft: '68%',
        latitude: 28.6140,
        longitude: 77.2155,
        lastSurvey: '14:15 UTC',
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
        evacuatedPercentage: 40.0,
        nearestCamp: 'Sector 14 Shelter (2.4 km)',
        coordTop: '48%',
        coordLeft: '38%',
        latitude: 28.6128,
        longitude: 77.2045,
        lastSurvey: '14:10 UTC',
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
        evacuatedPercentage: 70.0,
        nearestCamp: 'South Hills Stadium (2.9 km)',
        coordTop: '65%',
        coordLeft: '32%',
        latitude: 28.6095,
        longitude: 77.2020,
        lastSurvey: '13:55 UTC',
      },
    ],
  });

  // 4. Seed Road Routes
  await prisma.roadRoute.createMany({
    data: [
      {
        id: 'R-01',
        name: 'Highway 4 Overpass',
        category: 'Arterial Highway',
        status: 'Blocked',
        waterDepth: '1.2m',
        clearance: 'Impassable',
        condition: 'Heavy debris accumulation & 1.2m standing water surge',
        alternativeRoute: 'Northern Ridge Bypass Corridor',
        lastSurvey: '14:25 UTC',
      },
      {
        id: 'R-02',
        name: 'Bridge Road Crossing',
        category: 'Bridge Crossing',
        status: 'Blocked',
        waterDepth: '1.5m',
        clearance: 'Impassable',
        condition: 'Structural safety cordon active due to high river shear flow',
        alternativeRoute: 'East Levee Causeway',
        lastSurvey: '14:20 UTC',
      },
      {
        id: 'R-03',
        name: 'Main Street & Sector 12 Junction',
        category: 'Secondary Road',
        status: 'Submerged',
        waterDepth: '0.85m',
        clearance: 'Impassable',
        condition: 'Water depth exceeding safe vehicular limit',
        alternativeRoute: 'Market Link Bypass',
        lastSurvey: '14:15 UTC',
      },
      {
        id: 'R-04',
        name: 'River Access Way',
        category: 'Local Street',
        status: 'Submerged',
        waterDepth: '1.1m',
        clearance: 'Impassable',
        condition: 'Direct overflow from levee embankment breach',
        alternativeRoute: 'None (Boat extraction active)',
        lastSurvey: '14:10 UTC',
      },
      {
        id: 'R-05',
        name: 'Sector 14 Arterial Corridor',
        category: 'Arterial Highway',
        status: 'Partially Affected',
        waterDepth: '0.3m',
        clearance: 'High Clearance (>4x4)',
        condition: 'Single lane open with police escort; shoulder inundated',
        alternativeRoute: 'Direct arterial transit',
        lastSurvey: '13:55 UTC',
      },
      {
        id: 'R-06',
        name: 'North Ring Corridor',
        category: 'Evacuation Corridor',
        status: 'Open',
        waterDepth: '0.0m',
        clearance: 'All Vehicles',
        condition: 'Fully dry & clear; designated Primary Safe Evacuation Route',
        alternativeRoute: 'Primary corridor',
        lastSurvey: '14:30 UTC',
      },
    ],
  });

  // 5. Seed Infrastructure Assets
  await prisma.infrastructureAsset.createMany({
    data: [
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
        coordTop: '40%',
        coordLeft: '45%',
        latitude: 28.6148,
        longitude: 77.2080,
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
        coordTop: '30%',
        coordLeft: '72%',
        latitude: 28.6170,
        longitude: 77.2180,
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
        coordTop: '52%',
        coordLeft: '42%',
        latitude: 28.6120,
        longitude: 77.2060,
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
        coordTop: '62%',
        coordLeft: '60%',
        latitude: 28.6100,
        longitude: 77.2120,
        lastInspection: '14:00 UTC',
      },
    ],
  });

  // 6. Seed Mission Telemetry (Stub for Hardware Team)
  await prisma.mission.createMany({
    data: [
      {
        id: 'MISSION-DRONE-001',
        droneId: 'DRONE-001',
        targetArea: 'Sector 12 & Riverbend Embankment',
        status: 'Active',
        batteryPct: 84,
        altitudeM: 120,
        speedKmh: 45,
        latitude: 28.6139,
        longitude: 77.2090,
        signalQuality: 92,
        flightMode: 'AUTONOMOUS RECON',
      },
      {
        id: 'MISSION-DRONE-002',
        droneId: 'DRONE-002',
        targetArea: 'Sector 14 Grid & High School Catchment',
        status: 'Standby',
        batteryPct: 98,
        altitudeM: 0,
        speedKmh: 0,
        latitude: 28.6180,
        longitude: 77.2150,
        signalQuality: 98,
        flightMode: 'READY FOR DISPATCH',
      },
    ],
  });

  // 7. Seed Detection Frames (Stub for ML Team)
  await prisma.detectionFrame.createMany({
    data: [
      {
        missionId: 'MISSION-DRONE-001',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAuWBn-OvaKI4G019GpMSeEw6JfjDjpMZdlgKq4sI9jb9kO9ZzZYpMCI6_b0yKBCNgLU6fPAfq4UPHx5kfw2TOnPHPTZZWO5P07BZlYJtONa8biKbG9YNDETWfxgGUFzflKPK4LLpXVhNJFWCKhJY49SLGJ3uZFn_n0dbyhumLlX8pcAQKASwa0Slj2Tz9aTIhy2f714EspXnFSg6Prjg_dmU26gdwFoETUsk2Nd_Vd-SN75hK3vt4i',
        personsCount: 7,
        vehiclesCount: 2,
        debrisCount: 4,
        confidenceAvg: 0.94,
        modelVersion: 'YOLOv8-Disaster-v4.2',
        detectionsJson: JSON.stringify([
          { class: 'Person', confidence: 0.94, bbox: { top: '30%', left: '45%', width: '48px', height: '68px' } },
          { class: 'Submerged Vehicle', confidence: 0.88, bbox: { top: '55%', left: '20%', width: '120px', height: '70px' } },
          { class: 'Structural Hazard', confidence: 0.91, bbox: { top: '15%', left: '60%', width: '90px', height: '90px' } },
        ]),
      },
    ],
  });

  // 8. Seed Field Units
  await prisma.fieldUnit.createMany({
    data: [
      { id: 'U-01', name: 'NDRF Team Alpha', type: 'Special Rescue Squad', location: 'Sector 12 (North)', status: 'En Route', personnel: 8, assignedIncidentId: 'INC-2023-1027-01' },
      { id: 'U-02', name: 'Boat Unit 03', type: 'Zodiac Swiftwater', location: 'Riverbend District', status: 'On Site', personnel: 4, assignedIncidentId: 'INC-2023-1027-01' },
      { id: 'U-03', name: 'Medical Response 1', type: 'Paramedic Mobile', location: 'Camp Bravo Base', status: 'Available', personnel: 6, assignedIncidentId: null },
      { id: 'U-04', name: 'Air Recon Wing 2', type: 'Drone & Helicopter Hub', location: 'Sector 4 Airfield', status: 'On Site', personnel: 5, assignedIncidentId: null },
    ],
  });

  // 9. Seed Incidents
  await prisma.incident.createMany({
    data: [
      {
        id: 'INC-2023-1027-01',
        date: '2023-10-27 14:45 UTC',
        sector: 'Sector 12 (North Riverbank)',
        type: 'Flash Flood & Breach',
        severity: 'Critical',
        victims: 7,
        status: 'Under Action',
      },
      {
        id: 'INC-2023-1027-02',
        date: '2023-10-27 12:15 UTC',
        sector: 'Highway 4 Overpass',
        type: 'Submerged Arterial Road',
        severity: 'Warning',
        victims: 0,
        status: 'Under Action',
      },
      {
        id: 'INC-2023-1026-08',
        date: '2023-10-26 19:30 UTC',
        sector: 'Sector 14 Residential Block',
        type: 'Power Grid Failure & Flooding',
        severity: 'Warning',
        victims: 12,
        status: 'Resolved',
      },
      {
        id: 'INC-2023-1026-05',
        date: '2023-10-26 10:00 UTC',
        sector: 'East River Dam Approach',
        type: 'Levee Seepage Risk',
        severity: 'Moderate',
        victims: 0,
        status: 'Archived',
      },
    ],
  });

  // 10. Seed Relief Camps
  await prisma.reliefCamp.createMany({
    data: [
      {
        id: 'camp-1',
        name: 'Sector 14 Shelter',
        location: 'North District School',
        status: 'Critical',
        occupancy: 950,
        capacity: 1000,
        foodDays: '1 Day',
        foodCritical: true,
        waterDays: '2 Days',
        waterCritical: true,
        medsStatus: 'Low',
        personnel: 24,
        latitude: 28.6185,
        longitude: 77.2140,
      },
      {
        id: 'camp-2',
        name: 'Riverside High School',
        location: 'West Bank Zone',
        status: 'Warning',
        occupancy: 410,
        capacity: 500,
        foodDays: '5 Days',
        waterDays: '4 Days',
        medsStatus: 'Ok',
        personnel: 12,
        latitude: 28.6110,
        longitude: 77.2070,
      },
      {
        id: 'camp-3',
        name: 'Camp Bravo',
        location: 'South Hills Stadium',
        status: 'Stable',
        occupancy: 450,
        capacity: 1000,
        foodDays: '10+ Days',
        waterDays: '10+ Days',
        medsStatus: 'Ok',
        personnel: 30,
        latitude: 28.6070,
        longitude: 77.2160,
      },
    ],
  });

  // 11. Seed Emergency Alerts
  await prisma.alert.createMany({
    data: [
      {
        id: 'ALT-1092',
        title: 'Flash Flood Warning - Evacuate Zone 4',
        severity: 'Critical',
        area: 'Lower Basin / Sectors 11-14',
        time: '14:15 UTC',
        reach: '12,450 / 15,000 Recipients',
        body: 'Immediate evacuation order issued for all residents within 500m of Lower Basin Riverbank due to rapid water surge.',
        channels: 'SMS, WhatsApp, Public Siren',
        isResolved: false,
      },
      {
        id: 'ALT-1091',
        title: 'Road Inundation Advisory',
        severity: 'Warning',
        area: 'Sector 4 Highway Overpass',
        time: '13:40 UTC',
        reach: '3,200 / 3,500 Recipients',
        body: 'Highway 4 impassable due to 1.2m water level. Heavy vehicular traffic diverted to Northern Ridge Bypass.',
        channels: 'SMS, Radio Broadcast',
        isResolved: false,
      },
      {
        id: 'ALT-1090',
        title: 'Water & Ration Supply Restored',
        severity: 'Info',
        area: 'Camp Alpha Primary Shelter',
        time: '11:20 UTC',
        reach: '800 / 800 Recipients',
        body: 'Fresh potable drinking water and emergency ration distribution is now active at Sector 14 Shelter.',
        channels: 'SMS',
        isResolved: true,
      },
    ],
  });

  // 12. Seed Assessment Report
  await prisma.assessmentReport.create({
    data: {
      eventId: 'RPT-2023-1027-01',
      sector: 'Sector 12',
      generatedAt: '2023-10-27 14:45 UTC',
      source: 'Aerial Drone Telemetry & GIS Mesh',
      parametersJson: JSON.stringify({
        area: 'Sector 12',
        waterCoverage: '68%',
        waterSpread: 'Increasing (South-East, +13%)',
        affectedSettlements: '5 Settlements Inundated',
        victimsDetected: 7,
        roadBlockage: '2 Major Routes (Highway 4, Bridge Rd)',
        submergedRoads: '3 Intersections (>0.8m Depth)',
        roadAccessibility: '62% Passable (12 Open)',
        infrastructureImpact: '4 Monitored Facilities',
        bridgeStatus: 'Risk Detected (Bridge B-02)',
        nearestReliefCamp: 'Camp A (2.4 km)',
        boatsAvailable: '2 Active Units Ready for Dispatch',
      }),
    },
  });

  console.log('✅ Database successfully seeded with 12 modules of operational data!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
