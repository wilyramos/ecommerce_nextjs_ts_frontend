import Link from "next/link";
import {
    Package,
    Users,
    Tag,
    Receipt,
    BarChart3,
    ShoppingCart,
} from "lucide-react";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";

export default async function AdminPage() {


    const links = [
        { href: "/admin/products", label: "Productos", icon: Package },
        { href: "/admin/clients", label: "Clientes", icon: Users },
        { href: "/admin/products/category", label: "Categorías", icon: Tag },
        { href: "/admin/orders", label: "Órdenes", icon: Receipt },
        { href: "/admin/reports", label: "Reportes", icon: BarChart3 },
        { href: "/admin/brands", label: "Marcas", icon: Tag },
        { href: "/pos", label: "POS", icon: ShoppingCart },
    ];

    return (

        <AdminPageWrapper

            title="Panel de administración"
            showBackButton={false}
        >
            <div className="p-4 space-y-8">

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">

                    {links.map(({ href, label, icon: Icon }) => (
                        <Link
                            key={href}
                            href={href}
                            className="flex items-center gap-3 p-4  border bg-card hover:bg-muted/30 transition-colors"
                        >
                            <Icon className="h-6 w-6 text-muted-foreground" />
                            <span className="text-sm font-medium">{label}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </AdminPageWrapper>
    );
}
