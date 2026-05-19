// File: frontend/components/ui/button.tsx

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    {
        variants: {
            variant: {
                // Botón Identidad de Marca (#F97316)
                default:
                    "bg-primary text-primary-foreground shadow-sm hover:opacity-95 hover:shadow-md",
                
                // Botón de Conversión Exclusivo / Carrito (#EA580C)
                primary:
                    "bg-action-cta text-action-cta-foreground shadow-md font-semibold hover:bg-action-cta-hover focus-visible:ring-action-cta",
                
                // Botón de Contraste Oscuro
                accent:
                    "bg-foreground text-background shadow-sm hover:opacity-90",
                
                // Botón Suave sobre Fondo Claro de Marca (#FFEDD5)
                secondary:
                    "bg-secondary text-secondary-foreground border border-border/40 shadow-sm hover:bg-secondary/80",
                
                // Botón de Contorno Estructural
                outline:
                    "bg-transparent text-foreground border border-border hover:bg-secondary hover:text-secondary-foreground",
                
                // Botón Limpio sin Fondo
                ghost:
                    "text-foreground hover:bg-secondary hover:text-secondary-foreground active:bg-muted",
                
                // Enlace de Conversión Focalizado
                link:
                    "text-action-cta underline-offset-4 hover:underline font-medium",
                
                // Estados de Transacción y Catálogo
                success:
                    "bg-success text-primary-foreground shadow-sm hover:opacity-90 focus-visible:ring-success",
                warning:
                    "bg-warning text-primary-foreground shadow-sm hover:opacity-90 focus-visible:ring-warning",
                destructive:
                    "bg-destructive text-destructive-foreground shadow-sm hover:opacity-90 focus-visible:ring-destructive",
            },
            size: {
                default: "h-10 px-4 py-2 rounded-md",
                sm: "h-8 gap-1.5 px-3 text-xs rounded-sm",
                lg: "h-12 px-8 text-base rounded-lg",
                icon: "size-10 rounded-md",
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