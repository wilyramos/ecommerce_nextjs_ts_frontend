// components/ui/OrderStepper.tsx
"use client";

import { cn } from "@/lib/utils";
import { BsCheckCircleFill } from "react-icons/bs";

const steps = [
    { label: "Pendiente", value: "PENDIENTE" },
    { label: "Procesando", value: "PROCESANDO" },
    { label: "Enviado", value: "ENVIADO" },
    { label: "Entregado", value: "ENTREGADO" },
];

type OrderStepperProps = {
    status: "PENDIENTE" | "PROCESANDO" | "ENVIADO" | "ENTREGADO" | "CANCELADO";
};

export default function OrderStepper({ status }: OrderStepperProps) {
    if (status === "CANCELADO") {
        return (
            <div className="flex items-center gap-2 text-red-600 text-sm font-semibold">
                <BsCheckCircleFill className="text-red-500" />
                Pedido cancelado
            </div>
        );
    }

    const currentStepIndex = steps.findIndex((step) => step.value === status);

    return (
        <div className="flex items-center justify-between ">
            {steps.map((step, i) => {
                const isCompleted = i <= currentStepIndex;
                return (
                    <div key={step.value} className="flex-1">
                        <div className="flex flex-col items-center gap-2">
                            <div
                                className={cn(
                                    "w-4 h-4 rounded-full border-2 flex items-center justify-center text-xs",
                                    isCompleted
                                        ? "bg-blue-600 border-blue-600 text-white"
                                        : "border-gray-300 text-gray-400"
                                )}
                            >
                                {isCompleted ? <BsCheckCircleFill className="text-white w-4 h-4" /> : i + 1}
                            </div>
                            <span
                                className={cn(
                                    "text-xs",
                                    isCompleted ? "text-blue-700 font-medium" : "text-gray-500"
                                )}
                            >
                                {step.label}
                            </span>
                        </div>
                        {i < steps.length - 1 && (
                            <div
                                className={cn(
                                    "h-1 w-full mx-2 mt-2 rounded",
                                    isCompleted ? "bg-blue-600" : "bg-gray-200"
                                )}
                            ></div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
