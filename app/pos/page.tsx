import VentaCart from "@/components/POS/VentaCart";
import { getProductsByFilter } from "@/src/services/products";
import ProductCardPOS from "@/components/POS/ProductCardPOS";

type POSPageProps = {
    searchParams?: {
        page?: string;
        limit?: string;
        category?: string;
        priceRange?: string;
        query?: string;
    };
};

export default async function POSpage({ searchParams }: POSPageProps) {
    

    const params = await searchParams;

    const {
        page = "1",
        limit = "10",
        category = "",
        priceRange = "0-1000",
        query = "",
    } = params || {};

    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);

    // Obtener productos
    const productos = await getProductsByFilter({
        page: parsedPage,
        limit: parsedLimit,
        category,
        priceRange,
        query,
    });

    // Manejo de error si los productos no se cargan
    if (!productos) {
        return (
            <div className="flex h-screen items-center justify-center p-4 text-red-500">
                Error al cargar los productos. Por favor, inténtalo de nuevo más tarde.
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-32px)] gap-4">
            {/* Sección de Productos */}
            <div className="flex flex-1 flex-col overflow-hidden">
                <h1 className="mb-4 text-2xl font-bold text-gray-800">Punto de Venta</h1>

                {/* Buscador de Productos */}
                <form className="mb-2 flex" action="/pos">
                    <input
                        type="text"
                        name="query"
                        placeholder="Buscar producto..."
                        defaultValue={query}
                        className=""
                    />
                    <button
                        type="submit"
                        className=""
                    >
                        Buscar
                    </button>
                </form>

                {/* Lista de Productos */}
                <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-gray-400">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {productos.products.length > 0 ? (
                            productos.products.map((product) => (
                                <ProductCardPOS key={product._id} product={product} />
                            ))
                        ) : (
                            <p className="col-span-full text-center text-gray-500">
                                No se encontraron productos con los criterios de búsqueda.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Carrito de Venta */}
            <aside className="scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-gray-400 w-[380px] overflow-y-auto border-l bg-white p-4 shadow-md">
                <h2 className="mb-4 text-xl font-semibold text-gray-700">🛒 Carrito</h2>
                <VentaCart />
            </aside>
        </div>
    );
}