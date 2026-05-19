"use client";

import { Navbar } from "@/components/navbar";
import { useState } from "react";
import { Package, Truck, CheckCircle, Clock, MapPin } from "lucide-react";

export default function OrderTrackingPage() {
  const [orderId, setOrderId] = useState("");
  const [trackingData, setTrackingData] = useState<any>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId) {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) {
          alert("Order not found");
          return;
        }
        const data = await response.json();
        setTrackingData(data.data);
      } catch (error) {
        console.error("Error fetching order:", error);
        alert("Failed to fetch order details");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="py-20 border-b border-border bg-gradient-to-b from-secondary/10 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-4">Track Your Order</h1>
          <p className="text-xl text-muted-foreground">
            Enter your order ID to see real-time tracking updates
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Form */}
        <div className="mb-12">
          <form onSubmit={handleTrack} className="flex gap-4">
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter your order ID..."
              className="flex-1 px-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button
              type="submit"
              className="px-8 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition-colors"
            >
              Track
            </button>
          </form>
        </div>

        {/* Tracking Information */}
        {trackingData && (
          <div className="space-y-12">
            {/* Status Overview */}
            <div className="bg-card border border-border rounded-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <p className="text-muted-foreground text-sm mb-2">Order ID</p>
                  <p className="text-2xl font-bold font-mono">
                    {trackingData.orderId}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm mb-2">Status</p>
                  <p className="text-2xl font-bold text-accent">
                    {trackingData.status}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm mb-2">
                    Estimated Delivery
                  </p>
                  <p className="text-2xl font-bold">{trackingData.estimatedDelivery}</p>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-border">
                <p className="text-muted-foreground text-sm mb-2">
                  Current Location
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-accent" />
                  <span className="font-semibold">
                    {trackingData.currentLocation}
                  </span>
                </p>
              </div>
            </div>

            {/* Tracking Timeline */}
            <div>
              <h2 className="text-2xl font-bold mb-8">Delivery Timeline</h2>

              <div className="space-y-6">
                {trackingData.stages.map(
                  (stage: any, index: number) => {
                    const Icon = stage.icon;
                    return (
                      <div key={index} className="flex gap-6">
                        {/* Timeline Node */}
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                              stage.completed
                                ? "bg-green-500/20 border-green-500 text-green-500"
                                : "bg-muted border-border text-muted-foreground"
                            }`}
                          >
                            <Icon className="w-6 h-6" />
                          </div>

                          {index < trackingData.stages.length - 1 && (
                            <div
                              className={`w-1 h-16 mt-2 ${
                                stage.completed ? "bg-green-500" : "bg-border"
                              }`}
                            />
                          )}
                        </div>

                        {/* Timeline Content */}
                        <div className="pb-8">
                          <h3
                            className={`text-lg font-semibold mb-1 ${
                              stage.completed
                                ? "text-foreground"
                                : "text-muted-foreground"
                            }`}
                          >
                            {stage.name}
                          </h3>
                          <p
                            className={`text-sm ${
                              stage.completed
                                ? "text-muted-foreground"
                                : "text-muted-foreground"
                            }`}
                          >
                            {stage.date}
                          </p>
                          {stage.completed && (
                            <p className="text-xs text-green-500 mt-2">
                              ✓ Completed
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-card border border-border rounded-lg p-8">
              <h3 className="text-lg font-bold mb-4">Delivery Details</h3>
              <div className="space-y-3">
                <p className="text-muted-foreground">
                  Your package is currently in transit and will be delivered to your
                  address within 4-5 business days.
                </p>
                <p className="text-muted-foreground">
                  You will receive an email notification when your package is out for
                  delivery. A signature may be required upon delivery.
                </p>
                <p className="text-muted-foreground">
                  If you have any questions, please contact our support team at{" "}
                  <span className="text-accent">support@technest.com</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!trackingData && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">
              Enter an order ID above to track your shipment
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
