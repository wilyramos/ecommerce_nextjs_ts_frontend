// File: frontend/app/api/sales/export/route.ts
import { NextRequest, NextResponse } from "next/server";
import getToken from "@/src/auth/token";

export async function GET(request: NextRequest) {
    const token = await getToken();
    
    if (!token) {
        return new NextResponse("No autorizado", { status: 401 });
    }

    // Obtener los parámetros de búsqueda de la URL actual (search, startDate, etc.)
    const { searchParams } = new URL(request.url);
    const backendUrl = `${process.env.API_URL}/sales/v2/export?${searchParams.toString()}`;

    try {
        const response = await fetch(backendUrl, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            return new NextResponse("Error al generar reporte en backend", { status: response.status });
        }

        // Obtener el cuerpo como un stream o blob
        const blob = await response.blob();

        // Retornar el archivo al cliente con los headers correctos
        return new NextResponse(blob, {
            status: 200,
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': 'attachment; filename=reporte-ventas.csv',
            },
        });
    } catch (error) {
        console.error("Error en export route:", error);
        return new NextResponse("Error interno del servidor", { status: 500 });
    }
}