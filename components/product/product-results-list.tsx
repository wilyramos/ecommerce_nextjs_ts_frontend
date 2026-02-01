// src/components/product/product-results-list.tsx
import ProductCard from './product-card';
import Pagination from '../ui/Pagination';
import { ProductResponse } from '@/src/schemas';

interface ProductResultsListProps {
  products: ProductResponse[];
  totalPages: number;
  currentPage: number;
}

export default function ProductResultsList({ 
  products, 
  totalPages, 
  currentPage 
}: ProductResultsListProps) {
  
  if (products.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed text-center">
        <p className="text-lg font-medium text-muted-foreground">
          No se encontraron productos con estos criterios.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      
      <Pagination 
        pathname="/search"
      totalPages={totalPages} currentPage={currentPage} />
    </div>
  );
}