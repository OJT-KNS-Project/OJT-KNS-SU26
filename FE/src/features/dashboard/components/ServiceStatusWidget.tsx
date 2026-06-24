import { useState, useEffect } from "react";
import { Server, Database, HardDrive, Cpu, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";

interface ServiceState {
  name: string;
  status: "ONLINE" | "DEGRADED" | "OFFLINE";
  latency: number;
  icon: any;
  recordedTimestamp?: string | null;
}

export default function ServiceStatusWidget() {
  const [aiFailed, setAiFailed] = useState(false);
  const [aiOutageTime, setAiOutageTime] = useState<string | null>(null);
  
  // Random latency simulations
  const [latencies, setLatencies] = useState({
    backend: 14,
    database: 6,
    storage: 42,
    ai: 245
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setLatencies({
        backend: Math.floor(Math.random() * 10) + 10,
        database: Math.floor(Math.random() * 5) + 4,
        storage: Math.floor(Math.random() * 20) + 35,
        ai: Math.floor(Math.random() * 100) + 200,
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleAiOutage = () => {
    if (!aiFailed) {
      setAiFailed(true);
      setAiOutageTime(new Date().toISOString());
    } else {
      setAiFailed(false);
      setAiOutageTime(null);
    }
  };

  const services: ServiceState[] = [
    {
      name: "Backend Server Gateway",
      status: "ONLINE",
      latency: latencies.backend,
      icon: Server,
    },
    {
      name: "PostgreSQL Database Cluster",
      status: "ONLINE",
      latency: latencies.database,
      icon: Database,
    },
    {
      name: "S3 Object File Storage",
      status: "ONLINE",
      latency: latencies.storage,
      icon: HardDrive,
    },
    {
      name: "Cognitive AI Service (RAG)",
      status: aiFailed ? "OFFLINE" : "ONLINE",
      latency: aiFailed ? 0 : latencies.ai,
      icon: Cpu,
      recordedTimestamp: aiOutageTime,
    },
  ];

  return (
    <Card className="border-border/60 bg-card/85 shadow-soft">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base font-semibold">Service Health & Operations Status</CardTitle>
          <CardDescription>Real-time server latency and availability monitor</CardDescription>
        </div>
        <Button
          variant={aiFailed ? "default" : "destructive"}
          size="sm"
          className="rounded-xl transition-all"
          onClick={handleToggleAiOutage}
        >
          {aiFailed ? "Restore AI Service" : "Simulate AI Outage"}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          {services.map((svc) => {
            const Icon = svc.icon;
            const isOnline = svc.status === "ONLINE";


            return (
              <div
                key={svc.name}
                className="flex items-start gap-3.5 p-3.5 rounded-2xl border border-border/50 bg-muted/20 hover:bg-muted/40 transition-colors"
              >
                <div
                  className={`p-2.5 rounded-xl border ${
                    isOnline
                      ? "text-emerald-600 bg-emerald-50 border-emerald-200/40"
                      : "text-destructive bg-destructive/5 border-destructive/20 animate-pulse"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-foreground/90 truncate">
                      {svc.name}
                    </p>
                    <span
                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase ${
                        isOnline
                          ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/10"
                          : "bg-destructive/10 text-destructive ring-1 ring-inset ring-destructive/20"
                      }`}
                    >
                      {svc.status}
                    </span>
                  </div>
                  {isOnline ? (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Latency: <span className="font-mono font-medium text-foreground">{svc.latency}ms</span> • API operational
                    </p>
                  ) : (
                    <div className="mt-1 text-[11px] text-destructive space-y-0.5">
                      <p className="font-medium flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3 shrink-0" />
                        AI Service unresponsive (503 Service Unavailable)
                      </p>
                      {svc.recordedTimestamp && (
                        <p className="text-muted-foreground text-[10px]">
                          Recorded: {new Date(svc.recordedTimestamp).toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
