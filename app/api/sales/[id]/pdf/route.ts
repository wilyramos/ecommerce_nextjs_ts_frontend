// File: frontend/app/api/sales/[id]/pdf/route.ts

import { NextResponse } from "next/server";

type params = Promise<{
    id: string;
}>;

// TODO: AÑADIR autenticación

export async function GET(
    req: Request,
    { params }: { params: params }
) {
    const { id } = await params;

    const res = await fetch(`${process.env.API_URL}/sales/${id}/pdf`, {
        method: "GET",
        // headers: { Authorization: `Bearer ${token}` } si necesitas auth
    });

    if (!res.ok) {
        return new NextResponse("Error al obtener PDF", { status: 500 });
    }

    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": "inline; filename=receipt.pdf",
        },
    });
}
