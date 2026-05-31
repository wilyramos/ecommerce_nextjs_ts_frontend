// File: frontend/components/checkout/CheckoutSteps.tsx

"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const steps = [
    { label: "Identificación", path: "/checkout/profile" },
    { label: "Entrega", path: "/checkout/shipping" },
    { label: "Pago", path: "/checkout/payment" },
];

export default function CheckoutSteps() {
    const pathname = usePathname();

    // Encontrar el índice actual para determinar qué pasos están completados
    const currentStepIndex = steps.findIndex((s) => s.path === pathname);

    return (
        <nav className="flex items-center justify-between mx-auto w-full max-w-2xl py-6 px-4 select-none">
            {steps.map((step, index) => {
                const isActive = pathname === step.path;
                const isCompleted = currentStepIndex > index;

                const StepContent = (
                    <div className="flex items-center gap-3 relative group">
                        {/* Círculo indicador */}
                        <div
                            className={cn(
                                "w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 border-2",
                                isCompleted
                                    ? "bg-foreground border-foreground text-background"
                                    : isActive
                                        ? "bg-background border-action-cta text-action-cta scale-110 shadow-xs"
                                        : "bg-background-secondary border-border text-muted-foreground"
                            )}
                        >
                            {isCompleted ? <Check size={14} strokeWidth={3} /> : index + 1}
                        </div>

                        {/* Etiqueta de texto - Minimalista */}
                        <div className="flex flex-col">
                            <span
                                className={cn(
                                    "text-[9px] uppercase tracking-[0.15em] font-bold transition-colors hidden md:block",
                                    isActive || isCompleted
                                        ? "text-foreground"
                                        : "text-muted-foreground"
                                )}
                            >
                                {step.label}
                            </span>
                        </div>

                        {/* Línea divisoria (Conector) */}
                        {index < steps.length - 1 && (
                            <div
                                className={cn(
                                    "hidden md:block w-12 lg:w-20 h-[2px] mx-2 transition-colors duration-500",
                                    isCompleted
                                        ? "bg-foreground"
                                        : "bg-border"
                                )}
                            />
                        )}
                    </div>
                );

                return (
                    <div key={step.path} className="flex items-center">
                        {isCompleted ? (
                            <Link href={step.path} className="cursor-pointer hover:opacity-80 transition-opacity focus-visible:outline-hidden">
                                {StepContent}
                            </Link>
                        ) : (
                            <div className="cursor-default">
                                {StepContent}
                            </div>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}