import Link from "next/link";
import {
    Package,
    Users,
    Tag,
    Receipt,
    BarChart3,
    ShoppingCart,
} from "lucide-react";

export default async function AdminPage() {
    return (
        <div className="p-6 space-y-8">

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <Link
                    href="/admin/products"
                    className="flex items-center gap-3 p-4 rounded-xl bg-white border hover:bg-gray-100 transition"
                >
                    <Package className="h-6 w-6 text-gray-700" />
                    <span className="font-semibold text-gray-800">Productos</span>
                </Link>

                <Link
                    href="/admin/clients"
                    className="flex items-center gap-3 p-4 rounded-xl bg-white border hover:bg-gray-100 transition"
                >
                    <Users className="h-6 w-6 text-gray-700" />
                    <span className="font-semibold text-gray-800">Clientes</span>
                </Link>

                <Link
                    href="/admin/products/category"
                    className="flex items-center gap-3 p-4 rounded-xl bg-white border hover:bg-gray-100 transition"
                >
                    <Tag className="h-6 w-6 text-gray-700" />
                    <span className="font-semibold text-gray-800">Categorías</span>
                </Link>

                <Link
                    href="/admin/orders"
                    className="flex items-center gap-3 p-4 rounded-xl bg-white border hover:bg-gray-100 transition"
                >
                    <Receipt className="h-6 w-6 text-gray-700" />
                    <span className="font-semibold text-gray-800">Órdenes</span>
                </Link>

                <Link
                    href="/admin/reports"
                    className="flex items-center gap-3 p-4 rounded-xl bg-white border hover:bg-gray-100 transition"
                >
                    <BarChart3 className="h-6 w-6 text-gray-700" />
                    <span className="font-semibold text-gray-800">Reportes</span>
                </Link>

                <Link
                    href="/admin/brands"
                    className="flex items-center gap-3 p-4 rounded-xl bg-white border hover:bg-gray-100 transition"
                >
                    <Tag className="h-6 w-6 text-gray-700" />
                    <span className="font-semibold text-gray-800">Marcas</span>
                </Link>

                <Link
                    href="/pos"
                    className="flex items-center gap-3 p-4 rounded-xl bg-white border hover:bg-gray-100 transition"
                >
                    <ShoppingCart className="h-6 w-6 text-gray-700" />
                    <span className="font-semibold text-gray-800">POS</span>
                </Link>
            </div>
        </div>
    );
}
