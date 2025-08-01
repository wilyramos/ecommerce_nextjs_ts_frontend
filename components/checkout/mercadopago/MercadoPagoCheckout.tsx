'use client';

import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { useEffect, useState } from 'react';

export default function MercadoPagoCheckout({ preferenceId }: { preferenceId: string }) {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        initMercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY!, {
            locale: 'es-PE',
        });
        setReady(true);
    }, []);

    return (
        <div>
            {ready && (
                <Wallet
                    initialization={{ preferenceId }}
                    customization={{  }}
                />
            )}
        </div>
    );
}
