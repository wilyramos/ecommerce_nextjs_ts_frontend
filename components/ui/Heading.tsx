import { cn } from "@/lib/utils";

export function HeadingH1({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <h1
            className={cn(
                "text-xl md:text-2xl font-bold tracking-tight text-gray-700",
                " pb-1",
                className
            )}
        >
            {children}
        </h1>
    );
}

export function HeadingH2({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <h2
            className={cn(
                "text-lg md:text-xl font-semibold tracking-tight text-gray-600",
                " pl-2",
                className
            )}
        >
            {children}
        </h2>
    );
}

export function HeadingH3({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <h3
            className={cn(
                "text-base font-medium text-gray-500 tracking-tight",
                "border-b border-gray-300 pb-1",
                className
            )}
        >
            {children}
        </h3>
    );
}
