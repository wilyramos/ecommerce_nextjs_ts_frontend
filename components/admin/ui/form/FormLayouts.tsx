// File: frontend/components/admin/ui/form/FormLayouts.tsx
"use client";

import React from "react";
import { ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

// ── 1. SECCIÓN DE FORMULARIO ────────────────────────────────────────────────
export interface FormSectionProps {
    title: string;
    description?: string;
    action?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}

export const FormSection: React.FC<FormSectionProps> = ({
    title,
    description,
    action,
    children,
    className,
}) => {
    return (
        <div className={cn("border border-zinc-200 bg-white p-5 space-y-4", className)}>
            <div className="flex items-start justify-between border-b border-zinc-100 pb-3">
                <div>
                    <h3 className="text-[13px] font-bold uppercase tracking-wider text-zinc-900">{title}</h3>
                    {description && <p className="text-[12px] text-zinc-500 mt-0.5">{description}</p>}
                </div>
                {action && <div>{action}</div>}
            </div>
            <div className="space-y-4 pt-1">{children}</div>
        </div>
    );
};

// ── 2. GRID CONFIGURABLE ────────────────────────────────────────────────────
export interface FormGridProps {
    cols?: 1 | 2 | 3 | 4;
    children: React.ReactNode;
    className?: string;
}

export const FormGrid: React.FC<FormGridProps> = ({ cols = 2, children, className }) => {
    const colClasses = {
        1: "grid-cols-1",
        2: "grid-cols-1 md:grid-cols-2",
        3: "grid-cols-1 md:grid-cols-3",
        4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    };

    return <div className={cn("grid gap-4 items-start", colClasses[cols], className)}>{children}</div>;
};

// ── 3. WIZARD / STEPPER MULTI-PASO CON VALIDACIÓN ───────────────────────────
export interface WizardStep {
    id: string;
    title: string;
    description?: string;
    fieldsToValidate?: string[];
}

export interface FormWizardProps {
    steps: WizardStep[];
    currentStep: number;
    onStepChange: (stepIndex: number) => void;
    children: React.ReactNode;
}

export const FormWizard: React.FC<FormWizardProps> = ({
    steps,
    currentStep,
    onStepChange,
    children,
}) => {
    return (
        <div className="space-y-6">
            {/* Indicador de pasos horizontal */}
            <div className="border border-zinc-200 bg-white p-3 flex items-center justify-between overflow-x-auto slim-scrollbar">
                {steps.map((step, idx) => {
                    const isDone = idx < currentStep;
                    const isCurrent = idx === currentStep;

                    return (
                        <React.Fragment key={step.id}>
                            <div
                                onClick={() => isDone && onStepChange(idx)}
                                className={cn(
                                    "flex items-center gap-2 cursor-pointer select-none",
                                    !isDone && !isCurrent && "opacity-40 cursor-not-allowed"
                                )}
                            >
                                <div
                                    className={cn(
                                        "w-6 h-6 border flex items-center justify-center text-[11px] font-mono font-bold",
                                        isDone && "bg-zinc-900 border-zinc-900 text-white",
                                        isCurrent && "border-zinc-900 text-zinc-900 bg-zinc-100",
                                        !isDone && !isCurrent && "border-zinc-300 text-zinc-400"
                                    )}
                                >
                                    {isDone ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                                </div>
                                <div className="flex flex-col">
                                    <span className={cn("text-[12px] font-semibold whitespace-nowrap", isCurrent ? "text-zinc-900" : "text-zinc-500")}>
                                        {step.title}
                                    </span>
                                </div>
                            </div>
                            {idx < steps.length - 1 && <ChevronRight className="w-4 h-4 text-zinc-300 flex-shrink-0 mx-2" />}
                        </React.Fragment>
                    );
                })}
            </div>

            {/* Contenido del paso activo */}
            <div>{children}</div>
        </div>
    );
};