import { getProductsByAdmin } from '@/src/services/products';
import React from 'react'
import ProductsTable from '@/components/admin/products/ProductsTable';
import Pagination from '@/components/ui/Pagination';


type ProductsResultProps = {
    currentPage: number;
    itemsPerPage: number;
    params: {
        query?: string;
    };
};

export default async function ProductsResultsAdmin({
    currentPage,
    itemsPerPage,
    params
}: ProductsResultProps) {

    // Fetch products data using the provided parameters
    const productsData = await getProductsByAdmin({
        page: currentPage,
        limit: itemsPerPage,
        query: params.query,
    });

    // console.log("Products data:", productsData);

    if (!productsData || productsData.products.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 text-sm">No se encontraron productos.</p>
            </div>
        );
    }

    return (
        <>
            <ProductsTable products={productsData} />

            <div className="pt-2">
                <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(productsData.totalProducts / itemsPerPage)}
                    limit={itemsPerPage}
                    pathname="/admin/products"
                />
            </div>
        </>
    );
}
