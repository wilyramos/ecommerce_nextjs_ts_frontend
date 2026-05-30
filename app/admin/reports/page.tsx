// File: frontend/app/admin/reports/page.tsx

import SalesReportsCards from '@/components/admin/reports/SalesReportsCards'
import GeneralView from '@/components/admin/reports/GeneralView'
import { Suspense } from 'react'
import SpinnerLoading from '@/components/ui/SpinnerLoading'
import AdminPageWrapper from '@/components/admin/AdminPageWrapper'

export default function ReportsAdminPage() {
    return (
        <AdminPageWrapper
            title="Reportes Analíticos"
            breadcrumbItems={[{ label: "Dashboard", href: "/admin" }]}
            breadcrumbCurrent="Reportes"
            showBackButton={false}
        >
            <div className="grid grid-cols-1 gap-8">
                <Suspense fallback={<SpinnerLoading />}>
                    <SalesReportsCards />
                </Suspense>
                
                <Suspense fallback={<SpinnerLoading />}>
                    <GeneralView />
                </Suspense>
            </div>
        </AdminPageWrapper>
    )
}