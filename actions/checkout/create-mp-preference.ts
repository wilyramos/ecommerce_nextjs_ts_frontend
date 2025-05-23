'use server'

export async function createMPPreference(orderData: any) {

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/checkout/create-preference`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
    });

    if (!res.ok) throw new Error('No se pudo crear la preferencia');

    const data = await res.json();
    return data.init_point;
}
