"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PageSizeSelectorProps {
    currentLimit: number;
    options?: number[];
}

export default function PageSizeSelector({ 
    currentLimit, 
    options = [10, 20, 50, 100] 
}: PageSizeSelectorProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("limit", value);
        params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground select-none">
            <span>Filas por página:</span>
            <Select value={currentLimit.toString()} onValueChange={handleChange}>
                <SelectTrigger className="h-7 w-[70px] bg-background text-xs text-foreground font-semibold border-border/80 rounded-sm">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent className="min-w-[70px] rounded-sm">
                    {options.map((size) => (
                        <SelectItem key={size} value={size.toString()} className="text-xs">
                            {size}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}