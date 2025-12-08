
import Link from "next/link";
import type { IconType } from "react-icons";
import { FaTags, FaTruck, FaLock, FaExchangeAlt } from "react-icons/fa";

type Feature = {
  title: string;
  icon: IconType;
  url?: string; // opcional: si está presente el feature será clicable
};

const features: Feature[] = [
  { title: "Ofertas exclusivas", icon: FaTags },
  { title: "Envíos rápidos", icon: FaTruck },
  { title: "Pago 100% seguro", icon: FaLock },
  { title: "Cambios y devoluciones", icon: FaExchangeAlt, url: "/hc/garantias-y-devoluciones" },
];

export default function MinimalFeatures() {
  return (
    <section className=" py-10 ">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-6 py-6">
        {features.map((feature) => {
          const Content = (
            <div
              className="flex flex-col items-center text-center text-black hover:text-gray-900 transition p-3 rounded-md border border-gray-200 hover:shadow-md"
              aria-label={feature.title}
            >
              <feature.icon size={20} className="mb-2" />
              <span className="text-xs font-medium">{feature.title}</span>
            </div>
          );

          // Si feature.url existe, lo envolvemos en Link para hacerlo navegable
          return (
            <div key={feature.title}>
              {feature.url ? (
                <Link href={feature.url} aria-label={feature.title}>
                  {Content}
                </Link>
              ) : (
                Content
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
