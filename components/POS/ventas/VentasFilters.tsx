'use client'
import { Search, Filter } from 'lucide-react'

type Props = {
    search: string
    setSearch: (value: string) => void
    fechaInicio: string
    setFechaInicio: (value: string) => void
    fechaFin: string
    setFechaFin: (value: string) => void
}

export default function VentasFilters({
    search,
    setSearch,
    fechaInicio,
    setFechaInicio,
    fechaFin,
    setFechaFin,
}: Props) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-md">
            <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Buscar por cliente o ID"
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <input
                type="date"
                className="border border-gray-300 rounded-md px-4 py-2 w-full"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
            />
            <input
                type="date"
                className="border border-gray-300 rounded-md px-4 py-2 w-full"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
            />
        </div>
    )
}
