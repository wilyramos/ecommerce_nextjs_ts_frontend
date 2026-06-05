import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/src/auth/dal';

export const dynamic = 'force-dynamic';

/**
 * PROXY GET: Captura las llamadas del cliente para listar la biblioteca de medios o consultar un item.
 * Transfiere la petición al backend de Express adjuntando el token de sesión.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await verifySession();
    
    if (!session || !session.token) {
      console.error('--- PROXY GET ERROR: verifySession() no retornó un token válido ---');
      return NextResponse.json({ message: 'No autorizado. Inicie sesión nuevamente.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const folder = searchParams.get('folder') || '';
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '20';
    const id = searchParams.get('id');

    let backendUrlString = `${process.env.API_URL}/media`;
    if (id && id !== 'null' && id !== 'undefined') {
      backendUrlString = `${process.env.API_URL}/media/${id}`;
    }

    const backendUrl = new URL(backendUrlString);
    
    // Si no es una consulta unitaria por ID, inyectamos los query params para la paginación de Express
    if (!id || id === 'null' || id === 'undefined') {
      backendUrl.searchParams.set('folder', folder);
      backendUrl.searchParams.set('page', page);
      backendUrl.searchParams.set('limit', limit);
    }

    const backendResponse = await fetch(backendUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.token}`,
      },
    });

    const data = await backendResponse.json().catch(() => null);

    if (!backendResponse.ok) {
      console.error('--- BACKEND GET ERROR REJECTED ---', {
        status: backendResponse.status,
        message: data?.message
      });
      return NextResponse.json(
        { message: data?.message || 'Error devuelto por el backend externo al listar medios' },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('--- CRITICAL PROXY GET EXCEPTION ---', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error en el Proxy de Medios (GET)';
    return NextResponse.json({ message }, { status: 500 });
  }
}

/**
 * PROXY DELETE: Captura las llamadas del cliente para eliminar un medio permanente.
 */
export async function DELETE(req: NextRequest) {
  try {
    const session = await verifySession();
    
    if (!session || !session.token) {
      console.error('--- PROXY DELETE ERROR: verifySession() no retornó un token válido ---');
      return NextResponse.json({ message: 'No autorizado. Inicie sesión nuevamente.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id || id === 'null' || id === 'undefined') {
      return NextResponse.json({ message: 'El ID del recurso es requerido y debe ser válido' }, { status: 400 });
    }

    const backendUrl = `${process.env.API_URL}/media/${id}`;

    const backendResponse = await fetch(backendUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.token}`,
      },
    });

    const data = await backendResponse.json().catch(() => null);

    if (!backendResponse.ok) {
      console.error('--- BACKEND DELETE ERROR REJECTED ---', {
        status: backendResponse.status,
        message: data?.message
      });
      return NextResponse.json(
        { message: data?.message || 'Error devuelto por el backend externo al eliminar' },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error) {
    console.error('--- CRITICAL PROXY DELETE EXCEPTION ---', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error en el Proxy de Medios (DELETE)';
    return NextResponse.json({ message }, { status: 500 });
  }
}