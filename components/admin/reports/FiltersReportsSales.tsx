'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { DateRangePicker, Range, RangeKeyDict } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { es } from 'date-fns/locale';

export default function DateRangeDropdown() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const start = searchParams.get('startDate');
    const end = searchParams.get('endDate');

    const [range, setRange] = useState<Range[]>([
        {
            startDate: start ? new Date(start) : new Date(),
            endDate: end ? new Date(end) : new Date(),
            key: 'selection',
        },
    ]);

    const [isMobile, setIsMobile] = useState(false);

    // Detect screen size
    useEffect(() => {
        const checkScreen = () => setIsMobile(window.innerWidth < 768); // md breakpoint
        checkScreen();
        window.addEventListener('resize', checkScreen);
        return () => window.removeEventListener('resize', checkScreen);
    }, []);

    const handleRangeChange = (ranges: RangeKeyDict) => {
        const { startDate, endDate } = ranges.selection;
        if (!startDate || !endDate) return;

        setRange([{ startDate, endDate, key: 'selection' }]);

        const params = new URLSearchParams();
        params.set('startDate', startDate.toISOString().split('T')[0]);
        params.set('endDate', endDate.toISOString().split('T')[0]);
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="w-full max-w-full overflow-x-auto">
            <DateRangePicker
                ranges={range}
                onChange={handleRangeChange}
                moveRangeOnFirstSelection={false}
                months={isMobile ? 1 : 2}
                direction={isMobile ? 'vertical' : 'horizontal'}
                locale={es}
            />
        </div>
    );
}
