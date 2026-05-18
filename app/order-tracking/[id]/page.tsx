"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EnhancedNavbar } from "@/components/navbar-enhanced";
import { formatPKR } from "@/lib/api-utils";
import { toast } from "sonner";
import { Loader2, MapPin, Package, Truck, CheckCircle2 } from "lucide-react";

interface Order {
  id: string;
  createdAt: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  total: number;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    phone: string;
  };
  items: Array<{
    product: {
      name: string;
      sku: string;
    };
    quantity: number;
    price: number;
  }>;
  trackingNumber?: string;
}

const STATUS_STEPS = [
  { value: "pending", label: "Order Placed", icon: Package },
  { value: "processing", label: "Processing", icon: Loader2 },
  { value: "shipped", label: "Shipped", icon: Truck },
  { value: "delivered", label: "Delivered", icon: CheckCircle2 },
];

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const PAYMENT_COLORS: Record<string, string> = {
  pending: "text-yellow-600",
  completed: "text-green-600",
  failed: "text-red-600",
};

export default function OrderTrackingPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user) {
      toast.error("Please sign in to view order");
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/orders/${params.id}`);
        if (!response.ok) {
          throw new Error("Order not found");
        }
        const data = await response.json();
        setOrder(data.data);
      } catch (error) {
        toast.error("Failed to load order");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [params.id, session]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <EnhancedNavbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-secondary rounded"></div>
            <div className="h-64 bg-secondary rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <EnhancedNavbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="p-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Order not found</h2>
            <p className="text-muted-foreground mb-6">
              We couldn't find the order you're looking for.
            </p>
            <Button asChild>
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const currentStatusIndex = STATUS_STEPS.findIndex((s) => s.value === order.status);

  return (
    <div className="min-h-screen bg-background">
      <EnhancedNavbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8">Order Tracking</h1>

        {/* Order Status */}
        <Card className="p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Order Number</p>
              <p className="text-2xl font-bold font-mono">{order.id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Order Status</p>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${STATUS_COLORS[order.status]}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Progress Timeline */}
          <div className="space-y-4">
            <h3 className="font-semibold">Delivery Progress</h3>
            <div className="relative">
              {STATUS_STEPS.map((step, index) => (
                <div key={step.value} className="flex mb-4">
                  <div className="flex flex-col items-center mr-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        index <= currentStatusIndex
                          ? "bg-accent text-accent-foreground"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      <step.icon className="w-5 h-5" />
                    </div>
                    {index < STATUS_STEPS.length - 1 && (
                      <div
                        className={`w-1 h-12 my-1 ${
                          index < currentStatusIndex ? "bg-accent" : "bg-secondary"
                        }`}
                      ></div>
                    )}
                  </div>
                  <div className="pt-2">
                    <p className="font-semibold">{step.label}</p>
                    {index === currentStatusIndex && (
                      <p className="text-sm text-muted-foreground">Currently here</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Tracking Number */}
            {order.trackingNumber && (
              <div className="mt-6 p-4 bg-secondary rounded">
                <p className="text-sm text-muted-foreground mb-1">Tracking Number</p>
                <p className="font-mono font-semibold">{order.trackingNumber}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Payment Status */}
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Payment Method</p>
              <p className="font-semibold capitalize">{order.paymentMethod.replace("-", " ")}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Payment Status</p>
              <p
                className={`font-semibold capitalize ${
                  PAYMENT_COLORS[order.paymentStatus]
                }`}
              >
                {order.paymentStatus}
              </p>
            </div>
          </div>
        </Card>

        {/* Shipping Address */}
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Shipping Address
          </h3>
          <div className="text-muted-foreground">
            <p className="font-semibold text-foreground">
              {order.shippingAddress.firstName} {order.shippingAddress.lastName}
            </p>
            <p>{order.shippingAddress.address}</p>
            <p>{order.shippingAddress.city}</p>
            <p>{order.shippingAddress.phone}</p>
          </div>
        </Card>

        {/* Order Items */}
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Order Items</h3>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center pb-4 border-b border-border last:border-0"
              >
                <div>
                  <p className="font-semibold">{item.product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    SKU: {item.product.sku} | Qty: {item.quantity}
                  </p>
                </div>
                <p className="font-semibold">{formatPKR(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Order Total */}
        <Card className="p-6 mb-8 bg-secondary/50">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Order Total</span>
            <span className="text-3xl font-bold">{formatPKR(order.total)}</span>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button asChild variant="outline" className="flex-1">
            <Link href="/shop">Continue Shopping</Link>
          </Button>
          <Button asChild className="flex-1">
            <Link href="/dashboard">View All Orders</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
