// File: frontend/components/store/comparisons/FaqSection.tsx

"use client";

import { useState } from "react";
import { ComparisonFAQ } from "@/src/schemas/comparison.schema";
import { H2, P, Small } from "@/components/ui/TypographyStore";
import { ChevronDown } from "lucide-react";

interface Props {
    items: ComparisonFAQ[];
}

export default function FaqSection({ items }: Props) {
    const [open, setOpen] = useState<number | null>(null);

    if (!items.length) return null;

    return (
        <section className="space-y-4">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        mainEntity: items.map((item) => ({
                            "@type": "Question",
                            name: item.pregunta,
                            acceptedAnswer: { "@type": "Answer", text: item.respuesta },
                        })),
                    }),
                }}
            />
            <H2 className="border-b border-border pb-2">
                Preguntas frecuentes
            </H2>
            <div className="divide-y divide-border border border-border bg-card">
                {items.map((item, i) => (
                    <div key={i}>
                        <button
                            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/20 transition-colors"
                            onClick={() => setOpen(open === i ? null : i)}
                            aria-expanded={open === i}
                        >
                            <P className="font-medium text-sm text-foreground">{item.pregunta}</P>
                            <ChevronDown
                                className="w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200"
                                style={{ transform: open === i ? "rotate(180deg)" : "rotate(0deg)" }}
                            />
                        </button>
                        {open === i && (
                            <div className="px-5 pb-4">
                                <Small className="text-muted-foreground leading-relaxed block">
                                    {item.respuesta}
                                </Small>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}