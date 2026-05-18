"use client";

import React from "react";
import { Product } from "@/lib/constants";
import { ProductCard } from "@/components/product-card";

interface ProductGridProps {
  products: Product[];
  className?: string;
  gridClassName?: string;
}

export const ProductGrid = React.memo(function ProductGrid({
  products,
  className = "space-y-4",
  gridClassName = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className={className}>
        <p className="text-center text-muted-foreground py-12">
          No products found. Try adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <div className={gridClassName}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
});
