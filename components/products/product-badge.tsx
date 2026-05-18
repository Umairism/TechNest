"use client";

import React from "react";

interface ProductBadgeProps {
  type: "featured" | "discount";
  discount?: number;
  className?: string;
}

export const ProductBadge = React.memo(function ProductBadge({
  type,
  discount,
  className = "absolute top-3 right-3",
}: ProductBadgeProps) {
  if (type === "featured") {
    return (
      <div className={`${className} bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-bold`}>
        Featured
      </div>
    );
  }

  if (type === "discount" && discount && discount > 0) {
    return (
      <div className={`${className} bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold`}>
        -{discount}%
      </div>
    );
  }

  return null;
});
