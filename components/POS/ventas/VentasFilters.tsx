'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { format } from 'date-fns'
import { DayPicker, DateRange } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

export default function VentasFilters() {
    const [search, setSearch] = useState('')
    const [range, setRange] = useState<DateRange | undefined>()
    const [showPicker, setShowPicker] = useState(false)

    const router = useRouter()
    const pickerRef = useRef<HTMLDivElement>(null)

    // 🔹 Aplica filtros automáticamente
    const applyFilters = () => {
        const params = new URLSearchParams()

        if (search.trim()) {
            params.append('search', search.trim())
        }
        if (range?.from) {
            params.append('fechaInicio', format(range.from, 'yyyy-MM-dd'))
        }
        if (range?.to) {
            params.append('fechaFin', format(range.to, 'yyyy-MM-dd'))
        }

        router.push(`/pos/ventas?${params.toString()}`)
    }

    useEffect(() => {
        applyFilters()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, range])

    // 🔹 Cierra el calendario si se hace click fuera
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
                setShowPicker(false)
            }
        }
        if (showPicker) {
            document.addEventListener('mousedown', handleClickOutside)
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [showPicker])

    const handleClear = () => {
        setSearch('')
        setRange(undefined)
    }

    return (
        <div className="flex flex-col md:flex-row items-center gap-4 p-4 bg-gray-200 relative">
            {/* Buscador */}
            <div className="flex items-center gap-2 w-full md:w-auto">
                {/* <Search className="text-gray-500" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar por DNI cliente"
                    aria-label="Buscar ventas"
                    className="w-full px-3 py-2 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500"
                /> */}
            </div>

            {/* Filtro con calendario */}
            <div className="flex items-center gap-2 w-full md:w-auto relative" ref={pickerRef}>
                <span className='text-gray-500 '>Filtrar:</span>
                <button
                    type="button"
                    onClick={() => setShowPicker(!showPicker)}
                    className="px-3 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                    {range?.from && range?.to
                        ? `${format(range.from, 'dd/MM/yyyy')} - ${format(range.to, 'dd/MM/yyyy')}`
                        : 'Seleccionar rango'}
                </button>

                {showPicker && (
                    <div className="absolute top-12 z-10 bg-white border rounded-md shadow-lg p-2">
                        <DayPicker
                            mode="range"
                            selected={range}
                            onSelect={setRange}
                            footer={
                                <div className="flex justify-between">
                                    <button
                                        type="button"
                                        onClick={() => setRange(undefined)}
                                        className="text-sm text-gray-500 hover:text-red-500"
                                    >
                                        Limpiar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowPicker(false)}
                                        className="px-3 py-1 text-sm text-white bg-red-500 rounded-md hover:bg-red-600"
                                    >
                                        Aplicar
                                    </button>
                                </div>
                            }
                        />
                    </div>
                )}
            </div>

            <div>
                <button
                    type="button"
                    onClick={handleClear}
                    className="text-sm text-gray-500 hover:text-red-500"
                >
                    Limpiar
                </button>
            </div>
        </div>
    )
}
