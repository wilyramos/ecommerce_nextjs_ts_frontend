"use client";

import * as React from "react";

const items = [
  { accent: false, text: "Envío gratis" },
  { accent: true, text: "Envio a todo Cañete" },
  { accent: false, text: "Envíos a todo Perú · SHALOM" },
  { accent: false, text: "Paga con tarjeta o Yape" },
  { accent: false, text: "Productos 100% originales" },
  { accent: false, text: "Atención Lun–Sáb 9am – 7pm" },
];

export default function AnnouncementBar() {
  const doubled = [...items, ...items];

  return (
    <div className="w-full bg-action-cta sticky top-0 z-10 overflow-hidden border-0">
      <style jsx>{`
        @keyframes slide {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .bar-track {
          animation: slide 32s linear infinite;
        }
        .bar-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="relative h-8 flex items-center">
        {/* Gradient izquierdo */}
        <div className="absolute left-0 inset-y-0 w-12 bg-gradient-to-r from-action-cta to-transparent z-10 pointer-events-none" />

        {/* Gradient derecho */}
        <div className="absolute right-0 inset-y-0 w-12 bg-gradient-to-l from-action-cta to-transparent z-10 pointer-events-none" />

        {/* Track de items */}
        <div className="bar-track flex items-center whitespace-nowrap">
          {doubled.map((item, i) => (
            <div
              key={i}
              className="inline-flex items-center gap-2 px-7 text-[12px] text-action-cta-foreground/80 hover:text-action-cta-foreground tracking-wide transition-colors duration-200"
            >
              <span
                className="w-[5px] h-[5px] rounded-full flex-shrink-0"
                style={{
                  background: item.accent
                    ? "var(--primary)"
                    : "var(--action-cta-foreground)"
                }}
              />
              {item.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}