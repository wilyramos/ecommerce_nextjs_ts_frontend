// File: frontend/components/ui/Breadcrumbs.tsx

import Link from "next/link";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
    label: string;
    href: string;
}

interface Props {
    items: BreadcrumbItem[];
    current?: string;
    className?: string;
}

export default function Breadcrumbs({ items, current, className }: Props) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://gophone.pe";
    
    // Lógica de colapso si la ruta intermedia es muy larga
    const shouldCollapse = items.length > 3;
    const displayItems = shouldCollapse 
        ? [items[0], { label: "...", href: "#" }, items[items.length - 1]] 
        : items;

    // Se mantiene la estructura completa para SEO, incluyendo el item actual
    const schemaItems = [
        {
            "@type": "ListItem",
            "position": 1,
            "name": "Inicio",
            "item": baseUrl
        },
        ...items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 2,
            "name": item.label,
            "item": `${baseUrl}${item.href}`
        }))
    ];

    if (current) {
        schemaItems.push({
            "@type": "ListItem",
            "position": schemaItems.length + 1,
            "name": current,
            "item": typeof window !== "undefined" ? window.location.href : `${baseUrl}/#`
        });
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": schemaItems
    };

    return (
        <nav
            aria-label="Breadcrumb"
            className={cn("w-full overflow-hidden px-2 md:px-0", className)}
        >
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <ol className="flex items-center whitespace-nowrap overflow-hidden text-xs text-muted-foreground/80 font-medium">
                {/* Home */}
                <li className="flex items-center shrink-0">
                    <Link
                        href="/"
                        className="hover:text-action-cta transition-colors"
                        title="Ir al inicio"
                    >
                        Inicio
                    </Link>
                </li>

                {/* Items navegables de la jerarquía */}
                {displayItems.map((item, index) => (
                    <li key={`${item.label}-${index}`} className="flex items-center min-w-0">
                        <span className="mx-2 text-muted-foreground/40 select-none">/</span>
                        {item.label === "..." ? (
                            <span className="cursor-default tracking-widest text-muted-foreground/40 px-1">
                                ...
                            </span>
                        ) : (
                            <Link
                                href={item.href}
                                className="hover:text-action-cta truncate min-w-0 max-w-[120px] sm:max-w-[180px] transition-colors"
                            >
                                {item.label}
                            </Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}