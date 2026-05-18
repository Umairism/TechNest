"use client";

import React, { useCallback } from "react";

interface SortOption {
  value: string;
  label: string;
}

interface SortSelectorProps {
  options: SortOption[];
  selectedSort: string;
  onSortChange: (sort: string) => void;
  className?: string;
}

export const SortSelector = React.memo(function SortSelector({
  options,
  selectedSort,
  onSortChange,
  className = "",
}: SortSelectorProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onSortChange(e.target.value);
    },
    [onSortChange]
  );

  return (
    <select
      value={selectedSort}
      onChange={handleChange}
      className={`w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer transition-colors ${className}`}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
});
