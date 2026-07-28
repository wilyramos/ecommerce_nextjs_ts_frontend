// File: frontend/app/api/admin/orders/pdf/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getTokenOptional } from "@/src/auth/dal";

const API_URL = process.env.API_URL || "http://localhost:4000/api";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const orderIds = searchParams.get("ids");
    const type = searchParams.get("type") || "packing_slip";
    const format = searchParams.get("format") || "A4";

    if (!orderIds) {
        return NextResponse.json(
            { ok: false, error: "Se requiere al menos un ID de orden" },
            { status: 400 }
        );
    }

    const idsArray = orderIds.split(",").map((id) => id.trim()).filter(Boolean);

    if (idsArray.length === 0) {
        return NextResponse.json(
            { ok: false, error: "Lista de IDs de orden no válida" },
            { status: 400 }
        );
    }

    const token = await getTokenOptional();

    try {
        const backendRes = await fetch(`${API_URL}/orders/v2/admin/generate-pdf`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({
                orderIds: idsArray,
                type,
                format,
            }),
            cache: "no-store",
        });

        if (!backendRes.ok) {
            const errorJson = await backendRes.json().catch(() => ({}));
            return NextResponse.json(
                { ok: false, error: errorJson.message || "Error generando PDF en el servidor" },
                { status: backendRes.status }
            );
        }

        const pdfBuffer = await backendRes.arrayBuffer();

        return new NextResponse(pdfBuffer, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `inline; filename="${type}_${format}_${idsArray.length}_ordenes.pdf"`,
                "Cache-Control": "no-store, no-cache, must-revalidate",
            },
        });
    } catch (error) {
        console.error("❌ Error en Proxy Route Handler de PDF:", error);
        return NextResponse.json(
            { ok: false, error: "Error interno al procesar el archivo PDF" },
            { status: 500 }
        );
    }
}