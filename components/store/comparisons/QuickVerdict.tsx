// File: frontend/components/store/comparisons/QuickVerdict.tsx

import { P, BadgeText } from "@/components/ui/TypographyStore";

interface Props {
    content: string;
}

export default function QuickVerdict({ content }: Props) {
    return (
        <div className="border border-border bg-muted/10 p-6 space-y-2">
            <BadgeText className="text-foreground font-semibold">
                Veredicto rápido
            </BadgeText>
            <P className="leading-relaxed">{content}</P>
        </div>
    );
}