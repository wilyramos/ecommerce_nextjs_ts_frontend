// File: frontend/components/checkout/culqi/CheckoutCulqi.tsx

"use client";

import type { TOrderPopulated } from "@/src/schemas";
// import ComponentScriptCulqiCustom from "./ComponentScriptCulqiCustom";
import { Muted } from "@/components/ui/Typography";

export default function CheckoutCulqi({ order }: { order: TOrderPopulated }) {
    if (!order) {
        return <Muted className="text-center mt-6 font-bold text-destructive">Orden inválida.</Muted>;
    }

    return (
        <div className="flex flex-col items-center gap-4 w-full">
            <Muted className="font-semibold select-none">Paga de forma segura con Culqi</Muted>
            <div className="w-full flex justify-center">
                {/* <ComponentScriptCulqiCustom order={order} /> */}
            </div>
        </div>
    );
}