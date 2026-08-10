// frontend/src/features/v3/admin-search/hooks/use-admin-search.ts
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import type { ActionState } from "@/actions/product-actions-v3";

export function useAdminSearch<T>(
    searchAction: (query: string) => Promise<ActionState<T[]>>
) {
    const [inputValue, setInputValue] = useState("");
    const [debouncedValue] = useDebounce(inputValue, 500); // 500ms de espera

    const [results, setResults] = useState<T[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function performSearch() {
            if (!debouncedValue.trim()) {
                setResults([]);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const response = await searchAction(debouncedValue);
                if (isMounted) {
                    if (response?.ok && response.data) {
                        setResults(response.data);
                    } else {
                        setError(response?.error || "Error en la búsqueda");
                        setResults([]);
                    }
                }
            } catch (err) {
                console.error("Error en la búsqueda de administración:", err);
                if (isMounted) setError("Error de conexión");
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }

        performSearch();

        return () => {
            isMounted = false;
        };
    }, [debouncedValue, searchAction]);

    return {
        inputValue,
        setInputValue,
        results,
        isLoading,
        error
    };
}