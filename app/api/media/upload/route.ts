import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/src/auth/dal';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const session = await verifySession();
    
    if (!session || !session.token) {
      console.error('--- PROXY ERROR: verifySession() no retornó un token válido ---', session);
      return NextResponse.json({ message: 'No autorizado desde el servidor frontend' }, { status: 401 });
    }

    const formData = await req.formData();
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/media/upload`;
    
    const backendResponse = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.token}`,
      },
      body: formData,
    });

    const data = await backendResponse.json().catch(() => null);

    if (!backendResponse.ok) {
      console.error('--- BACKEND ERROR REJECTED ---', {
        status: backendResponse.status,
        message: data?.message
      });
      return NextResponse.json(
        { message: data?.message || 'Error devuelto por el backend externo de medios' },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error) {
    console.error('--- CRITICAL PROXY EXCEPTION ---', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error en el Proxy de Medios';
    return NextResponse.json({ message }, { status: 500 });
  }
}