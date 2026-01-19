"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

const steps = [
    { label: "Identificación", path: "/checkout/profile" },
    { label: "Entrega", path: "/checkout/shipping" },
    { label: "Pago", path: "/checkout/payment" },
];

export default function CheckoutSteps() {
    const pathname = usePathname();

    return (
        <div className="flex md:items-center md:justify-between mx-auto w-full max-w-3xl py-4 px-2">
            {steps.map((step, index) => {
                // Lógica de estado
                const isActive = pathname.startsWith(step.path);
                const currentStepIndex = steps.findIndex((s) => s.path === pathname);
                const isCompleted = currentStepIndex > index;

                const StepContent = (
                    <div className="flex-1 flex items-center gap-2 md:pb-2">
                        {/* Círculo indicador */}
                        <div
                            className={cn(
                                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 border",
                                isCompleted
                                    ? "bg-[var(--store-text)] border-[var(--store-text)] text-[var(--store-surface)]" // Completado (Negro sólido)
                                    : isActive
                                        ? "bg-[var(--store-text)] border-[var(--store-text)] text-[var(--store-surface)] scale-110" // Activo (Negro resaltado)
                                        : "bg-[var(--store-bg)] border-[var(--store-border)] text-[var(--store-text-muted)]" // Pendiente (Gris sutil)
                            )}
                        >
                            {index + 1}
                        </div>

                        {/* Etiqueta de texto */}
                        <span
                            className={cn(
                                "text-xs md:text-sm transition-colors font-medium hidden md:block",
                                isActive
                                    ? "text-[var(--store-text)] font-semibold" // Activo
                                    : isCompleted
                                        ? "text-[var(--store-text)] cursor-pointer" // Completado
                                        : "text-[var(--store-text-muted)]" // Pendiente
                            )}
                        >
                            {step.label}
                        </span>

                        {/* Línea divisoria (conector) */}
                        {index < steps.length - 1 && (
                            <div
                                className={cn(
                                    "flex-1 h-[1px] mx-2 md:mx-4 transition-colors",
                                    isCompleted
                                        ? "bg-[var(--store-text)]"
                                        : "bg-[var(--store-border)]"
                                )}
                            />
                        )}
                    </div>
                );

                return (
                    <div key={step.path} className={index === steps.length - 1 ? "flex-none" : "flex-1"}>
                        {isCompleted ? (
                            <Link href={step.path}>{StepContent}</Link>
                        ) : (
                            StepContent
                        )}
                    </div>
                );
            })}
        </div>
    );
}