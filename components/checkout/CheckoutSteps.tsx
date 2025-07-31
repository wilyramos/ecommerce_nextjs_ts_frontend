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
        <div className="flex md:items-center md:justify-between md:pl-20 pl-6 py-4" >
            {steps.map((step, index) => {
                const isActive = pathname.startsWith(step.path);
                const currentStepIndex = steps.findIndex(s => s.path === pathname);
                const isCompleted = currentStepIndex > index;

                const StepContent = (
                    <div className="flex-1 flex items-center gap-2 pb-10">
                        <div
                            className={cn(
                                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                                isCompleted ? "bg-gray-900 text-white" :
                                    isActive ? "bg-gray-400 text-white" :
                                        "bg-gray-300 text-gray-600"
                            )}
                        >
                            {index + 1}
                        </div>
                        <span
                            className={cn(
                                "text-sm md:text-lg transition-colors",
                                isActive ? "text-gray-400 font-medium" :
                                    isCompleted ? "text-gray-900 cursor-pointer hover:text-gray-700" :
                                        "text-gray-400"
                            )}
                        >
                            {step.label}
                        </span>

                        {index < steps.length - 1 && (
                            <div className="hidden md:block flex-1 h-px bg-gray-900 mx-2" />
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
