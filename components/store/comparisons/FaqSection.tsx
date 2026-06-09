// File: frontend/components/store/comparisons/FaqSection.tsx
import { ComparisonFAQ } from "@/src/schemas/comparison.schema";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { MessageCircleQuestion } from "lucide-react";

interface FaqSectionProps {
    items: ComparisonFAQ[];
}

export default function FaqSection({ items }: FaqSectionProps) {
    if (!items || items.length === 0) return null;

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
            "@type": "Question",
            name: item.pregunta,
            acceptedAnswer: { "@type": "Answer", text: item.respuesta },
        })),
    };

    return (
        <section className="space-y-4" aria-label="Preguntas frecuentes">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="flex items-center gap-3 border-b border-border pb-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted-neutral border border-border text-muted-foreground shrink-0">
                    <MessageCircleQuestion className="w-4 h-4" />
                </div>
                <h2 className="text-lg md:text-xl font-bold tracking-tight text-primary">
                    Respuestas Rápidas Frecuentes
                </h2>
            </div>

            <Accordion type="single" collapsible className="w-full divide-y divide-border border border-border rounded-xl bg-card px-4">
                {items.map((item, idx) => (
                    <AccordionItem
                        key={idx}
                        value={`faq-${idx}`}
                        className="border-0"
                    >
                        <AccordionTrigger className="text-left text-sm font-semibold text-foreground py-3.5 hover:no-underline hover:text-primary transition-colors">
                            {item.pregunta}
                        </AccordionTrigger>
                        <AccordionContent className="text-xs md:text-sm leading-relaxed text-muted-foreground pb-4 whitespace-pre-line">
                            {item.respuesta}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </section>
    );
}