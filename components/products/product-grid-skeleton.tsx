"use client";

import React from "react";
import { SkeletonCard } from "@/components/ui/skeleton-card";

interface ProductGridSkeletonProps {
  count?: number;
  gridClassName?: string;
}

export const ProductGridSkeleton = React.memo(function ProductGridSkeleton({
  count = 6,
  gridClassName = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
}: ProductGridSkeletonProps) {
  return (
    <div className={gridClassName}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
});
