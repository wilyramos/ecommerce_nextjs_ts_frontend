// File: src/components/ui/Breadcrumbs.tsx
import Link from "next/link";
import { LuChevronRight } from "react-icons/lu";

export default function Breadcrumbs({ segments, current }: { segments: {label: string, href: string}[], current?: string }) {
    // Generamos el esquema para Google
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Inicio",
                "item": `${process.env.NEXT_PUBLIC_BASE_URL}`
            },
            ...segments.map((s, i) => ({
                "@type": "ListItem",
                "position": i + 2,
                "name": s.label,
                "item": `${process.env.NEXT_PUBLIC_BASE_URL}${s.href}`
            }))
        ]
    };

    return (
        <nav className="text-sm text-[var(--store-text-muted)] mb-4">
            {/* Inyectamos el JSON-LD para Google */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ol className="flex items-center gap-1">
                <li><Link href="/" className="hover:underline">Inicio</Link></li>
                {segments.map((s, i) => (
                    <li key={i} className="flex items-center gap-1">
                        <LuChevronRight size={14} />
                        <Link href={s.href} className="hover:underline">{s.label}</Link>
                    </li>
                ))}
                {current && (
                    <li className="flex items-center gap-1 text-[var(--store-text)] font-medium">
                        <LuChevronRight size={14} />
                        <span>{current}</span>
                    </li>
                )}
            </ol>
        </nav>
    );
}