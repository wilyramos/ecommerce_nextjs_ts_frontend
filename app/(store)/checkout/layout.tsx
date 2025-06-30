import React from 'react';
import CheckoutSteps from '@/components/checkout/CheckoutSteps';
import ResumenFinalCarrito from '@/components/cart/ResumenFinalCarrito';

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Pasos del checkout */}
      <div className="mb-8">
        <CheckoutSteps />
      </div>

      {/* Grid: paso actual + resumen */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Paso actual (shipping, payment, etc.) */}
        <section className="lg:col-span-2 space-y-8">
          {children}
        </section>

        {/* Resumen persistente */}
        <aside className="sticky top-24 h-fit">
          <ResumenFinalCarrito />
        </aside>
        
      </div>
    </main>
  );
}
