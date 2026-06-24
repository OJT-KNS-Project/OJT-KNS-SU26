export interface SystemLog {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  level: "INFO" | "WARNING" | "ERROR";
  details: string;
}

export interface ServiceStatus {
  name: string;
  status: "ONLINE" | "DEGRADED" | "OFFLINE";
  latency?: number; // in ms
  recordedTimestamp?: string | null;
}

const seedLogs: SystemLog[] = [
  {
    id: "1",
    user: "admin@academy.edu",
    action: "Login Success",
    timestamp: "2026-06-24T10:00:00.000Z",
    level: "INFO",
    details: "Session initialized successfully from client IP 192.168.1.100. Credentials masked.",
  },
  {
    id: "2",
    user: "teacher@academy.edu",
    action: "Upload Document",
    timestamp: "2026-06-24T09:45:00.000Z",
    level: "INFO",
    details: "Uploaded 'meteo_manual_v2.pdf' (4.2 MB) for course Aviation Meteorology (AV101).",
  },
  {
    id: "3",
    user: "admin@academy.edu",
    action: "Update User",
    timestamp: "2026-06-24T09:12:00.000Z",
    level: "WARNING",
    details: "Changed role of user nguyenvana@academy.edu from Student to Teacher.",
  },
  {
    id: "4",
    user: "System",
    action: "AI Service Error",
    timestamp: "2026-06-24T08:30:00.000Z",
    level: "ERROR",
    details: "Rate limit exceeded (429) during vector DB lookup for prompt: 'What is wind shear?'",
  },
  {
    id: "5",
    user: "student@academy.edu",
    action: "Login Success",
    timestamp: "2026-06-24T08:00:00.000Z",
    level: "INFO",
    details: "Session initialized. Access token granted.",
  },
  {
    id: "6",
    user: "admin@academy.edu",
    action: "Deactivate Course",
    timestamp: "2026-06-24T07:15:00.000Z",
    level: "WARNING",
    details: "Deactivated Avionics Systems (AV103). Course status set to INACTIVE.",
  },
  {
    id: "7",
    user: "System",
    action: "API Connection Failed",
    timestamp: "2026-06-24T06:00:00.000Z",
    level: "ERROR",
    details: "Timeout connection to S3 File Storage gateway, auto-retried and resolved in 2.1s.",
  },
];

let systemLogs = [...seedLogs];

export const mockDashboardData = {
  getLogs(): SystemLog[] {
    return systemLogs;
  },

  addLog(user: string, action: string, level: "INFO" | "WARNING" | "ERROR", details: string) {
    const newLog: SystemLog = {
      id: String(systemLogs.length + 1),
      user,
      action,
      timestamp: new Date().toISOString(),
      level,
      details,
    };
    systemLogs = [newLog, ...systemLogs];
    return newLog;
  },
};
