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
    currentHref?: string; // Opcional: para pasar el enlace exacto del ítem actual
    className?: string;
}

export default function Breadcrumbs({ items, current, currentHref, className }: Props) {
    const [isExpanded, setIsExpanded] = useState(false);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://gophone.pe";

    // Determinamos la URL del ítem actual de forma determinista para SSR y Cliente
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
            className={cn("w-full overflow-hidden px-2 md:px-0", className)}
        >
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <ol className="flex items-center flex-wrap gap-1 text-xs text-muted-foreground/80 font-medium">
                {/* Inicio */}
                <li className="flex items-center shrink-0">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1 hover:text-action-cta transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-xs"
                        title="Ir al inicio"
                    >
                        <Home className="w-3.5 h-3.5 shrink-0" />
                        <span className="hidden sm:inline">Inicio</span>
                    </Link>
                </li>

                {/* Items intermedios */}
                {items.map((item, index) => {
                    const isFirst = index === 0;
                    const isLast = index === items.length - 1;
                    const isMiddle = !isFirst && !isLast;

                    return (
                        <li
                            key={`${item.label}-${index}`}
                            className={cn(
                                "flex items-center min-w-0 shrink-0 md:shrink",
                                isMiddle && !isExpanded && "hidden md:flex"
                            )}
                        >
                            <ChevronRight className="w-3.5 h-3.5 mx-1 text-muted-foreground/40 shrink-0 select-none" />

                            {isFirst && hasMiddleItems && !isExpanded && (
                                <button
                                    type="button"
                                    onClick={() => setIsExpanded(true)}
                                    className="md:hidden flex items-center px-1 py-0.5 rounded bg-muted/40 hover:bg-muted text-muted-foreground transition-colors mr-1 text-[10px] leading-none"
                                    title="Mostrar ruta completa"
                                >
                                    ...
                                </button>
                            )}

                            <Link
                                href={item.href}
                                className="hover:text-action-cta transition-colors truncate min-w-0 max-w-[130px] sm:max-w-[200px] md:max-w-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-xs"
                            >
                                {item.label}
                            </Link>
                        </li>
                    );
                })}

                {/* Ítem actual */}
                {current && (
                    <li className="flex items-center min-w-0 shrink">
                        <ChevronRight className="w-3.5 h-3.5 mx-1 text-muted-foreground/40 shrink-0 select-none" />
                        <span
                            className="font-semibold text-foreground truncate min-w-0 max-w-[150px] sm:max-w-[280px] md:max-w-[400px] lg:max-w-none"
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