import { DashboardCard } from "@/components/admin/dashboard/DashboardCard";
import { ShoppingCart, Users, PackageCheck, BarChart } from 'lucide-react';
import { redirect } from "next/navigation";

export default async function AdminPage() {
    // Aquí podrías hacer fetch a tus endpoints (por ejemplo, desde Express API)
    // const sales = await fetchSalesData();

    // redirect to the sales

    return (
        <div className="p-6 space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">Accesos rapidos</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardCard
                    title="Ventas hoy"
                    value="$2,450"
                    icon={<BarChart className="h-6 w-6 text-white" />}
                    bgColor="bg-gradient-to-r from-purple-500 to-indigo-500"
                />
                <DashboardCard
                    title="Pedidos"
                    value="120"
                    icon={<ShoppingCart className="h-6 w-6 text-white" />}
                    bgColor="bg-gradient-to-r from-pink-500 to-red-500"
                />
                <DashboardCard
                    title="Envíos completados"
                    value="98"
                    icon={<PackageCheck className="h-6 w-6 text-white" />}
                    bgColor="bg-gradient-to-r from-green-500 to-emerald-500"
                />
                <DashboardCard
                    title="Usuarios nuevos"
                    value="35"
                    icon={<Users className="h-6 w-6 text-white" />}
                    bgColor="bg-gradient-to-r from-yellow-400 to-orange-500"
                />
            </div>
        </div>
    );
}
