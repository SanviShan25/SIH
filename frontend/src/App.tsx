import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { OperationalDashboard } from './pages/OperationalDashboard';

export const App: React.FC = () => {
  return (
    <Router><Routes><Route path="/" element={<Layout />}><Route index element={<Navigate to="/dashboard" replace />} /><Route path="dashboard" element={<OperationalDashboard />} /><Route path="*" element={<Navigate to="/dashboard" replace />} /></Route></Routes></Router>
  );
};

export default App;
