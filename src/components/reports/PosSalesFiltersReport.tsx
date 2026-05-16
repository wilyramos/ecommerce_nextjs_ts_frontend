"use client";

import DateRangeDropdown from "@/components/admin/reports/FiltersReportsSales";
import { LayoutDashboard, Package, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
    { href: "/reports", label: "General", icon: LayoutDashboard },
    { href: "/reports/products", label: "Productos", icon: Package },
    { href: "/reports/vendors", label: "Vendedores", icon: Users },
];

export default function PosSalesFiltersReport() {
    const pathname = usePathname();

    return (
        <div className="p-4 bg-white border-b">
           
            <header className="flex flex-col sm:flex-row sm:items-end justify-end mb-4 gap-4">
                {/* <HeadingH2>Reportes de Ventas</HeadingH2> */}
                <DateRangeDropdown />
            </header>

            <div className="flex overflow-x-auto border-b border-gray-200">
                <div className="flex gap-4">
                    {tabs.map((tab) => {
                        const isActive = pathname === tab.href;
                        const Icon = tab.icon;
                        return (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-all
                                ${isActive 
                                    ? "border-blue-600 text-blue-600" 
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                            >
                                <Icon size={18} />
                                {tab.label}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}