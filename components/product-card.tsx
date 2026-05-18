"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { Product } from "@/lib/constants";
import { useCart } from "@/lib/cart-context";
import { ShoppingCart } from "lucide-react";
import { ProductImage } from "./products/product-image";
import { ProductBadge } from "./products/product-badge";
import { RatingDisplay } from "./products/rating-display";
import { PriceDisplay } from "./products/price-display";

interface ProductCardProps {
  product: Product;
}

function ProductCardComponent({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = useCallback(() => {
    addItem(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  }, [addItem, product]);

  return (
    <div className="group relative bg-card border border-border rounded-lg overflow-hidden hover:border-accent/50 transition-all duration-300 hover-lift animate-fade-in-up">
      {/* Image Container with Badges */}
      <ProductImage />
      <ProductBadge type="featured" className={product.featured ? "absolute top-3 left-3" : "hidden"} />
      <ProductBadge type="discount" discount={discount} className={discount > 0 ? "absolute top-3 right-3" : "hidden"} />

      {/* Content */}
      <div className="p-4 flex flex-col h-full">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold text-foreground line-clamp-2 hover:text-accent transition mb-2">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {product.description}
        </p>

        {/* Rating */}
        <div className="mb-3">
          <RatingDisplay rating={product.rating} reviews={product.reviews} size="md" />
        </div>

        {/* Price */}
        <div className="mb-4">
          <PriceDisplay price={product.price} originalPrice={product.originalPrice} />
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className={`w-full py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
            isAdded
              ? "bg-green-600 text-white"
              : "bg-accent text-accent-foreground hover:bg-accent/90"
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          {isAdded ? "Added!" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}

export const ProductCard = React.memo(ProductCardComponent);
