"use client";

import React from "react";

export const SkeletonCard = React.memo(function SkeletonCard() {
  return (
    <div className="animate-pulse bg-card border border-border rounded-lg overflow-hidden">
      {/* Image skeleton */}
      <div className="w-full aspect-square bg-secondary" />

      {/* Content skeleton */}
      <div className="p-4 space-y-4">
        {/* Title skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-2/4" />
        </div>

        {/* Description skeleton */}
        <div className="space-y-2">
          <div className="h-3 bg-muted rounded w-full" />
          <div className="h-3 bg-muted rounded w-5/6" />
        </div>

        {/* Rating skeleton */}
        <div className="h-4 bg-muted rounded w-1/2" />

        {/* Price skeleton */}
        <div className="h-4 bg-muted rounded w-1/3" />

        {/* Button skeleton */}
        <div className="h-10 bg-muted rounded w-full" />
      </div>
    </div>
  );
});
