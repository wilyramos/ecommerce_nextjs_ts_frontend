// File: frontend/components/store/comparisons/QuickVerdict.tsx

interface QuickVerdictProps {
    content?: string;
}

export default function QuickVerdict({ content }: QuickVerdictProps) {
    if (!content) return null;

    return (
        <section
            aria-label="Veredicto del equipo editorial"
            className="relative rounded-xl border border-action-cta/30 bg-action-cta/5 overflow-hidden"
        >
            {/* Franja lateral de acento */}
            <div className="absolute left-0 inset-y-0 w-1 bg-action-cta rounded-l-xl" />

            <div className="p-6 md:p-8 pl-8 md:pl-10">
                <p className="text-xs md:text-sm text-foreground/90 leading-relaxed whitespace-pre-line font-medium">
                    {content}
                </p>
            </div>
        </section>
    );
}