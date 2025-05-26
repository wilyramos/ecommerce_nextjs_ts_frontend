import { getOrders } from "@/src/services/orders";




type PageOrdersProps = {
    searchParams: Promise<{
        page?: string;
        limit?: string;
    }>;
};

export default async function pageOrders({ searchParams }: PageOrdersProps) {

    const params = await searchParams;

    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;

    // Get orders from the backend

    const orders = await getOrders({ page, limit });

    console.log("Orders:", orders);

    return (
        <>
            <h1>Orders</h1>
            <p>Page: {page}</p>
            <p>Limit: {limit}</p>
        </>
    )
}
