"use client";

import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

const sizeMap = {
  sm: "w-4 h-4",
  md: "w-8 h-8",
  lg: "w-12 h-12",
};

const borderMap = {
  sm: "border-2",
  md: "border-4",
  lg: "border-4",
};

export const LoadingSpinner = React.memo(function LoadingSpinner({
  size = "md",
  className = "flex items-center justify-center",
  label = "Loading...",
}: LoadingSpinnerProps) {
  return (
    <div className={className}>
      <div className="flex flex-col items-center gap-2">
        <div
          className={`${sizeMap[size]} ${borderMap[size]} border-muted border-t-accent rounded-full animate-spin`}
        />
        {label && <p className="text-sm text-muted-foreground">{label}</p>}
      </div>
    </div>
  );
});
