// File: frontend/app/checkout/shipping/page.tsx

import { FiMapPin } from 'react-icons/fi';
import ShippingForm from '@/components/checkout/ShippingForm';
import { H2 } from '@/components/ui/Typography';

export default function ShippingPage() {
    return (
        <div className="max-w-2xl mx-auto bg-card p-6 md:p-10 border border-border rounded-[var(--radius-lg)] text-card-foreground shadow-xs">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border select-none">
                <div className="w-8 h-8 rounded-full bg-background-secondary flex items-center justify-center text-foreground border border-border">
                    <FiMapPin size={16} strokeWidth={2} />
                </div>
                <H2>
                    Dirección de envío
                </H2>
            </div>

            <ShippingForm />
        </div>
    );
}