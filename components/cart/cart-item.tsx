"use client";

import React, { useCallback } from "react";
import Link from "next/link";
import { CartItem as CartItemType } from "@/lib/cart-context";
import { Trash2, Plus, Minus } from "lucide-react";
import { PriceDisplay } from "@/components/products/price-display";

interface CartItemProps {
  item: CartItemType;
  onRemove: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

function CartItemComponent({ item, onRemove, onUpdateQuantity }: CartItemProps) {
  const handleRemove = useCallback(() => {
    onRemove(item.product.id);
  }, [item.product.id, onRemove]);

  const handleIncrement = useCallback(() => {
    onUpdateQuantity(item.product.id, item.quantity + 1);
  }, [item.product.id, item.quantity, onUpdateQuantity]);

  const handleDecrement = useCallback(() => {
    onUpdateQuantity(item.product.id, Math.max(0, item.quantity - 1));
  }, [item.product.id, item.quantity, onUpdateQuantity]);

  const itemTotal = item.product.price * item.quantity;

  return (
    <div className="flex gap-4 p-4 bg-card border border-border rounded-lg hover:border-accent/50 transition">
      {/* Product Image */}
      <div className="w-24 h-24 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
        <span className="text-3xl">[IMG]</span>
      </div>

      {/* Product Info */}
      <div className="flex-1">
        <Link
          href={`/product/${item.product.id}`}
          className="font-semibold hover:text-accent transition"
        >
          {item.product.name}
        </Link>
        <p className="text-sm text-muted-foreground">{item.product.description}</p>
        <div className="mt-2 text-sm font-semibold text-accent">
          ${item.product.price.toFixed(2)} each
        </div>
      </div>

      {/* Quantity & Actions */}
      <div className="flex flex-col items-end gap-4">
        {/* Quantity Control */}
        <div className="flex items-center gap-2 bg-secondary rounded-lg p-2">
          <button
            onClick={handleDecrement}
            className="p-1 hover:bg-accent hover:text-accent-foreground rounded transition"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="font-semibold min-w-8 text-center">{item.quantity}</span>
          <button
            onClick={handleIncrement}
            className="p-1 hover:bg-accent hover:text-accent-foreground rounded transition"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Price & Remove */}
        <div className="text-right">
          <div className="font-bold text-accent mb-2">
            ${itemTotal.toFixed(2)}
          </div>
          <button
            onClick={handleRemove}
            className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export const CartItem = React.memo(CartItemComponent);
