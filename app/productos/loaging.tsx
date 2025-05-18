// app/products/loading.tsx
export default function Loading() {
    return (
        <main className="p-10 animate-pulse">
            <section className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                {/* Sidebar de filtros */}
                <aside className="sm:col-span-1">
                    <div className="h-6 bg-gray-300 rounded w-3/4 mb-4" />
                    <div className="space-y-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="h-4 bg-gray-200 rounded w-5/6" />
                        ))}
                    </div>
                </aside>

                {/* Lista de productos */}
                <section className="sm:col-span-3">
                    <div className="h-6 bg-gray-300 rounded w-1/2 mb-6" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                className="border p-4 rounded-lg shadow bg-white space-y-4"
                            >
                                <div className="h-40 bg-gray-200 rounded" />
                                <div className="h-4 bg-gray-300 rounded w-3/4" />
                                <div className="h-4 bg-gray-200 rounded w-1/2" />
                            </div>
                        ))}
                    </div>

                    {/* Paginación placeholder */}
                    <div className="flex justify-center gap-2 mt-10">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div
                                key={i}
                                className="w-8 h-8 bg-gray-300 rounded-full"
                            />
                        ))}
                    </div>
                </section>
            </section>
        </main>
    );
}
