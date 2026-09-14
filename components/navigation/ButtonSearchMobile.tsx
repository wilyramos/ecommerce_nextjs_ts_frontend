// frontend/components/navigation/ButtonSearchMobile.tsx
"use client";

import { Search, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import ButtonSearchFormStore from "../ui/ButtonSearchFormStore";

export default function ButtonSearchMobile() {
  const [openSearch, setOpenSearch] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpenSearch(false);
      }
    };

    if (openSearch) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openSearch]);

  return (
    <>
      <button
        onClick={() => setOpenSearch(!openSearch)}
        className="rounded-radius-full p-2 text-text-secondary transition-colors duration-fast hover:bg-surface-secondary hover:text-text-primary md:hidden"
        aria-label="Buscar productos"
      >
        {openSearch ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
      </button>

      {openSearch && (
        <div
          ref={containerRef}
          className="absolute inset-x-0 top-full z-dropdown border-b border-border-primary bg-surface-primary px-4 py-3 shadow-md md:hidden"
        >
          <ButtonSearchFormStore
            isMobile={true}
            onSearchComplete={() => setOpenSearch(false)}
          />
        </div>
      )}

      {openSearch && (
        <div
          className="fixed inset-x-0 bottom-0 top-12 z-modal bg-surface-inverse/40 backdrop-blur-xs md:hidden"
          onClick={() => setOpenSearch(false)}
        />
      )}
    </>
  );
}