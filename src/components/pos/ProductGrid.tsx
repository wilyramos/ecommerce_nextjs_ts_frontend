/* File: src/components/pos/ProductGrid.tsx 
    @Author: whramos 
    @Description: Responsive grid for products. Zero-Any implementation.
*/

"use client";

import React from 'react';
import { Product } from "@/src/schemas/product.schema";
import { ProductCard } from './ProductCard';

interface ProductGridProps {
    products: Product[];
}

export const ProductGrid = ({ products }: ProductGridProps) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 lg:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {products.map((product) => (
                <ProductCard 
                    key={product._id} 
                    product={product} 
                />
            ))}
        </div>
    );
};