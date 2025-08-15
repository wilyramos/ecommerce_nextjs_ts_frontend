import { redirect } from "next/navigation";


export default async function AdminPage() {
    // const sales = await fetchSalesData();
        redirect("/admin/reports");

    
    // redirect to the sales

    return (
        <div className="p-6 space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">Accesos rapidos</h1>
        </div>  
    );
}
