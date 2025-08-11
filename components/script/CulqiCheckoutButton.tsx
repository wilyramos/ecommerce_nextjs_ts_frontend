// src/utils/loadCulqi.ts
import ScriptService from "@/src/utils/ScriptService";

export async function loadCulqiScript() {
    const scriptService = new ScriptService(
        "culqi-checkout",
        "Culqi",
        "https://checkout.culqi.com/js/v4" // versión oficial
    );

    await scriptService.appendScript();
}
