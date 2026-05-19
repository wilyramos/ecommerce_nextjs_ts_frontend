import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer size-4 shrink-0 rounded-sm border border-border shadow-2xs transition-colors outline-none",
        "data-[state=checked]:bg-action-cta data-[state=checked]:border-action-cta data-[state=checked]:text-primary-foreground",
        "focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-muted-foreground",
        "disabled:cursor-not-allowed disabled:opacity-40",
        "aria-invalid:border-destructive aria-invalid:ring-0",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon className="size-3" strokeWidth={3} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }