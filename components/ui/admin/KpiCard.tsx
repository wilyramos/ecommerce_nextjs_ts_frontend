import React from "react"

type KpiCardProps = {
    title: string
    value: string | number
    icon?: React.ReactNode
}

export default function KpiCard({ title, value, icon }: KpiCardProps) {
    return (
        <div className="p-3 bg-white rounded-xl border border-gray-100">
            <div className="flex items-center justify-between">
                <h3 className="text-xs text-gray-400">{title}</h3>
                {icon && <div className="text-gray-400 text-sm">{icon}</div>}
            </div>
            <p className="text-lg font-semibold text-black mt-1">{value}</p>
        </div>
    )
}
