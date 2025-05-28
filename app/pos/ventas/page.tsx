import VentasFilters from '@/components/POS/ventas/VentasFilters'
import { getSales } from '@/src/services/sales'
import VentasTable from '@/components/POS/ventas/VentasTable'
import Pagination from '@/components/home/Pagination'


type PageVentasProps = {
    searchParams: Promise<{
        search?: string;
        fechaInicio?: string;
        fechaFin?: string;
        page?: number;
        limit?: number;
    }>;
};


export default async function PageVentas({ searchParams }: PageVentasProps) {


    const params = await searchParams;

    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;

    const data = await getSales({
        search: params.search,
        fechaInicio: params.fechaInicio,
        fechaFin: params.fechaFin,
        page,
        limit
    });
    // Get sales data from the backend



    if (!data) {
        return (
            <div className="p-6 text-center">
                <h1 className="text-lg text-gray-600">No hay ventas disponibles</h1>
            </div>
        );
    }


   return (
    <section className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Ventas</h2>

      <VentasFilters />

      <VentasTable
        ventas={data?.sales || []}
      />

      <Pagination
        currentPage={data.currentPage}
        totalPages={data.totalPages}
        limit={limit}
        pathname="/pos/ventas"
        queryParams={{
          search: params.search,
          fechaInicio: params.fechaInicio,
          fechaFin: params.fechaFin,
        }}
      />
    </section>
  );
}