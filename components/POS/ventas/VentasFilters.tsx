'use client'

import { Search, Filter } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function VentasFilters() {
    const [search, setSearch] = useState('')
    const [fechaInicio, setFechaInicio] = useState('')
    const [fechaFin, setFechaFin] = useState('')
    const router = useRouter()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const params = new URLSearchParams()

        if (search.trim()) {
            params.append('search', search.trim())
        }

        if (fechaInicio) {
            params.append('fechaInicio', fechaInicio)
        }

        if (fechaFin) {
            params.append('fechaFin', fechaFin)
        }

        router.push(`/pos/ventas?${params.toString()}`)
    }


    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col md:flex-row items-center gap-4 p-4 bg-white rounded-lg shadow-sm"
        >
            {/* Buscador */}
            <div className="flex items-center gap-2 w-full md:w-auto">
                <Search className="text-gray-500" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar por nombre de cliente"
                    aria-label="Buscar ventas"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Fechas */}
            <div className="flex items-center gap-2 w-full md:w-auto">
                <Filter className="text-gray-500" />
                <input
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    aria-label="Fecha inicio"
                    className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span>-</span>
                <input
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    aria-label="Fecha fin"
                    className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Botón */}
            <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
                Filtrar
            </button>
        </form>
    )
}