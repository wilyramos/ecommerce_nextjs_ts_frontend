// File: frontend/app/proximamente/page.tsx
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { FaInstagram, FaFacebookF, FaWhatsapp } from "react-icons/fa";

export default function ProximamentePage() {
  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-between bg-surface-inverse px-6 py-10 text-text-inverse selection:bg-brand-accent selection:text-text-inverse md:px-12 md:py-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04)_0,transparent_70%)] pointer-events-none" />

      {/* Header / Logo */}
      <header className="z-10 flex w-full max-w-4xl items-center justify-between gap-4">
        <div className="max-w-[140px] sm:max-w-[180px]">
          <Logo color="white" size={28} />
        </div>
        <a
          href="https://wa.me/51927870159"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-xs font-medium text-text-secondary transition-colors duration-fast hover:text-text-inverse"
        >
          Soporte Directo
        </a>
      </header>

      {/* Main Content */}
      <section className="z-10 my-auto flex max-w-xl flex-col items-center text-center">


        <h1 className="text-4xl font-bold tracking-tight text-text-inverse sm:text-6xl md:text-7xl">
          Muy Pronto.
        </h1>

        <p className="mt-6 text-sm leading-relaxed text-text-tertiary sm:text-base md:text-lg">
          Estamos rediseñando nuestra plataforma para ofrecerte un catálogo superior en tecnología y accesorios premium. Síguenos en nuestras redes para estar al tanto de los lanzamientos.
        </p>

        {/* Social Links */}
        <div className="mt-10 flex items-center justify-center gap-3.5">
          <Link
            href="https://instagram.com/gophone.pe"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="flex size-12 items-center justify-center rounded-radius-lg border border-border-primary/20 bg-surface-primary/5 text-text-inverse transition-all duration-fast hover:border-border-strong hover:bg-surface-primary/15"
          >
            <FaInstagram size={18} />
          </Link>
          <Link
            href="https://facebook.com/gophone.pe"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="flex size-12 items-center justify-center rounded-radius-lg border border-border-primary/20 bg-surface-primary/5 text-text-inverse transition-all duration-fast hover:border-border-strong hover:bg-surface-primary/15"
          >
            <FaFacebookF size={18} />
          </Link>
          <Link
            href="https://wa.me/51927870159"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="flex size-12 items-center justify-center rounded-radius-lg border border-border-primary/20 bg-surface-primary/5 text-text-inverse transition-all duration-fast hover:border-border-strong hover:bg-surface-primary/15"
          >
            <FaWhatsapp size={18} />
          </Link>
        </div>
      </section>

      {/* Footer minimalista */}
      <footer className="z-10 text-center">
        <p className="text-[11px] text-text-tertiary tracking-wide">
          © {new Date().getFullYear()} GoPhone Inc. Todos los derechos reservados.
        </p>
      </footer>
    </main>
  );
}