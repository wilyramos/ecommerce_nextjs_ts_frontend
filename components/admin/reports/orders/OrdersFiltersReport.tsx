"use client";

import DateRangeDropdown from "@/components/admin/reports/FiltersReportsSales";
import { HeadingH2 } from "@/components/ui/Heading";
import {
    ArrowLeft,
    LayoutDashboard,
    Package,
    Users,
    ShoppingCart,
    DollarSign,
    BarChart3
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Tabs enfocados en filtros y reportes
const tabs = [
    { href: "/admin/reports/orders", label: "Vista General", icon: LayoutDashboard },
    { href: "/admin/reports/orders/status", label: "Por Estado", icon: ShoppingCart },
    { href: "/admin/reports/orders/payments", label: "Por Método de Pago", icon: DollarSign },
    { href: "/admin/reports/orders/payment-status", label: "Por Estado de Pago", icon: BarChart3 },
    { href: "/admin/reports/orders/products", label: "Por Productos", icon: Package },
    { href: "/admin/reports/orders/locations", label: "Por Ubicación", icon: Users },
];


export default function OrdersFiltersReport() {
    const pathname = usePathname();

    return (
        <div className="p-2">
            <aside className="mx-auto">
                {/* Botón de volver */}
                <Link
                    href="/admin/reports"
                    className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                    <ArrowLeft size={16} />
                    Volver a Reportes
                </Link>

                {/* Encabezado Principal */}
                <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 mb-2">
                    <HeadingH2>Reporte de Órdenes</HeadingH2>
                    <div className="mt-4 sm:mt-0">
                        <DateRangeDropdown />
                    </div>
                </header>

                {/* Navegación de Pestañas */}
                <div className="flex flex-wrap gap-2 border-b border-gray-200">
                    {tabs.map((tab) => {
                        const isActive = pathname === tab.href;
                        const Icon = tab.icon;
                        return (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                className={`flex items-center gap-2 px-5 py-2.5 text-sm rounded-t-lg transition-colors
                                    ${isActive
                                        ? "border-b-2 border-blue-600 text-blue-600 bg-white"
                                        : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
                                    }`}
                            >
                                <Icon size={18} />
                                {tab.label}
                            </Link>
                        );
                    })}
                </div>
            </aside>
        </div>
    );
}
