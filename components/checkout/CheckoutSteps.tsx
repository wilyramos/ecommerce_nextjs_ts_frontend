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
        <div className="flex items-center justify-between mb-6">
            {steps.map((step, index) => {
                const isActive = pathname.startsWith(step.path);
                const currentStepIndex = steps.findIndex(s => s.path === pathname);
                const isCompleted = currentStepIndex > index;

                const StepContent = (
                    <div className="flex-1 flex items-center gap-2">
                        <div
                            className={cn(
                                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                                isCompleted ? "bg-green-500 text-white" :
                                    isActive ? "bg-blue-600 text-white" :
                                        "bg-gray-300 text-gray-600"
                            )}
                        >
                            {index + 1}
                        </div>
                        <span
                            className={cn(
                                "text-xs md:text-sm transition-colors",
                                isActive ? "text-blue-600 font-medium" :
                                    isCompleted ? "text-green-600 hover:underline cursor-pointer" :
                                        "text-gray-500"
                            )}
                        >
                            {step.label}
                        </span>

                        {index < steps.length - 1 && (
                            <div className="hidden md:block flex-1 h-px bg-gray-200 ml-2" />
                        )}
                    </div>
                );

                return (
                    <div key={step.path} className="flex-1">
                        {isCompleted ? (
                            <Link href={step.path}>
                                {StepContent}
                            </Link>
                        ) : (
                            StepContent
                        )}
                    </div>
                );
            })}
        </div>
    );
}
