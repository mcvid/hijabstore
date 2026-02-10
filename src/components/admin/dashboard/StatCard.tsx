import React from "react";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import Card from "../ui/Card";

interface StatCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    trend?: {
        value: string;
        direction: "up" | "down" | "neutral";
        label: string;
    };
    className?: string;
}

export default function StatCard({
    title,
    value,
    icon: Icon,
    trend,
    className = "",
}: StatCardProps) {
    return (
        <Card className={`relative overflow-hidden ${className}`}>
            <div className="flex justify-between items-start">
                <div className="z-10">
                    <p className="text-sm font-medium text-admin-gray-600 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-admin-dark font-display tracking-tight">{value}</h3>

                    {trend && (
                        <div className="flex items-center mt-2 text-xs">
                            <span
                                className={`flex items-center font-medium px-1.5 py-0.5 rounded-full ${trend.direction === "up"
                                        ? "text-green-700 bg-green-50"
                                        : trend.direction === "down"
                                            ? "text-red-700 bg-red-50"
                                            : "text-gray-700 bg-gray-50"
                                    }`}
                            >
                                {trend.direction === "up" && <TrendingUp size={12} className="mr-1" />}
                                {trend.direction === "down" && <TrendingDown size={12} className="mr-1" />}
                                {trend.direction === "neutral" && <Minus size={12} className="mr-1" />}
                                {trend.value}
                            </span>
                            <span className="ml-2 text-admin-gray-600">{trend.label}</span>
                        </div>
                    )}
                </div>

                <div className="p-2 bg-admin-gray-100 rounded-lg text-admin-dark">
                    <Icon size={20} />
                </div>
            </div>

            {/* Decorative Background Icon */}
            <Icon
                className="absolute -bottom-4 -right-4 w-24 h-24 text-admin-gray-100/50 -rotate-12 pointer-events-none"
                strokeWidth={1}
            />
        </Card>
    );
}
