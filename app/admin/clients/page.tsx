import { Suspense } from "react";
import SpinnerLoading from "@/components/ui/SpinnerLoading";
import AddClientButton from "@/components/admin/clients/AddClientButton";




type SearchParams = Promise<{
    page?: string;
    limit?: string;
    query?: string;
}>;

export default async function AdminClientsPage({ searchParams }: { searchParams: SearchParams }) {

    const params = await searchParams;
    const currentPage = params.page ? parseInt(params.page, 10) : 1;
    const itemsPerPage = params.limit ? parseInt(params.limit, 10) : 10;


    return (
        <main className="p-4">

            <div className="flex justify-between md:flex-row gap-4 py-2">
                {/* Search */}
                <h1 className="text-2xl font-bold text-gray-800">
                    Clientes / usuarios
                </h1>
                <AddClientButton />

            </div>
            <div></div>
        </main>
    )
}
