//File: frontend/components/utils/LabelWithTooltip.tsx
import { Label } from "@/components/ui/label";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface LabelWithTooltipProps {
    htmlFor: string;
    label: string;
    required?: boolean;
    tooltip: string;
}

export function LabelWithTooltip({
    htmlFor,
    label,
    required,
    tooltip,
}: LabelWithTooltipProps) {
    return (
        <div className="flex items-center gap-2">
            <Label htmlFor={htmlFor} required={required}>
                {label}
            </Label>

            <TooltipProvider>
                <Tooltip delayDuration={200}>
                    <TooltipTrigger asChild>
                        <button
                            type="button"
                            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors outline-none"
                        >
                            <Info className="h-3 w-3" />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs text-[11px] font-medium bg-foreground text-background border-none px-2.5 py-1.5 rounded-sm">
                        {tooltip}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
}