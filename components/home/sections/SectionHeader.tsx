interface SectionHeaderProps {
    title: string;
}

export default function SectionHeader({ title }: SectionHeaderProps) {
    return (
        <div className="flex items-center gap-4 text-action-cta">
            <h2 className="text-xl md:text-xl font-semibold tracking-tight text-foreground whitespace-nowrap">
                {title}
            </h2>
        </div>
    );
}