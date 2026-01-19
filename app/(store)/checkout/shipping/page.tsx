import { FiMapPin } from 'react-icons/fi';
import ShippingForm from '@/components/checkout/ShippingForm';

export default function ShippingPage() {
    return (
        <div className="max-w-2xl mx-auto bg-[var(--store-surface)] p-6 md:p-8 rounded-2xl border border-[var(--store-border)] shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--store-border)]">
                <div className="w-8 h-8 rounded-full bg-[var(--store-bg)] flex items-center justify-center text-[var(--store-text)]">
                    <FiMapPin size={18} />
                </div>
                <h2 className="text-lg font-semibold text-[var(--store-text)]">
                    Dirección de envío
                </h2>
            </div>

            <ShippingForm />
        </div>
    );
}