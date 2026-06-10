// File: frontend/components/store/comparisons/FaqSection.tsx
"use client";

import { useState } from "react";
import { ComparisonFAQ } from "@/src/schemas/comparison.schema";
import { H2 } from "@/components/ui/Typography";
import { ChevronDown } from "lucide-react";

interface Props {
    items: ComparisonFAQ[];
}

export default function FaqSection({ items }: Props) {
    const [open, setOpen] = useState<number | null>(null);

    if (!items.length) return null;

    return (
        <section className="space-y-4">
            {/* JSON-LD para Google featured snippets */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type":    "FAQPage",
                        mainEntity: items.map(item => ({
                            "@type":          "Question",
                            name:             item.pregunta,
                            acceptedAnswer:   { "@type": "Answer", text: item.respuesta },
                        })),
                    }),
                }}
            />
            <H2 className="text-xl font-bold tracking-tight border-b border-border pb-2 text-primary">
                Preguntas frecuentes
            </H2>
            <div className="divide-y divide-border rounded-xl border border-border bg-card overflow-hidden">
                {items.map((item, i) => (
                    <div key={i}>
                        <button
                            className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium hover:bg-muted-neutral transition-colors text-foreground"
                            onClick={() => setOpen(open === i ? null : i)}
                            aria-expanded={open === i}
                        >
                            <span>{item.pregunta}</span>
                            <ChevronDown
                                className="w-4 h-4 text-muted-foreground shrink-0 transition-transform"
                                style={{ transform: open === i ? "rotate(180deg)" : "rotate(0deg)" }}
                            />
                        </button>
                        {open === i && (
                            <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">
                                {item.respuesta}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}