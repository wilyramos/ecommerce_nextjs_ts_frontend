import { HeadingH2 } from '@/components/ui/Heading'
import Link from 'next/link'
import SalesReportsCards from '@/components/admin/reports/SalesReportsCards'

export default function ReportsAdminPage() {
    

    return (
        <>
            <HeadingH2>Resumen</HeadingH2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                
                <div>
                    <SalesReportsCards />
                </div>

                <div>
                    hola
                </div>

                <div>
                    hola
                </div>

                <div>
                    hola
                </div>
            </div>
        </>
    )
}
