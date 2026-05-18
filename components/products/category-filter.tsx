"use client";

import React, { useCallback } from "react";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  className?: string;
}

export const CategoryFilter = React.memo(function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
  className = "space-y-3",
}: CategoryFilterProps) {
  const handleChange = useCallback(
    (category: string) => {
      onCategoryChange(category);
    },
    [onCategoryChange]
  );

  return (
    <div className={className}>
      <h3 className="font-semibold text-foreground mb-3">Category</h3>
      <div className="space-y-2">
        {categories.map((category) => (
          <label
            key={category}
            className="flex items-center cursor-pointer group"
          >
            <input
              type="radio"
              name="category"
              value={category}
              checked={selectedCategory === category}
              onChange={() => handleChange(category)}
              className="w-4 h-4 rounded border-border text-accent"
            />
            <span className="ml-3 text-sm text-muted-foreground group-hover:text-foreground transition">
              {category}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
});
