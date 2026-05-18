"use client";

import { useCart } from "@/lib/cart-context";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { EnhancedNavbar } from "@/components/navbar-enhanced";
import { formatPKR } from "@/lib/api-utils";

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCart();
  const { data: session } = useSession();
  const router = useRouter();

  const subtotal = items.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const shippingCost = items.length > 0 ? 200 : 0;
  const total = subtotal + tax + shippingCost;

  const handleCheckout = () => {
    if (!session?.user) {
      toast.error("Please sign in to checkout");
      router.push("/auth/signin?callbackUrl=/checkout");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-background">
      <EnhancedNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

        {items.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-6">Your cart is empty</p>
            <Button asChild>
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex gap-4 pb-4 border-b border-border last:border-0"
                    >
                      {/* Product Image */}
                      <div className="w-24 h-24 bg-secondary rounded flex items-center justify-center flex-shrink-0">
                        {item.product.images?.[0] ? (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <div className="text-muted-foreground">No image</div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <Link
                          href={`/product/${item.product.slug}`}
                          className="text-lg font-semibold hover:text-accent transition"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          SKU: {item.product.sku}
                        </p>
                        <p className="text-lg font-semibold mt-2">
                          {formatPKR(item.product.price)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col items-end justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                Math.max(1, item.quantity - 1)
                              )
                            }
                            className="px-2 py-1 border border-border rounded hover:bg-secondary"
                          >
                            −
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="px-2 py-1 border border-border rounded hover:bg-secondary"
                          >
                            +
                          </button>
                        </div>

                        {/* Total & Remove */}
                        <div className="text-right">
                          <p className="font-semibold">
                            {formatPKR(item.product.price * item.quantity)}
                          </p>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="text-red-600 hover:text-red-700 flex items-center gap-1 mt-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="p-6 sticky top-24">
                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

                <div className="space-y-3 mb-6 pb-6 border-b border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPKR(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (8%)</span>
                    <span>{formatPKR(tax)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{formatPKR(shippingCost)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="font-semibold">Total</span>
                  <span className="text-2xl font-bold">{formatPKR(total)}</span>
                </div>

                <Button
                  onClick={handleCheckout}
                  className="w-full mb-3"
                  size="lg"
                >
                  Proceed to Checkout
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  asChild
                >
                  <Link href="/shop">Continue Shopping</Link>
                </Button>

                {!session?.user && (
                  <div className="mt-4 p-3 bg-secondary rounded text-sm">
                    <p className="text-muted-foreground">
                      You need to{" "}
                      <Link href="/auth/signin" className="text-accent hover:underline">
                        sign in
                      </Link>{" "}
                      to checkout
                    </p>
                  </div>
                )}
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
