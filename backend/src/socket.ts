import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';

export class SocketManager {
  private static io: SocketIOServer | null = null;
  private static telemetryInterval: NodeJS.Timeout | null = null;

  public static initialize(httpServer: HttpServer, corsOrigin: string = '*'): SocketIOServer {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: corsOrigin,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
      },
    });

    this.io.on('connection', (socket: Socket) => {
      console.log(`⚡ Socket client connected: ${socket.id}`);

      // Allow joining specific rooms (e.g. mission-specific telemetry)
      socket.on('join:mission', (missionId: string) => {
        socket.join(`mission:${missionId}`);
        console.log(`📡 Socket ${socket.id} joined room mission:${missionId}`);
      });

      socket.on('disconnect', () => {
        console.log(`🔌 Socket client disconnected: ${socket.id}`);
      });
    });

    // Start background telemetry simulator for DRONE-001 (Stub for hardware team)
    this.startTelemetrySimulator();

    return this.io;
  }

  public static emitEvent(eventName: string, payload: any, room?: string) {
    if (!this.io) return;
    if (room) {
      this.io.to(room).emit(eventName, payload);
    } else {
      this.io.emit(eventName, payload);
    }
  }

  private static startTelemetrySimulator() {
    let battery = 84;
    let altitude = 120;
    let speed = 45;
    let baseLat = 28.6139;
    let baseLng = 77.2090;

    this.telemetryInterval = setInterval(() => {
      // Simulate slight realistic telemetry drift
      battery = Math.max(15, battery - (Math.random() > 0.8 ? 1 : 0));
      altitude = Math.round(120 + (Math.random() * 6 - 3));
      speed = Math.round(45 + (Math.random() * 4 - 2));
      baseLat += (Math.random() * 0.0002 - 0.0001);
      baseLng += (Math.random() * 0.0002 - 0.0001);

      const telemetryData = {
        droneId: 'DRONE-001',
        missionId: 'MISSION-DRONE-001',
        timestamp: new Date().toISOString(),
        battery,
        altitude,
        speed,
        coordinates: {
          lat: Number(baseLat.toFixed(5)),
          lng: Number(baseLng.toFixed(5)),
        },
        signalQuality: 92,
        flightMode: 'AUTONOMOUS RECON',
      };

      this.emitEvent('telemetry:update', telemetryData);
      this.emitEvent('telemetry:update', telemetryData, 'mission:MISSION-DRONE-001');
    }, 2000);
  }
}
