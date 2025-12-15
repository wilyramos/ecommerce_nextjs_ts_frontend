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
        <div className="flex items-center gap-1">
            <Label htmlFor={htmlFor}>
                {label}
                {required && <span className="text-red-500 ml-0.5">*</span>}
            </Label>

            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            type="button"
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <Info className="h-3 w-3" />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs text-xs">
                        {tooltip}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
}
