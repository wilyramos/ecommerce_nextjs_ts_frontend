'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function FiltersReportsSales() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [startDate, setStartDate] = useState(searchParams.get('startDate') || '');
    const [endDate, setEndDate] = useState(searchParams.get('endDate') || '');

    // Actualiza la URL automáticamente cuando cambian las fechas
    useEffect(() => {
        const params = new URLSearchParams();
        if (startDate) params.set('startDate', startDate);
        if (endDate) params.set('endDate', endDate);
        router.push(`/admin/reports/sales?${params.toString()}`);
    }, [startDate, endDate]);

    return (
        <div className="flex flex-col md:flex-row gap-4 mb-4 text-xs">
            <div className="flex items-center gap-2">
                <label htmlFor="startDate" className="text-sm">Fecha Inicio:</label>
                <input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border px-2 py-1"
                />
            </div>
            <div className="flex items-center gap-2">
                <label htmlFor="endDate" className="text-sm">Fecha Fin:</label>
                <input
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border px-2 py-1"
                    
                />
            </div>
        </div>
    );
}
