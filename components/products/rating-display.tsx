"use client";

import React from "react";
import { Star } from "lucide-react";

interface RatingDisplayProps {
  rating: number;
  reviews: number;
  showCount?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "w-3 h-3",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

export const RatingDisplay = React.memo(function RatingDisplay({
  rating,
  reviews,
  showCount = true,
  size = "md",
  className = "flex items-center gap-2",
}: RatingDisplayProps) {
  const starSize = sizeMap[size];

  return (
    <div className={className}>
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`${starSize} ${
              i < Math.floor(rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted"
            }`}
          />
        ))}
      </div>
      {showCount && (
        <span className="text-xs text-muted-foreground">
          {reviews} review{reviews !== 1 ? "s" : ""}
        </span>
      )}
    </div>
  );
});
