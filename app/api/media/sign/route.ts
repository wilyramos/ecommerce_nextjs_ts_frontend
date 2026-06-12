// app/api/media/sign/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getTokenOptional } from '@/src/auth/dal';

export async function POST(req: NextRequest) {
    const token = await getTokenOptional();
    if (!token) return NextResponse.json({ message: 'No autorizado' }, { status: 401 });

    const body = await req.json();

    const backendResponse = await fetch(`${process.env.API_URL}/media/sign-upload`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    });

    const data = await backendResponse.json();
    return NextResponse.json(data, { status: backendResponse.status });
}