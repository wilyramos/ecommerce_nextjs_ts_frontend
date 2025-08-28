import { HeadingH2 } from '@/components/ui/Heading'
import SalesReportsCards from '@/components/admin/reports/SalesReportsCards'
import GeneralView from '@/components/admin/reports/GeneralView'

export default function ReportsAdminPage() {


    return (
        <>
            <HeadingH2>Reportes</HeadingH2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 p-2">

                <SalesReportsCards /> 
                <GeneralView />              
                {/*<BestSellingProducts />      Productos más vendidos 
                <LowStockProducts />         Stock crítico 
                <SalesByChannel />           POS vs Online 
                <CustomerReports />          Clientes frecuentes y nuevos 
                <RevenueByPaymentMethod />   Pagos por tipo 
                <ReturnsAndCancellations />  Devoluciones y fallos */}
            </div>
        </>
    )
}
