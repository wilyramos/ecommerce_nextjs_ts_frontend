// File: frontend/components/ui/ButtonV3.tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"

const buttonV3Variants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 select-none whitespace-nowrap text-sm font-medium transition-all duration-fast outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-primary disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-button-primary-disabled disabled:text-text-disabled [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // CTA Principal: Negro absoluto Apple
        default:
          "bg-button-primary-bg text-button-primary-text hover:bg-button-primary-hover active:scale-[0.98]",

        // Soporte / Comparar / Añadir secundario
        secondary:
          "border border-border-primary/80 bg-button-secondary-bg text-button-secondary-text hover:bg-button-secondary-hover hover:border-border-strong active:scale-[0.98] disabled:bg-button-secondary-disabled disabled:border-border-secondary",

        // Azul Interactivo / Confirmación
        accent:
          "bg-button-accent-bg text-button-accent-text hover:bg-button-accent-hover active:scale-[0.98] disabled:bg-button-accent-disabled",

        // Contorno fino
        outline:
          "border border-border-primary bg-surface-primary text-text-primary hover:bg-surface-secondary hover:border-border-strong active:scale-[0.98] disabled:border-border-secondary disabled:bg-surface-tertiary",

        // Estados críticos / Sin stock / Destructivo
        destructive:
          "bg-status-error text-text-inverse hover:bg-status-error/90 focus-visible:ring-status-error active:scale-[0.98] disabled:bg-button-primary-disabled",

        // Minimalista sin fondo
        ghost:
          "text-text-primary hover:bg-surface-secondary hover:text-text-primary active:scale-[0.98]",

        // Enlace inline limpio
        link:
          "h-auto p-0 text-brand-accent underline-offset-4 hover:underline focus-visible:ring-0 focus-visible:ring-offset-0",
      },
      size: {
        default: "h-11 rounded-radius-md px-5 py-2.5",
        xs: "h-7 gap-1 rounded-radius-sm px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-1.5 rounded-radius-sm px-3.5 text-xs",
        lg: "h-12 rounded-radius-lg px-7 text-base font-semibold",
        full: "h-11 w-full rounded-radius-md px-5",
        icon: "size-10 rounded-radius-md",
        "icon-xs": "size-7 rounded-radius-sm [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-9 rounded-radius-sm",
        "icon-lg": "size-11 rounded-radius-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonV3Props
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonV3Variants> {
  asChild?: boolean
}

function ButtonV3({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: ButtonV3Props) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button-v3"
      data-variant={variant}
      data-size={size}
      className={cn(buttonV3Variants({ variant, size, className }))}
      {...props}
    />
  )
}

export { ButtonV3, buttonV3Variants }