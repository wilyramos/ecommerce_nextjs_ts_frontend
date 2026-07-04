// File: frontend/components/ui/InputV2.tsx
'use client'

import * as React from "react"
import { cn } from "@/lib/utils"

interface InputV2Props extends React.ComponentProps<"input"> {
  label: string
}

function InputV2({ className, type, label, id, ...props }: InputV2Props) {
  const generatedId = React.useId()
  const inputId = id || generatedId

  return (
    <div className="relative w-full group flex flex-col justify-end h-11">
      <input
        type={type}
        id={inputId}
        placeholder=" " // CRÍTICO: Debe ser un espacio en blanco para activar peer-placeholder-shown
        data-slot="input"
        className={cn(
          "peer h-11 w-full min-w-0 border bg-background border-border px-3 pt-4 pb-1 text-base md:text-xs transition-all outline-none rounded-md text-foreground",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          "focus-visible:border-ring focus-visible:ring-ring focus-visible:ring-[1px]",
          "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
          className
        )}
        {...props}
      />
      <label
        htmlFor={inputId}
        className={cn(
          // Posición fija cuando hay texto o está enfocado
          "absolute left-3 top-1 text-[10px] text-muted-foreground pointer-events-none transition-all origin-left select-none",
          
          // Posición y tamaño cuando el placeholder está visible (input vacío y sin foco)
          "peer-placeholder-shown:top-3 peer-placeholder-shown:text-xs",
          
          // Forzar que regrese al tamaño correcto al recibir foco o interacción, sin importar el viewport
          "peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-muted-foreground"
        )}
      >
        {label}
      </label>
    </div>
  )
}

export { InputV2 }