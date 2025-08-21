"use client"

import DateRangeDropdown from "@/components/admin/reports/FiltersReportsSales";
import { HeadingH2 } from "@/components/ui/Heading";
import { ArrowLeft, LayoutDashboard, Package, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";


const tabs = [
    { href: "/admin/reports/sales", label: "Vista general", icon: LayoutDashboard },
    { href: `/admin/reports/sales/products`, label: "Productos", icon: Package },
    { href: "/admin/reports/sales/vendors", label: "Vendedores", icon: Users },
];

export default function SalesButtonsFilter() {
    const pathname = usePathname();

    return (
        <aside className="p-2">
            {/* Back Button */}
            <Link
                href="/admin/reports"
                className="inline-flex items-center gap-2 text-xs text-gray-600 hover:text-blue-600 transition-colors mb-4"
            >
                <ArrowLeft size={16} />
                Volver a Reportes
            </Link>

            {/* Header */}
            <div className="py-2">
                <HeadingH2>Reporte de Ventas</HeadingH2>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap mb-8 border-b border-gray-200">
                {tabs.map((tab) => {
                    const isActive = pathname === tab.href;
                    const Icon = tab.icon;
                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2
                                    ${isActive
                                    ? "border-blue-600 text-blue-600 bg-gray-50"
                                    : "border-transparent text-gray-600 hover:border-blue-600 hover:text-blue-600 hover:bg-gray-100"
                                }`}
                        >
                            <Icon size={16} />
                            {tab.label}
                        </Link>
                    );
                })}
            </div>

            {/* Filters */}
            <div>
                <DateRangeDropdown />
            </div>
        </aside>
    )
}
