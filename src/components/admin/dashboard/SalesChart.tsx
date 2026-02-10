import React from "react";
import Card from "../ui/Card";
import { TrendingUp } from "lucide-react";

export default function SalesChart() {
    // Mock data points for the sparkline
    const data = [30, 45, 35, 50, 40, 60, 55, 70, 65, 80, 75, 90, 85, 100];
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;

    // Generate SVG path command
    const points = data.map((value, index) => {
        const x = (index / (data.length - 1)) * 100;
        const y = 100 - ((value - min) / range) * 80; // Scale to 80% height, inverted Y
        return `${x},${y}`;
    }).join(" ");

    return (
        <Card className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-display font-semibold text-admin-dark">Sales Overview</h3>
                    <p className="text-sm text-admin-gray-600">Monthly revenue performance</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    <TrendingUp size={14} />
                    <span className="font-medium">+12.5%</span>
                </div>
            </div>

            <div className="flex-1 min-h-[200px] relative w-full">
                {/* Chart Area */}
                <div className="absolute inset-0 flex items-end justify-between px-2 text-xs text-admin-gray-400 mb-6">
                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"].map((m) => <span key={m}>{m}</span>)}
                </div>

                <svg className="w-full h-[85%] overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {/* Gradient Definition */}
                    <defs>
                        <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="var(--admin-gold)" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="var(--admin-gold)" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Area Path */}
                    <path
                        d={`M0,100 ${points.split(" ").map(p => "L" + p).join(" ")} L100,100 Z`}
                        fill="url(#gradient)"
                        stroke="none"
                    />

                    {/* Line Path */}
                    <polyline
                        fill="none"
                        stroke="var(--admin-gold)"
                        strokeWidth="2"
                        points={points}
                        vectorEffect="non-scaling-stroke"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Data Points (optional, just for visual flair on last point) */}
                    <circle cx="100" cy="20" r="3" fill="var(--admin-dark)" stroke="white" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                </svg>
            </div>
        </Card>
    );
}
