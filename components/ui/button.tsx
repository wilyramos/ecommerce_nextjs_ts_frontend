//File: frontend/components/ui/button.tsx

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
    {
        variants: {
            variant: {
                default:
                    "bg-[var(--color-bg-inverse)] text-[var(--color-text-inverse)] shadow-sm hover:bg-[var(--color-action-primary)] transition-colors",
                accent:
                    "bg-[var(--color-accent-warm)] text-[var(--color-text-inverse)] shadow-sm hover:bg-[var(--color-accent-warm-hover)] transition-colors",
                secondary:
                    "bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] border border-[var(--color-border-default)] shadow-sm hover:bg-[var(--color-surface-hover)] transition-colors",
                ghost:
                    "text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] transition-colors",
                link:
                    "text-[var(--color-accent-warm)] underline-offset-4 hover:text-[var(--color-accent-warm-hover)] hover:underline",
                success:
                    "bg-[var(--color-success)] text-[var(--color-text-inverse)] shadow-sm hover:opacity-90 transition-opacity",
                warning:
                    "bg-[var(--color-warning)] text-[var(--color-text-inverse)] shadow-sm hover:opacity-90 transition-opacity",
                destructive:
                    "bg-[var(--color-error)] text-[var(--color-text-inverse)] shadow-sm hover:opacity-90 transition-opacity",
            },
            size: {
                default: "h-9 px-4 py-2 has-[>svg]:px-3",
                sm: "h-8  gap-1.5 px-3 has-[>svg]:px-2.5",
                lg: "h-10  px-6 has-[>svg]:px-4",
                icon: "size-9",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

function Button({
    className,
    variant,
    size,
    asChild = false,
    ...props
}: React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean
    }) {
    const Comp = asChild ? Slot : "button"

    return (
        <Comp
            data-slot="button"
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        />
    )
}

export { Button, buttonVariants }