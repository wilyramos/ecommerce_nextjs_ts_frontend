import { NextRequest, NextResponse } from 'next/server';
import { getTokenOptional } from '@/src/auth/dal';

// 1. ELIMINADO: export const runtime = 'edge'; (Esto causaba el 413 con archivos > 4.5MB)

// 2. Desactivamos el bodyParser para permitir flujos binarios grandes hacia Express
export const config = {
    api: {
        bodyParser: false,
    },
};

// 100 MB en Bytes (100 * 1024 * 1024)
const MAX_ALLOWED_SIZE = 104857600; 

export async function POST(req: NextRequest) {
    try {
        const token = await getTokenOptional();

        if (!token) {
            return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
        }

        // 3. Validación de tamaño directamente en el Proxy de Next.js
        const contentLength = Number(req.headers.get('content-length') || 0);
        if (contentLength > MAX_ALLOWED_SIZE) {
            return NextResponse.json(
                { message: 'El archivo excede el límite máximo permitido de 100 MB.' },
                { status: 413 }
            );
        }

        const backendUrl = process.env.API_URL;
        if (!backendUrl) {
            return NextResponse.json(
                { message: 'API_URL no configurada en el servidor' },
                { status: 500 }
            );
        }

        // Convertimos la petición a Blob para transmitirla de forma segura usando Node.js Runtime
        const blob = await req.blob();

        const backendResponse = await fetch(`${backendUrl}/media/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'content-type': req.headers.get('content-type') ?? '',
            },
            body: blob,
        });

        const data = await backendResponse.json().catch(() => null);

        if (!backendResponse.ok) {
            return NextResponse.json(
                { message: data?.message || `Error ${backendResponse.status} del backend` },
                { status: backendResponse.status }
            );
        }

        return NextResponse.json(data, { status: backendResponse.status });

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error interno del proxy de subida';
        return NextResponse.json({ message }, { status: 500 });
    }
}