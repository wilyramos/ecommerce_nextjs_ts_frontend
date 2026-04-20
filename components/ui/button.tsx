// File: frontend/components/ui/button.tsx

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[var(--color-action-primary)] focus-visible:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "bg-[var(--color-bg-inverse)] text-[var(--color-text-inverse)] shadow-sm hover:bg-[var(--color-text-primary)]",
                primary:
                    "bg-[var(--color-action-primary)] text-[var(--color-text-inverse)] shadow-sm hover:bg-[var(--color-action-primary-hover)]",
                accent:
                    "bg-[var(--color-accent-warm)] text-[var(--color-text-inverse)] shadow-sm hover:bg-[var(--color-accent-warm-hover)]",
                secondary:
                    "bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] border border-[var(--color-border-default)] shadow-sm hover:bg-[var(--color-surface-hover)] hover:border-[var(--color-border-strong)]",
                outline:
                    "bg-transparent text-[var(--color-text-primary)] border border-[var(--color-border-default)] hover:bg-[var(--color-bg-secondary)] hover:border-[var(--color-border-strong)]",
                ghost:
                    "text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] active:bg-[var(--color-surface-active)]",
                link:
                    "text-[var(--color-action-primary)] underline-offset-4 hover:underline",
                success:
                    "bg-[var(--color-success)] text-[var(--color-text-inverse)] shadow-sm hover:opacity-90",
                warning:
                    "bg-[var(--color-warning)] text-[var(--color-text-inverse)] shadow-sm hover:opacity-90",
                destructive:
                    "bg-[var(--color-error)] text-[var(--color-text-inverse)] shadow-sm hover:opacity-90",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-8 gap-1.5 px-3 text-xs",
                lg: "h-12 px-8 text-base",
                icon: "size-10 ",
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