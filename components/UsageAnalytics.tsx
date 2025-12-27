"use client";

import { useEffect, useState } from "react";
import { Activity, Clock } from "lucide-react";

export default function UsageAnalytics({ serverId }: { serverId: string }) {
    const [metrics, setMetrics] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                // We'll call our new internal API
                const res = await fetch(`/api/servers/${serverId}/metrics`);
                const data = await res.json();
                setMetrics(data.reverse()); // Show chronological
            } catch (e) {
                console.error('Failed to fetch telemetry history');
            } finally {
                setLoading(false);
            }
        };
        fetchMetrics();
        const interval = setInterval(fetchMetrics, 30000); // Update every 30s
        return () => clearInterval(interval);
    }, [serverId]);

    if (loading) return (
        <div className="glass-card h-64 animate-pulse flex items-center justify-center text-gray-600 font-black uppercase tracking-[0.3em] text-xs italic">
            Synchronizing Telemetry...
        </div>
    );

    // Simple SVG Line Generator
    const generateLine = (data: any[], key: string, height: number, scale: number) => {
        if (data.length < 2) return "";
        const points = data.map((m, i) => {
            const x = (i / (data.length - 1)) * 100;
            const y = height - (m[key] * scale);
            return `${x},${y}`;
        });
        return points.join(" ");
    };

    return (
        <div className="glass-card p-8">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <Activity className="text-brand-purple" size={20} />
                    <h3 className="text-sm font-black uppercase tracking-widest text-white">Performance Matrix</h3>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-brand-purple" />
                        <span className="text-[9px] font-black uppercase text-gray-500">CPU LOAD</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-brand-blue" />
                        <span className="text-[9px] font-black uppercase text-gray-500">RAM USAGE</span>
                    </div>
                </div>
            </div>

            <div className="relative h-48 w-full border-l border-b border-white/5">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                    {/* CPU Line */}
                    <polyline
                        fill="none"
                        stroke="#A855F7"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                        points={generateLine(metrics, 'cpuUsage', 100, 1)}
                        className="transition-all duration-1000"
                    />
                    {/* RAM Line */}
                    <polyline
                        fill="none"
                        stroke="#3B82F6"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                        points={generateLine(metrics, 'ramUsageMb', 100, 0.01)} // Scaled for MB to 100
                        className="transition-all duration-1000"
                    />
                </svg>
                
                {/* Time Axis Labels */}
                <div className="flex justify-between mt-4 text-[8px] font-black text-gray-600 uppercase tracking-widest italic">
                    <span>-1h</span>
                    <span>-30m</span>
                    <span>Current</span>
                </div>
            </div>
        </div>
    );
}
