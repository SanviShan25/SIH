import http from 'http';
import { app } from './app';

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`🚁 Sky Guardians Drone Flood Intelligence Backend`);
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log(`🌐 Health endpoint: http://localhost:${PORT}/health`);
  console.log(`🛡️  Mode: Guest Mode (Full Operational Access)`);
  console.log(`===================================================`);
});
