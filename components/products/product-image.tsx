"use client";

import React from "react";

interface ProductImageProps {
  emoji?: string;
  alt?: string;
  className?: string;
  imageClassName?: string;
}

export const ProductImage = React.memo(function ProductImage({
  emoji = "[IMG]",
  alt = "Product image",
  className = "relative w-full aspect-square bg-secondary overflow-hidden",
  imageClassName = "w-full h-full bg-gradient-to-br from-secondary to-muted flex items-center justify-center group-hover:scale-105 transition-transform duration-300",
}: ProductImageProps) {
  return (
    <div className={className}>
      <div className={imageClassName}>
        <span className="text-6xl" title={alt}>
          {emoji}
        </span>
      </div>
    </div>
  );
});
