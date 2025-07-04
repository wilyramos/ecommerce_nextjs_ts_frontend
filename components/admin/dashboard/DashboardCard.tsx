'use client';

import React from 'react';

interface DashboardCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    bgColor?: string; // Tailwind background class
}

export function DashboardCard({
    title,
    value,
    icon,
    bgColor = 'bg-gray-800',
}: DashboardCardProps) {
    return (
        <div
            className={`p-5 rounded-2xl shadow-md text-white flex items-center justify-between ${bgColor}`}
        >
            <div>
                <p className="text-sm opacity-75">{title}</p>
                <h2 className="text-2xl font-bold mt-1">{value}</h2>
            </div>

            <div className="p-3 bg-white/20 rounded-full">
                {icon}
            </div>
        </div>
    );
}
