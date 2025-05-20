import type { CartItem } from '@/src/schemas'


export async function saveCartToDB(cart: CartItem[]) {
    const url = `${process.env.API_URL}/cart`;
    const req = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(cart),
    });

    if (!req.ok) {
        throw new Error('Error saving cart to database');
    }

    return await req.json();
}

export async function getCartFromDB() {

    console.log("Fetching cart from DB");
}

export async function deleteCartFromDB() {
    console.log("Deleting cart from DB");
}