// import ProductList from './components/ProductList';
// import CategoryFilter from './components/CategoryFilter';
// import ProductFilterSidebar from './components/ProductFilterSidebar'; // Opcional: Barra lateral de filtros
// import Pagination from './components/Pagination';             // Opcional: Paginación

export default function ShopPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Nuestros Productos</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Barra lateral de filtros (opcional) */}
        {/* <aside className="md:col-span-1">
          <ProductFilterSidebar />
        </aside> */}

        {/* Contenido principal: Lista de productos y filtros superiores */}
        <main className="md:col-span-3">
          <div className="mb-4 flex items-center justify-between">

            conttenido category filter
            {/* <CategoryFilter /> */}
            {/* <div className="flex items-center">
              <label htmlFor="sort" className="mr-2">Ordenar por:</label>
              <select id="sort" className="border rounded py-1 px-2">
                <option value="default">Recomendado</option>
                <option value="price-asc">Precio (Menor a Mayor)</option>
                <option value="price-desc">Precio (Mayor a Menor)</option>
              </select>
            </div> */}
          </div>

              PRODUCT LIST
          {/* <ProductList /> {/* Componente para mostrar la lista de productos */}

          {/* Paginación (opcional) */}
          {/* <Pagination /> */}
        </main>
      </div>
    </div>
  );
}