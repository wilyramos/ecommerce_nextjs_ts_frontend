'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DateRangePicker, Range, RangeKeyDict } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { es } from 'date-fns/locale';


export default function DateRangeDropdown() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Inicializa rango con fechas de URL o fecha actual
    const start = searchParams.get('startDate');
    const end = searchParams.get('endDate');

    const [range, setRange] = useState<Range[]>([
        {
            startDate: start ? new Date(start) : new Date(),
            endDate: end ? new Date(end) : new Date(),
            key: 'selection',
        },
    ]);

    // Actualiza URL cuando cambia el rango
    const handleRangeChange = (ranges: RangeKeyDict) => {
        const { startDate, endDate } = ranges.selection;
        if (!startDate || !endDate) return;

        setRange([{ startDate, endDate, key: 'selection' }]);

        const params = new URLSearchParams();
        params.set('startDate', startDate.toISOString().split('T')[0]);
        params.set('endDate', endDate.toISOString().split('T')[0]);
        router.push(`/admin/reports/sales?${params.toString()}`);
    };

    return (
        <div className="w-72">
            <DateRangePicker
                ranges={range}
                onChange={handleRangeChange}
                moveRangeOnFirstSelection={false}
                months={2}
                direction="horizontal"
        locale={es} // <-- Aquí pasas el locale español
            />
        </div>
    );
}
