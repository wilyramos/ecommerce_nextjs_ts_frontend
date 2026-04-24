import { NextRequest, NextResponse } from "next/server";

type Params = Promise<{ id: string }>;

export async function GET(
    request: NextRequest,
    segmentData: { params: Params }
) {
    try {
        const { id } = await segmentData.params;
        
        const searchParams = request.nextUrl.searchParams;
        const action = searchParams.get("action") || "view";

        const backendUrl = process.env.API_URL;

        const res = await fetch(`${backendUrl}/orders/${id}/shipping-label`, {
            method: "GET",
            // headers: { "Authorization": `Bearer ${token}` }, // Tu auth aquí
            cache: "no-store",
        });

        if (!res.ok) {
            return new NextResponse("Error al generar la etiqueta de envío", { status: res.status });
        }

        const arrayBuffer = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const disposition = action === "download" ? "attachment" : "inline";

        return new NextResponse(buffer, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `${disposition}; filename="Etiqueta-${id}.pdf"`,
                "Cache-Control": "no-cache, no-store",
            },
        });
    } catch (error) {
        console.error("[SHIPPING_LABEL_PROXY_ERROR]", error);
        return new NextResponse("Error interno", { status: 500 });
    }
}