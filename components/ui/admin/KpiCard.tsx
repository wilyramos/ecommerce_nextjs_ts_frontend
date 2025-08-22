import React from "react"

type KpiCardProps = {
    title: string
    value: string | number
    icon?: React.ReactNode
}

export default function KpiCard({ title, value, icon }: KpiCardProps) {
    return (
        <div className="p-2 bg-gray-100  rounded-lg border-gray-200 hover:shadow-md transition-shadow duration-200 border-r-sky-400 border-2">
            <div className="flex items-center gap-4">
                {icon && (
                    <div className="p-3 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center text-lg">
                        {icon}
                    </div>
                )}
                <div className="flex justify-between items-center flex-1 ml-3">
                    <p className="text-sm text-gray-500">{title}</p>
                    <p className="text-lg font-semibold text-gray-900">{value}</p>
                </div>
            </div>
        </div>
    )
}
