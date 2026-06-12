export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { getTokenOptional } from '@/src/auth/dal';

export async function POST(req: NextRequest) {
    try {
        const token = await getTokenOptional();

        if (!token) {
            return NextResponse.json(
                { message: 'No autorizado' },
                { status: 401 }
            );
        }

        const backendUrl = process.env.API_URL;
        if (!backendUrl) {
            return NextResponse.json(
                { message: 'API_URL no configurada en el servidor' },
                { status: 500 }
            );
        }

        const backendResponse = await fetch(`${backendUrl}/media/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'content-type': req.headers.get('content-type') ?? '',
            },
            body: req.body,
            // @ts-expect-error — duplex requerido para streaming en edge
            duplex: 'half',
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