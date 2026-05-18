"use client";

import React from "react";
import Link from "next/link";

interface CartSummaryProps {
  subtotal: number;
  tax: number;
  total: number;
  itemCount: number;
  isCheckoutPage?: boolean;
}

export const CartSummary = React.memo(function CartSummary({
  subtotal,
  tax,
  total,
  itemCount,
  isCheckoutPage = false,
}: CartSummaryProps) {
  return (
    <div className="sticky top-24 p-6 bg-card border border-border rounded-lg space-y-4">
      <h3 className="text-xl font-bold">Order Summary</h3>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tax (8%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="border-t border-border pt-2 flex justify-between font-bold text-base">
          <span>Total</span>
          <span className="text-accent">${total.toFixed(2)}</span>
        </div>
      </div>

      {!isCheckoutPage && (
        <Link
          href="/checkout"
          className="block w-full py-3 bg-accent text-accent-foreground rounded-lg font-semibold text-center hover:bg-accent/90 transition-colors"
        >
          Proceed to Checkout
        </Link>
      )}
    </div>
  );
});
