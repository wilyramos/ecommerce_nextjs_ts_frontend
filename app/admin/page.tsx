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

            <h1 className="text-2xl font-semibold">Panel de administración</h1>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

                <Link
                    href="/admin/products"
                    className="flex items-center gap-3 p-4 rounded-xl border bg-card hover:bg-muted/30 transition-colors"
                >
                    <Package className="h-6 w-6 text-muted-foreground" />
                    <span className="text-sm font-medium">Productos</span>
                </Link>

                <Link
                    href="/admin/clients"
                    className="flex items-center gap-3 p-4 rounded-xl border bg-card hover:bg-muted/30 transition-colors"
                >
                    <Users className="h-6 w-6 text-muted-foreground" />
                    <span className="text-sm font-medium">Clientes</span>
                </Link>

                <Link
                    href="/admin/products/category"
                    className="flex items-center gap-3 p-4 rounded-xl border bg-card hover:bg-muted/30 transition-colors"
                >
                    <Tag className="h-6 w-6 text-muted-foreground" />
                    <span className="text-sm font-medium">Categorías</span>
                </Link>

                <Link
                    href="/admin/orders"
                    className="flex items-center gap-3 p-4 rounded-xl border bg-card hover:bg-muted/30 transition-colors"
                >
                    <Receipt className="h-6 w-6 text-muted-foreground" />
                    <span className="text-sm font-medium">Órdenes</span>
                </Link>

                <Link
                    href="/admin/reports"
                    className="flex items-center gap-3 p-4 rounded-xl border bg-card hover:bg-muted/30 transition-colors"
                >
                    <BarChart3 className="h-6 w-6 text-muted-foreground" />
                    <span className="text-sm font-medium">Reportes</span>
                </Link>

                <Link
                    href="/admin/brands"
                    className="flex items-center gap-3 p-4 rounded-xl border bg-card hover:bg-muted/30 transition-colors"
                >
                    <Tag className="h-6 w-6 text-muted-foreground" />
                    <span className="text-sm font-medium">Marcas</span>
                </Link>

                <Link
                    href="/pos"
                    className="flex items-center gap-3 p-4 rounded-xl border bg-card hover:bg-muted/30 transition-colors"
                >
                    <ShoppingCart className="h-6 w-6 text-muted-foreground" />
                    <span className="text-sm font-medium">POS</span>
                </Link>

            </div>
        </div>
    );
}
