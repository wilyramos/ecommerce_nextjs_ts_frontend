import { HeadingH2 } from '@/components/ui/Heading'
import Link from 'next/link'

export default function ReportsAdminPage() {
    return (
        <>
            <HeadingH2>Resumen</HeadingH2>

            <Link href="/admin/reports/sales">
                <div className='bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow'>
                    <h3 className='text-lg font-semibold'>Ventas</h3>
                    <p className='text-gray-600'>Ver reporte de ventas</p>
                </div>
            </Link>

        </>
    )
}
