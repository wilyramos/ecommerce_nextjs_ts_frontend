'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { XCircle } from 'lucide-react'
import CustomDatePicker from '@/components/ui/CustomDatePicker'

export default function VentasFilters() {
    const [fromDate, setFromDate] = useState<Date | null>(null)
    const [toDate, setToDate] = useState<Date | null>(null)

    const router = useRouter()

    const applyFilters = () => {
        const params = new URLSearchParams()

        if (fromDate) params.append('fechaInicio', format(fromDate, 'yyyy-MM-dd'))
        if (toDate) params.append('fechaFin', format(toDate, 'yyyy-MM-dd'))

        router.push(`/pos/ventas?${params.toString()}`)
    }

    useEffect(() => {
        applyFilters()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fromDate, toDate])

    const handleClear = () => {
        setFromDate(null)
        setToDate(null)
    }

    return (
        <div className="flex flex-col md:flex-row items-center gap-4 p-4">
            {/* Fechas */}
            <div className="flex items-center gap-3">
                <CustomDatePicker
                    selected={fromDate}
                    onChange={setFromDate}
                    placeholder="Desde"
                    selectsStart
                    startDate={fromDate}
                    endDate={toDate}
                />

                <CustomDatePicker
                    selected={toDate}
                    onChange={setToDate}
                    placeholder="Hasta"
                    selectsEnd
                    startDate={fromDate}
                    endDate={toDate}
                />
            </div>

            {/* Botón limpiar */}
            <button
                type="button"
                onClick={handleClear}
                className="flex items-center text-sm text-gray-500 hover:text-red-500 transition-colors"
            >
                <XCircle className="w-4 h-4 mr-1" />
                Limpiar
            </button>
        </div>
    )
}
