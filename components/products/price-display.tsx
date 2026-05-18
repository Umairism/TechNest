"use client";

import React from "react";

interface PriceDisplayProps {
  price: number;
  originalPrice?: number;
  showDiscountPercent?: boolean;
  className?: string;
  priceClassName?: string;
  originalClassName?: string;
}

export const PriceDisplay = React.memo(function PriceDisplay({
  price,
  originalPrice,
  showDiscountPercent = true,
  className = "flex items-center gap-2",
  priceClassName = "text-lg font-bold text-accent",
  originalClassName = "text-sm text-muted-foreground line-through",
}: PriceDisplayProps) {
  const discountPercent = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <div className={className}>
      <span className={priceClassName}>${price.toFixed(2)}</span>
      {originalPrice && (
        <>
          <span className={originalClassName}>${originalPrice.toFixed(2)}</span>
          {showDiscountPercent && discountPercent > 0 && (
            <span className="text-xs font-bold text-red-500">-{discountPercent}%</span>
          )}
        </>
      )}
    </div>
  );
});
