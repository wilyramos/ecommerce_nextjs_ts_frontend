import React from "react"

type KpiCardProps = {
    title: string
    value: string | number
    icon?: React.ReactNode
}

export default function KpiCard({ title, value, icon }: KpiCardProps) {
    return (
        <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2">
                {icon && <div className="text-sky-600">{icon}</div>}
                <div>
                    <p className="text-xs text-gray-500">{title}</p>
                    <p className="text-base font-semibold text-gray-900">{value}</p>
                </div>
            </div>
        </div>
    )
}
