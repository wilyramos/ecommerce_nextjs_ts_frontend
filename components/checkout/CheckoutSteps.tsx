"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react"; // Opcional: para pasos completados

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
        <nav className="flex items-center justify-between mx-auto w-full max-w-2xl py-6 px-4">
            {steps.map((step, index) => {
                const isActive = pathname === step.path;
                const isCompleted = currentStepIndex > index;

                const StepContent = (
                    <div className="flex items-center gap-3 relative group">
                        {/* Círculo indicador */}
                        <div
                            className={cn(
                                "w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-500 border-2",
                                isCompleted
                                    ? "bg-[var(--color-bg-inverse)] border-[var(--color-bg-inverse)] text-[var(--color-text-inverse)]"
                                    : isActive
                                        ? "bg-[var(--color-bg-primary)] border-[var(--color-action-primary)] text-[var(--color-action-primary)] scale-110 shadow-sm"
                                        : "bg-[var(--color-bg-tertiary)] border-[var(--color-border-default)] text-[var(--color-text-tertiary)]"
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
                                        ? "text-[var(--color-text-primary)]"
                                        : "text-[var(--color-text-tertiary)]"
                                )}
                            >
                                {step.label}
                            </span>
                        </div>

                        {/* Línea divisoria (Conector) */}
                        {index < steps.length - 1 && (
                            <div
                                className={cn(
                                    "hidden md:block w-12 lg:w-20 h-[2px] mx-2 transition-all duration-700",
                                    isCompleted
                                        ? "bg-[var(--color-bg-inverse)]"
                                        : "bg-[var(--color-border-subtle)]"
                                )}
                            />
                        )}
                    </div>
                );

                return (
                    <div key={step.path} className="flex items-center">
                        {isCompleted ? (
                            <Link href={step.path} className="cursor-pointer hover:opacity-80 transition-opacity">
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