// File: frontend/components/store/comparisons/QuickVerdict.tsx

interface Props {
    content: string;
}

export default function QuickVerdict({ content }: Props) {
    return (
        <div className="border-l-4 border-primary bg-primary/5 rounded-r-xl px-6 py-5">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
                Veredicto rápido
            </p>
            <p className="text-base leading-relaxed text-foreground">{content}</p>
        </div>
    );
}