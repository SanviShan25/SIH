import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { OperationalDashboard } from './pages/OperationalDashboard';
import { FloodMapIntelligence } from './pages/FloodMapIntelligence';
import { DroneMissionControl } from './pages/DroneMissionControl';
import { DetectionAnalysisWorkspace } from './pages/DetectionAnalysisWorkspace';
import { RescueCoordination } from './pages/RescueCoordination';
import { ReliefCampsOversight } from './pages/ReliefCampsOversight';
import { EmergencyAlertManagement } from './pages/EmergencyAlertManagement';
import { FloodProgressionPrediction } from './pages/FloodProgressionPrediction';
import { FloodReport } from './pages/FloodReport';
import { IncidentRecords } from './pages/IncidentRecords';

export const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<OperationalDashboard />} />
          <Route path="flood-map" element={<FloodMapIntelligence />} />
          <Route path="drone-missions" element={<DroneMissionControl />} />
          <Route path="detection-analysis" element={<DetectionAnalysisWorkspace />} />
          <Route path="rescue-coordination" element={<RescueCoordination />} />
          <Route path="relief-camps" element={<ReliefCampsOversight />} />
          <Route path="alerts" element={<EmergencyAlertManagement />} />
          <Route path="incident-records" element={<IncidentRecords />} />
          <Route path="flood-progression" element={<FloodProgressionPrediction />} />
          <Route path="flood-report" element={<FloodReport />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
