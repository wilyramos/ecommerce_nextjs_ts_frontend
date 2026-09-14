// File: frontend/components/ui/InputV3.tsx
'use client'

import * as React from "react"
import { cn } from "@/lib/utils"

interface InputV3Props extends React.ComponentProps<"input"> {
    label: string
    error?: string
}

function InputV3({ className, type, label, id, error, disabled, ...props }: InputV3Props) {
    const generatedId = React.useId()
    const inputId = id || generatedId

    return (
        <div className="relative flex w-full flex-col">
            <div className="relative w-full">
                <input
                    type={type}
                    id={inputId}
                    placeholder=" "
                    disabled={disabled}
                    data-slot="input"
                    aria-invalid={!!error || undefined}
                    aria-describedby={error ? `${inputId}-error` : undefined}
                    className={cn(
                        "peer h-12 w-full min-w-0 rounded-radius-md border border-border-primary bg-surface-primary px-3.5 pt-4.5 pb-1.5 text-sm font-normal text-text-primary transition-all duration-fast outline-none",
                        "hover:border-border-strong",
                        "focus-visible:border-brand-accent focus-visible:ring-1 focus-visible:ring-brand-accent",
                        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-surface-secondary disabled:border-border-secondary disabled:text-text-disabled",
                        "aria-invalid:border-status-error aria-invalid:focus-visible:border-status-error aria-invalid:focus-visible:ring-status-error",
                        className
                    )}
                    {...props}
                />

                <label
                    htmlFor={inputId}
                    className={cn(
                        "pointer-events-none absolute left-3.5 top-1.5 select-none text-[11px] font-normal tracking-normal text-text-tertiary transition-all duration-fast origin-left",
                        "peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-text-secondary",
                        "peer-focus:top-1.5 peer-focus:text-[11px] peer-focus:text-brand-accent",
                        "peer-disabled:text-text-disabled",
                        "peer-aria-invalid:text-status-error"
                    )}
                >
                    {label}
                </label>
            </div>

            {error && (
                <span
                    id={`${inputId}-error`}
                    role="alert"
                    className="mt-1.5 text-xs font-normal text-status-error"
                >
                    {error}
                </span>
            )}
        </div>
    )
}

export { InputV3 }