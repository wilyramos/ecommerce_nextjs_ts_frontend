import { FiMapPin } from 'react-icons/fi';
import ShippingForm from '@/components/checkout/ShippingForm';

export default function ShippingPage() {
    return (
        <div className="max-w-2xl mx-auto bg-[var(--color-bg-primary)] p-6 md:p-10 border border-[var(--color-border-subtle)]">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--color-border-subtle)]">
                <div className="w-8 h-8 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center text-[var(--color-text-primary)]">
                    <FiMapPin size={18} />
                </div>
                    <h2 className="text-xl font-bold tracking-tight text-[var(--color-accent-warm)]">
                    Dirección de envío
                </h2>
            </div>

            <ShippingForm />
        </div>
    );
}