'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

const sections = [
  { name: "Ayuda", path: "/centro-ayuda" },
  { name: "Política de Devoluciones", path: "/centro-ayuda/devoluciones" },
  { name: "Trabaja con Nosotros", path: "/centro-ayuda/trabaja" },
  { name: "Nuestras Tiendas", path: "/centro-ayuda/tiendas" },
];

export default function LayoutCentroAyuda({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header de navegación */}
      <header className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-800">
            Mi E-commerce
          </Link>
          <nav className="flex gap-4 md:gap-6">
            {sections.map((section) => {
              const isActive = pathname === section.path;
              return (
                <Link
                  key={section.path}
                  href={section.path}
                  className={`px-3 py-2 rounded-md font-medium transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {section.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Contenido */}
      <main className="flex-1 max-w-6xl mx-auto p-6">{children}</main>

      {/* Footer */}
      <footer className="bg-white shadow-inner mt-12">
        <div className="max-w-6xl mx-auto px-6 py-6 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Mi E-commerce. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
