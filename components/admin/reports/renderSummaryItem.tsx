import React from 'react';



export default function renderSummaryItem(title: string, value: string | number, icon: React.ReactNode) {
    return (
        <div className="border p-4 rounded-lg bg-white shadow-sm flex items-center gap-3">
            {icon}
            <div>
                <div className="text-xs text-gray-500">{title}</div>
                <div className="text-sm font-semibold">{value}</div>
            </div>
        </div>
    );
}