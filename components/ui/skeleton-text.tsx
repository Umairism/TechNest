"use client";

import React from "react";

interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

export const SkeletonText = React.memo(function SkeletonText({
  lines = 3,
  className = "space-y-2",
}: SkeletonTextProps) {
  return (
    <div className={`${className} animate-pulse`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-4 bg-muted rounded ${
            i === lines - 1 ? "w-2/3" : "w-full"
          }`}
        />
      ))}
    </div>
  );
});
