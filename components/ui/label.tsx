"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"

import { cn } from "@/lib/utils"

interface LabelProps extends React.ComponentProps<typeof LabelPrimitive.Root> {
  required?: boolean
}

function Label({
  className,
  children,
  required,
  ...props
}: LabelProps) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        // Base styles simplificados para un look administrativo minimalista
        "flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-foreground select-none",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
      {required && (
        <span 
          className="text-destructive font-black" 
          aria-hidden="true"
        >
          *
        </span>
      )}
    </LabelPrimitive.Root>
  )
}

export { Label }