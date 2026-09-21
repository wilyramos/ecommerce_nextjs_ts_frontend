//File: frontend/components/ui/Breadcrumbs.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
    label: string;
    href: string;
}

interface Props {
    items: BreadcrumbItem[];
    current?: string;
    currentHref?: string; 
    className?: string;
}

export default function Breadcrumbs({ items, current, currentHref, className }: Props) {
    const [isExpanded, setIsExpanded] = useState(false);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://gophone.pe";

    const lastItemHref = items.length > 0 ? items[items.length - 1].href : "";
    const activeUrl = currentHref
        ? `${baseUrl}${currentHref}`
        : `${baseUrl}${lastItemHref}`;

    const schemaItems = [
        {
            "@type": "ListItem",
            "position": 1,
            "name": "Inicio",
            "item": baseUrl,
        },
        ...items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 2,
            "name": item.label,
            "item": `${baseUrl}${item.href}`,
        })),
    ];

    if (current) {
        schemaItems.push({
            "@type": "ListItem",
            "position": schemaItems.length + 1,
            "name": current,
            "item": activeUrl,
        });
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": schemaItems,
    };

    const hasMiddleItems = items.length > 2;

    return (
        <nav
            aria-label="Breadcrumb"
            className={cn("w-full overflow-hidden", className)}
        >
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <ol className="flex items-center flex-nowrap whitespace-nowrap overflow-x-auto scrollbar-none py-0.5 text-xs text-text-secondary font-medium">
                <li className="flex items-center shrink-0">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1 hover:text-brand-accent transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-accent rounded-xs"
                        title="Ir al inicio"
                    >
                        <Home className="w-3.5 h-3.5 shrink-0" />
                    </Link>
                </li>

                {items.map((item, index) => {
                    const isFirst = index === 0;
                    const isLast = index === items.length - 1;
                    const isMiddle = !isFirst && !isLast;

                    return (
                        <li
                            key={`${item.label}-${index}`}
                            className={cn(
                                "flex items-center shrink-0 min-w-0",
                                isMiddle && !isExpanded && "hidden md:flex"
                            )}
                        >
                            <ChevronRight className="w-3.5 h-3.5 mx-1 text-text-disabled shrink-0 select-none" />

                            {isFirst && hasMiddleItems && !isExpanded && (
                                <button
                                    type="button"
                                    onClick={() => setIsExpanded(true)}
                                    className="md:hidden flex items-center px-1 py-0.5 rounded bg-surface-secondary hover:bg-surface-tertiary text-text-secondary transition-colors mr-1 text-[10px] leading-none shrink-0"
                                    title="Mostrar ruta completa"
                                >
                                    ...
                                </button>
                            )}

                            <Link
                                href={item.href}
                                className="hover:text-brand-accent transition-colors truncate max-w-[100px] xs:max-w-[130px] sm:max-w-[200px] md:max-w-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-accent rounded-xs"
                            >
                                {item.label}
                            </Link>
                        </li>
                    );
                })}

                {current && (
                    <li className="flex items-center shrink min-w-0">
                        <ChevronRight className="w-3.5 h-3.5 mx-1 text-text-disabled shrink-0 select-none" />
                        <span
                            className="font-semibold text-text-primary truncate max-w-[120px] xs:max-w-[180px] sm:max-w-[280px] md:max-w-[400px] lg:max-w-none"
                            aria-current="page"
                            title={current}
                        >
                            {current}
                        </span>
                    </li>
                )}
            </ol>
        </nav>
    );
}