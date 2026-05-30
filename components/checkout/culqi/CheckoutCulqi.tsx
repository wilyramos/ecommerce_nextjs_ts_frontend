"use client";

import type { TOrderPopulated } from "@/src/schemas";
import ComponentScriptCulqiCustom from "./ComponentScriptCulqiCustom";

export default function CheckoutCulqi({ order }: { order: TOrderPopulated }) {
    if (!order) {
        return <p className="text-gray-400 text-sm text-center mt-6">Orden inválida.</p>;
    }

    return (
        <div className="flex flex-col items-center gap-4 w-full">
            <h3 className="text-sm text-muted-foreground">Paga de forma segura con Culqi</h3>
            <div className="w-full flex justify-center">
                <ComponentScriptCulqiCustom order={order} />
            </div>
        </div>
    );
}