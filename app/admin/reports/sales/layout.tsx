"use client";

import { HeadingH2 } from "@/components/ui/Heading";
import Link from "next/link";
import { usePathname } from "next/navigation";
import DateRangeDropdown from "@/components/admin/reports/FiltersReportsSales";

const tabs = [
    { href: "/admin/reports/sales", label: "Vista general" },
    { href: `/admin/reports/sales/products`, label: "Productos" },
    { href: "/admin/reports/sales/vendors", label: "Vendedores" },
];

export default function SalesReportLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="flex flex-col ">
            <aside>
                {/* Header */}
                <div className="py-4">
                    <HeadingH2>Reporte de Ventas</HeadingH2>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap mb-8 border-b border-gray-200 ">
                    {tabs.map((tab) => {
                        const isActive = pathname === tab.href;
                        return (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                className={`px-1 md:px-4 py-2 text-xs md:text-sm font-medium transition-colors border-b-2 ${isActive
                                    ? "border-blue-600 text-blue-600"
                                    : "border-transparent text-gray-600 hover:border-blue-600 hover:text-blue-600 hover:bg-gray-200"
                                    }`}
                            >
                                {tab.label}
                            </Link>
                        );
                    })}
                </div>

                {/* Filtros */}
                <div className="">
                    <DateRangeDropdown />
                </div>

            </aside>

            {/* Contenido principal */}
            <main className="flex-1 overflow-y-auto p-2 md:p-4">{children}</main>
        </div>
    );
}
