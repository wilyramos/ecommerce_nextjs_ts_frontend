import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-[var(--radius-sm)] border font-semibold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring transition-colors overflow-hidden select-none",
  {
    variants: {
      variant: {
        // ── Standard Shadcn ──
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border-border bg-transparent text-foreground",

        // ── Semánticos & Estados de Órdenes / E-commerce ──
        success:
          "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 dark:border-emerald-500/30",
        warning:
          "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400 dark:border-amber-500/30",
        info:
          "border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-400 dark:border-blue-500/30",
        purple:
          "border-purple-500/20 bg-purple-500/10 text-purple-700 dark:text-purple-400 dark:border-purple-500/30",
        orange:
          "border-orange-500/20 bg-orange-500/10 text-orange-700 dark:text-orange-400 dark:border-orange-500/30",
        rose:
          "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-400 dark:border-rose-500/30",
        neutral:
          "border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300",
        
        // ── Solidos para resaltados fuertes ──
        "solid-success":
          "border-transparent bg-emerald-600 text-white font-bold",
        "solid-warning":
          "border-transparent bg-amber-500 text-slate-950 font-bold",
        "solid-info":
          "border-transparent bg-blue-600 text-white font-bold",
      },
      size: {
        sm: "px-1.5 py-0.2 text-[10px] [&>svg]:size-2.5 gap-0.5",
        md: "px-2 py-0.5 text-xs [&>svg]:size-3 gap-1",
        lg: "px-2.5 py-1 text-xs [&>svg]:size-3.5 gap-1.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface BadgeProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean
}

function Badge({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }