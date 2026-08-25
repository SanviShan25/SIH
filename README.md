# 🚁 Autonomous Disaster Response & Flood Surveillance Command Platform

An enterprise-grade autonomous flood surveillance, drone telemetry, computer vision, and emergency rescue coordination platform built for rapid disaster response.

---

## 🌟 Architecture & Repository Structure

This monorepo contains the complete end-to-end system:

```text
├── frontend/             # React 19 + TypeScript + Vite + Tailwind CSS + Leaflet GIS Map
│   ├── src/
│   │   ├── api/          # REST API & Socket.IO WebSockets client
│   │   ├── components/   # Interactive Leaflet GIS Map, AuthModal, Topbar, Sidebar
│   │   ├── context/      # Google OAuth & Guest Mode AuthContext
│   │   ├── pages/        # 14 Real-time Command & Intelligence Pages
│   │   └── ...
│   └── package.json
│
├── backend/              # Node.js + Express + TypeScript + Prisma ORM + Socket.IO
│   ├── prisma/
│   │   └── schema.prisma # PostgreSQL Database Models (10 Disaster Data Tables)
│   ├── src/
│   │   ├── routes/       # 14 REST Endpoints (Missions, Telemetry, Camps, Alerts, YOLOv8)
│   │   ├── socket.ts     # Live WebSockets Engine (Telemetry, Camps, Alerts events)
│   │   └── server.ts     # HTTP & WebSocket Server Entry Point
│   └── package.json
│
└── html files/           # Reference Wireframes & Interactive Mockups
```

---

## 🚀 Key Modules & Capabilities

1. **Live GIS Interactive Map**:
   - Leaflet-powered GIS engine with **Satellite HD (Esri)**, **Tactical Dark**, and **Street Map** switcher.
   - Dynamic flood polygon overlays with depth and spread rate metrics.
   - Real-time animated drone flight marker tracking GPS telemetry over WebSockets.
   - Integrated topbar search with coordinate parser and location auto-suggestions.

2. **AI Vision (YOLOv8) Computer Vision Pipeline**:
   - Neural aerial frame scanner for automated victim, rescue boat, and stranded vehicle detection.
   - Dynamic pulsing computer vision bounding boxes with confidence scores.

3. **Emergency Rescue Coordination & Response Planning**:
   - Squad dispatch (NDRF, Swiftwater Rescue, Zodiac Boats, Paramedics).
   - Dynamic status cycling (`En Route` ➔ `On Site` ➔ `Available`).

4. **Relief Camps Oversight & Welfare Logistics**:
   - Real-time camp occupancy and shelter capacity monitoring.
   - Food and water reserve tracking with one-click ration replenishment.

5. **Disaster Assessment Situation Report Exporter**:
   - Automated 12-parameter situation assessment report generator.
   - High-contrast printable document exporter with PDF download.

6. **Authentication & Role-Based Access Control**:
   - **Google Sign-In** via Google Identity Services (`@react-oauth/google`).
   - **1-Click Guest Observer Mode** for public or evaluators monitoring.

---

## 🛠️ Quick Start Guide

### 1. Backend Setup

```bash
cd backend
npm install

# Setup environment variables
cp .env.example .env

# Generate Prisma Client & Migrate Database
npm run prisma:generate
npm run prisma:push

# Seed initial disaster data
npm run seed

# Run Backend Development Server
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install

# Run Frontend Development Server
npm run dev
```

The frontend will start at `http://localhost:5173`.

---

## 🌐 Production Deployments & API Endpoints

- **Backend Live Base URL**: `https://drone-flood-backend.onrender.com/api/v1`
- **Health Check**: `https://drone-flood-backend.onrender.com/health`
- **Relief Camps API**: `https://drone-flood-backend.onrender.com/api/v1/camps`
- **Field Units API**: `https://drone-flood-backend.onrender.com/api/v1/units`
- **Emergency Alerts API**: `https://drone-flood-backend.onrender.com/api/v1/alerts`
- **Drone Missions API**: `https://drone-flood-backend.onrender.com/api/v1/missions`
- **Current Assessment PDF Route**: `https://drone-flood-backend.onrender.com/api/v1/report/current/pdf`
