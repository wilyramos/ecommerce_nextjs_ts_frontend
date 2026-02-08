import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
    label: string;
    href: string;
}

interface Props {
    items: BreadcrumbItem[];
    current?: string; // La página actual (no clicable)
    className?: string;
}

export default function Breadcrumbs({ items, current, className }: Props) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://gophone.pe";

    // --- Generación de Schema.org (JSON-LD) para SEO ---
    const schemaItems = [
        // 1. Inicio siempre es el primero
        {
            "@type": "ListItem",
            "position": 1,
            "name": "Inicio",
            "item": baseUrl
        },
        // 2. Segmentos intermedios
        ...items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 2,
            "name": item.label,
            "item": `${baseUrl}${item.href}`
        }))
    ];

    // 3. Si hay página actual, la añadimos al schema
    if (current) {
        schemaItems.push({
            "@type": "ListItem",
            "position": schemaItems.length + 1,
            "name": current,
            "item": typeof window !== 'undefined' ? window.location.href : `${baseUrl}/#` // Fallback seguro
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
            className={cn("w-full overflow-hidden", className)}
        >
            {/* Inyección SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <ol className="flex items-center whitespace-nowrap overflow-x-auto py-2 no-scrollbar text-xs text-[var(--store-text-muted)]">

                {/* Home Icon */}
                <li className="flex items-center shrink-0">
                    <Link
                        href="/"
                        className="flex items-center gap-1 hover:text-[var(--store-primary)] transition-colors"
                        title="Ir al inicio"
                    >
                        <Home className="w-3.5 h-3.5 mb-0.5" />
                        <span className="sr-only">Inicio</span>
                    </Link>
                </li>

                {/* Items Intermedios */}
                {items.map((item, index) => (
                    <li key={`${item.label}-${index}`} className="flex items-center shrink-0">
                        <ChevronRight className="w-3 h-3 mx-2 text-gray-300 shrink-0" />
                        <Link
                            href={item.href}
                            className="hover:text-[var(--store-primary)] hover:underline decoration-1 underline-offset-2 transition-all font-medium"
                        >
                            {item.label}
                        </Link>
                    </li>
                ))}

                {/* Página Actual */}
                {current && (
                    <li className="flex items-center shrink-0">
                        <ChevronRight className="w-3 h-3 mx-2 text-gray-300 shrink-0" />
                        <span
                            className="font-bold text-[var(--store-text)] truncate max-w-[200px] sm:max-w-none"
                            aria-current="page"
                        >
                            {current}
                        </span>
                    </li>
                )}
            </ol>
        </nav>
    );
}