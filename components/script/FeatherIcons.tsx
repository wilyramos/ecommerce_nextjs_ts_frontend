"use client";

import { useEffect } from "react";
import ScriptService from "@/src/utils/script";



declare global {
  interface Window {
    feather?: {
      replace: () => void;
    };
  }
}

export default function FeatherIcons() {
  useEffect(() => {
    const loader = new ScriptService(
      "feather-icons-script",
      "feather", // nameFunction global para verificar en window
      "https://unpkg.com/feather-icons" // Script público sin API key
    );

    loader.appendScript()
      .then(() => {
        (window).feather?.replace();
      })
      .catch((err) => {
        console.error("No se pudo cargar Feather Icons", err);
      });

    return () => {
      loader.destroy();
    };
  }, []);

  return (
    <div className="p-4 border rounded-md">
      <h2 className="text-xl font-bold mb-4">Ejemplo de Feather Icons</h2>
      <div className="flex items-center gap-6 text-gray-700">
        <i data-feather="camera"></i>
        <i data-feather="heart"></i>
        <i data-feather="star"></i>
        <i data-feather="user"></i>
      </div>
    </div>
  );
}