"use client";

import { Search, History, Loader2, ArrowRight, X } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { searchProductsIndex } from "@/actions/product/get-list-products-search";
import type { TProductListSchema } from "@/src/schemas";
import { getSearchHistory, saveSearchTerm } from "@/lib/utils";
import ProductResultSearch from "./home/ProductResultSearch";
import Link from "next/link";
import { H4, P, Small } from "@/components/ui/TypographyV3";

interface Props {
  isMobile?: boolean;
  onSearchComplete?: () => void;
}

export default function ButtonSearchFormStore({
  isMobile = false,
  onSearchComplete,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TProductListSchema[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [history, setHistory] = useState<string[]>([]);
  useEffect(() => setHistory(getSearchHistory()), []);

  const DEFAULT_SUGGESTIONS = ["iphone", "case", "audífonos"];

  const saveHistory = (term: string) => {
    if (!term) return;
    saveSearchTerm(term);
    setHistory(getSearchHistory());
  };

  useEffect(() => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
  }, [pathname]);

  const debouncedSearch = useDebouncedCallback(async (value: string) => {
    const trimmed = value.trim();
    if (!trimmed || trimmed.length < 3) {
      setResults([]);
      return;
    }
    setLoading(true);
    const data = await searchProductsIndex(trimmed);
    setResults(data || []);
    setLoading(false);
    setIsOpen(true);
  }, 350);

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    saveHistory(trimmed);
    setIsOpen(false);
    onSearchComplete?.();

    router.push(`/productos?query=${encodeURIComponent(trimmed)}`);
  };

  useEffect(() => {
    if (isMobile) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (containerRef.current && !containerRef.current.contains(target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isMobile]);

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative w-full">
        <div className="relative flex items-center">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 text-text-tertiary"
          />

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value.length > 0) setIsOpen(true);
            }}
            placeholder="Buscar productos, marcas y más..."
            onFocus={() => setIsOpen(true)}
            autoFocus={isMobile}
            className="h-10 w-full rounded-radius-full border border-border-primary/80 bg-surface-secondary/70 pl-10 pr-9 text-[13px] font-normal text-text-primary placeholder:text-text-tertiary shadow-sm transition-all duration-fast outline-none hover:border-border-strong hover:bg-surface-secondary focus:border-brand-accent focus:bg-surface-primary focus:ring-1 focus:ring-brand-accent"
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setResults([]);
                inputRef.current?.focus();
              }}
              className="absolute right-3 rounded-radius-full p-1 text-text-tertiary transition-colors duration-fast hover:bg-surface-tertiary hover:text-text-primary"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </form>

      {/* Dropdown flotante con mayor área de despliegue */}
      {isOpen && (
        <div
          className={`z-modal overflow-hidden border border-border-primary/80 bg-surface-primary shadow-2xl backdrop-blur-md ${isMobile
              ? "absolute inset-x-0 top-[calc(100%+8px)] max-h-[75vh] rounded-radius-lg"
              : "absolute left-0 top-[calc(100%+8px)] w-[min(90vw,780px)] lg:w-[840px] max-h-[580px] rounded-radius-xl"
            }`}
        >
          <div className="h-full overflow-y-auto p-4 sm:p-5 scrollbar-thin scrollbar-thumb-border-primary">
            {loading && (
              <div className="flex flex-col items-center justify-center py-12 text-text-tertiary">
                <Loader2 className="mb-2 animate-spin text-brand-primary" size={22} />
                <Small className="text-text-tertiary">Buscando en catálogo...</Small>
              </div>
            )}

            {!loading && !query && (
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-text-tertiary">
                  <History size={14} />
                  <H4 className="text-[11px] uppercase tracking-wider">
                    {history.length > 0 ? "Búsquedas recientes" : "Sugerencias populares"}
                  </H4>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(history.length > 0 ? history : DEFAULT_SUGGESTIONS).map(
                    (term, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setQuery(term);
                          inputRef.current?.focus();
                        }}
                        className="rounded-radius-full border border-border-primary/80 bg-surface-secondary/70 px-3.5 py-1.5 text-xs font-medium text-text-secondary shadow-sm transition-colors duration-fast hover:border-border-strong hover:bg-surface-secondary hover:text-text-primary"
                      >
                        {term}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {!loading && results.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border-primary/60 pb-2">
                  <Small className="font-semibold text-text-primary">
                    Productos sugeridos ({results.length})
                  </Small>

                  <Link
                    href={`/productos?query=${encodeURIComponent(query)}`}
                    onClick={() => {
                      saveHistory(query.trim());
                      onSearchComplete?.();
                    }}
                    className="group inline-flex items-center gap-1 text-xs font-medium text-brand-accent transition-colors duration-fast hover:underline"
                  >
                    Ver todos ({results.length})
                    <ArrowRight size={13} className="transition-transform duration-fast group-hover:translate-x-0.5" />
                  </Link>
                </div>

                {/* Grid con mayor respiro: 2 columnas en mobile, 3 en sm, 4 en lg */}
                <div
                  className={`grid gap-3.5 sm:gap-4 ${isMobile
                      ? "grid-cols-2"
                      : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
                    }`}
                >
                  {results.slice(0, isMobile ? 6 : 8).map((item) => (
                    <ProductResultSearch key={item._id} item={item} />
                  ))}
                </div>
              </div>
            )}

            {!loading && query && results.length === 0 && (
              <div className="py-12 text-center">
                <Search size={28} className="mx-auto mb-3 text-text-tertiary opacity-50" />
                <P className="text-sm font-medium text-text-primary">
                  Sin resultados para &ldquo;{query}&rdquo;
                </P>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}