import React from "react"

type KpiCardProps = {
    title: string
    value: string | number
    icon?: React.ReactNode
}

export default function KpiCard({ title, value, icon }: KpiCardProps) {
    return (
        <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3">
                {icon && (
                    <div className="p-2 rounded-lg bg-gradient-to-br from-sky-100 to-sky-200 text-sky-600 flex items-center justify-center text-base shadow-inner">
                        {icon}
                    </div>
                )}
                <div className="flex flex-col flex-1">
                    <p className="text-xs text-gray-500 font-medium">{title}</p>
                    <p className="text-lg font-semibold text-gray-900 tracking-tight">
                        {value}
                    </p>
                </div>
            </div>
        </div>
    )
}