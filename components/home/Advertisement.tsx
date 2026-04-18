"use client";

import { useState } from "react";
import { X } from "lucide-react";

const items = [
  { accent: true, text: "Envío gratis" },
  { accent: false, text: "Envíos a todo Perú · SHALOM" },
  { accent: false, text: "Paga con tarjeta o Yape" },
  { accent: false, text: "Productos 100% originales" },
  { accent: false, text: "Atención Lun–Sáb  9am – 7pm" },
];

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  const doubled = [...items, ...items];

  return (
    <div className="w-full bg-[var(--color-bg-inverse)] border-b border-[var(--color-border-default)] sticky top-0 z-10 overflow-hidden">
      <style>{`
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

      <div className="relative h-7 flex items-center">
        {/* Gradient izquierdo */}
        <div className="absolute left-0 inset-y-0 w-12 bg-gradient-to-r from-[var(--color-bg-inverse)] to-transparent z-10 pointer-events-none" />

        {/* Gradient derecho */}
        <div className="absolute right-9 inset-y-0 w-12 bg-gradient-to-l from-[var(--color-bg-inverse)] to-transparent z-10 pointer-events-none" />

        {/* Track de items */}
        <div className="bar-track flex items-center whitespace-nowrap">
          {doubled.map((item, i) => (
            <div
              key={i}
              className="inline-flex items-center gap-2 px-7 text-[12px] text-[var(--color-text-inverse)] text-opacity-60 hover:text-opacity-100 tracking-wide transition-opacity"
            >
              <span
                className="w-[5px] h-[5px] rounded-full flex-shrink-0"
                style={{
                  background: item.accent
                    ? "var(--color-accent-warm)"
                    : "var(--color-text-inverse)"
                }}
              />
              {item.text}
            </div>
          ))}
        </div>

        {/* Botón cerrar */}
        <button
          onClick={() => setVisible(false)}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-inverse)] text-opacity-40 hover:text-opacity-80 transition-all z-20 p-1"
          aria-label="Cerrar anuncio"
        >
          <X size={16} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}