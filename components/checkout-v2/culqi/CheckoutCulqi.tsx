"use client";

// import ComponentScriptCulqiCustom from "./ComponentScriptCulqiCustom";
import { Muted } from "@/components/ui/TypographyV3";
import type { OrderResponse } from "@/src/schemas/order.schema";

export default function CheckoutCulqi({ order }: { order: OrderResponse }) {
    if (!order) {
        return <Muted className="text-center mt-6 font-semibold text-status-error">Orden inválida.</Muted>;
    }

    return (
        <div className="flex flex-col items-center gap-4 w-full">
            <div className="w-full flex justify-center">
                {/* <ComponentScriptCulqiCustom order={order} /> */}
            </div>
        </div>
    );
}