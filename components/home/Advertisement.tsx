"use client";

import * as React from "react";
import { CreditCard, Zap, ShieldCheck, Clock, Truck } from "lucide-react";

const items = [
  { icon: Truck, text: "Envío gratis a Cañete" },
  { icon: Truck, text: "Envíos a todo Perú (Shalom)" },
  { icon: CreditCard, text: "Paga con tarjeta o Yape" },
  { icon: Zap, text: "6 cuotas sin intereses" },
  { icon: ShieldCheck, text: "Productos 100% originales" },
  { icon: Clock, text: "Atención: Lun–Sáb 9am – 7pm" },
];

export default function AnnouncementBar() {
  const doubled = [...items, ...items];

  return (
    <div className="w-full bg-action-cta text-action-cta-foreground py-2 overflow-hidden sticky top-0 z-10">
      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
      `}</style>

      <div className="flex animate-scroll whitespace-nowrap">
        {doubled.map((item, i) => (
          <div key={i} className="flex items-center gap-2 px-6 text-[12px] uppercase tracking-wider font-semibold opacity-80">
            <item.icon className="w-3.5 h-3.5" />
            <span className="truncate">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}