import AdminPageWrapper from '@/components/admin/AdminPageWrapper';
import AddClientButton from '@/components/admin/clients/AddClientButton';
import ClientsTable from '@/components/admin/clients/ClientsTable';
import { getAllClients } from '@/src/services/users';
import { Suspense } from 'react';
import Pagination from "@/components/ui/Pagination";

type SearchParams = Promise<{
    page?: string;
    limit?: string;
}>;


export default async function ClientsPage({ searchParams }: { searchParams: SearchParams }) {
    const params = await searchParams;
    const currentPage = params.page ? parseInt(params.page, 10) : 1;
    const itemsPerPage = params.limit ? parseInt(params.limit, 10) : 10;

    const clients = await getAllClients({
        page: currentPage,
        limit: itemsPerPage,
    });

    return (
        <AdminPageWrapper
            title="Clientes"
            showBackButton={false}
            actions={<AddClientButton />}
        >
            <Suspense fallback={<div className="text-xs text-muted-foreground p-4">Cargando clientes...</div>}>
                {clients && clients.users && clients.users.length > 0 ? (
                    <div className="space-y-4">
                        <ClientsTable clients={clients} />
                        <Pagination
                            currentPage={currentPage}
                            // Usamos directamente la propiedad del objeto recibido
                            totalPages={clients.totalPages}
                            limit={itemsPerPage}
                            pathname="/admin/clients"
                        />
                    </div>
                ) : (
                    <div className="text-center py-20 border border-border/60 rounded-sm">
                        <p className="text-xs font-medium text-muted-foreground">No se encontraron clientes.</p>
                    </div>
                )}
            </Suspense>
        </AdminPageWrapper>
    );
}