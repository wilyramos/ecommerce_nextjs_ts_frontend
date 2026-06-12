import { NextRequest, NextResponse } from 'next/server';
import { getTokenOptional } from '@/src/auth/dal';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const token = await getTokenOptional();
        if (!token) {
            return NextResponse.json(
                { message: 'No autorizado. Inicie sesión nuevamente.' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(req.url);
        const folder = searchParams.get('folder') || '';
        const page   = searchParams.get('page')   || '1';
        const limit  = searchParams.get('limit')  || '20';
        const id     = searchParams.get('id');

        const isValidId = id && id !== 'null' && id !== 'undefined';

        const backendUrlString = isValidId
            ? `${process.env.API_URL}/media/${id}`
            : `${process.env.API_URL}/media`;

        const backendUrl = new URL(backendUrlString);

        if (!isValidId) {
            backendUrl.searchParams.set('folder', folder);
            backendUrl.searchParams.set('page', page);
            backendUrl.searchParams.set('limit', limit);
        }

        const backendResponse = await fetch(backendUrl.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await backendResponse.json().catch(() => null);

        if (!backendResponse.ok) {
            return NextResponse.json(
                { message: data?.message || `Error ${backendResponse.status} al listar medios` },
                { status: backendResponse.status }
            );
        }

        return NextResponse.json(data, { status: 200 });

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error interno en el proxy GET de medios';
        return NextResponse.json({ message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const token = await getTokenOptional();
        if (!token) {
            return NextResponse.json(
                { message: 'No autorizado. Inicie sesión nuevamente.' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id || id === 'null' || id === 'undefined') {
            return NextResponse.json(
                { message: 'El ID del recurso es requerido y debe ser válido' },
                { status: 400 }
            );
        }

        const backendResponse = await fetch(`${process.env.API_URL}/media/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await backendResponse.json().catch(() => null);

        if (!backendResponse.ok) {
            return NextResponse.json(
                { message: data?.message || `Error ${backendResponse.status} al eliminar el medio` },
                { status: backendResponse.status }
            );
        }

        return NextResponse.json(data, { status: backendResponse.status });

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error interno en el proxy DELETE de medios';
        return NextResponse.json({ message }, { status: 500 });
    }
}