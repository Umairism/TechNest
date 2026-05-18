"use client";

import { Navbar } from "@/components/navbar";
import { PRODUCTS, CATEGORIES } from "@/lib/constants";
import { useCart } from "@/lib/cart-context";
import { X } from "lucide-react";
import { useState, useMemo } from "react";

type BuilderSelection = {
  [key: string]: string; // category -> product id
};

export default function PCBuilderPage() {
  const { addItem } = useCart();
  const [selection, setSelection] = useState<BuilderSelection>({});
  const [searchCategory, setSearchCategory] = useState<string | null>(null);

  const categories = CATEGORIES.filter((c) => c !== "All");

  const categoryProducts = useMemo(() => {
    return categories.reduce(
      (acc, category) => {
        acc[category] = PRODUCTS.filter((p) => p.category === category);
        return acc;
      },
      {} as Record<string, typeof PRODUCTS>
    );
  }, []);

  const selectedProducts = Object.entries(selection).map(([, productId]) =>
    PRODUCTS.find((p) => p.id === productId)
  );

  const totalCost = selectedProducts.reduce((sum, p) => sum + (p?.price || 0), 0);

  const handleSelectProduct = (category: string, productId: string) => {
    setSelection((prev) => ({
      ...prev,
      [category]: productId,
    }));
  };

  const handleRemoveProduct = (category: string) => {
    setSelection((prev) => {
      const newSelection = { ...prev };
      delete newSelection[category];
      return newSelection;
    });
  };

  const handleAddBuildToCart = () => {
    selectedProducts.forEach((product) => {
      if (product) addItem(product, 1);
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="py-20 border-b border-border bg-gradient-to-b from-secondary/10 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-4">Custom PC Builder</h1>
          <p className="text-xl text-muted-foreground">
            Build your dream PC by selecting components from each category
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories and Selection */}
          <div className="lg:col-span-2 space-y-6">
            {categories.map((category) => {
              const selectedProductId = selection[category];
              const selectedProduct = PRODUCTS.find((p) => p.id === selectedProductId);

              return (
                <div
                  key={category}
                  className="bg-card border border-border rounded-lg p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">{category}</h3>
                    {selectedProduct && (
                      <button
                        onClick={() => handleRemoveProduct(category)}
                        className="text-red-500 hover:bg-red-500/20 p-2 rounded transition"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  {selectedProduct ? (
                    <div className="space-y-3">
                      <div className="bg-secondary rounded-lg p-4">
                        <h4 className="font-semibold mb-2">{selectedProduct.name}</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          {selectedProduct.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-accent">
                            ${selectedProduct.price.toFixed(2)}
                          </span>
                          <button
                            onClick={() => handleRemoveProduct(category)}
                            className="text-accent hover:underline"
                          >
                            Change
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSearchCategory(category)}
                      className="w-full py-3 border border-dashed border-border text-foreground rounded-lg hover:bg-secondary/50 transition"
                    >
                      + Select {category}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Build Summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-20 bg-card border border-border rounded-lg p-6 space-y-6">
              <h2 className="text-2xl font-bold">Build Summary</h2>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {selectedProducts.map((product) =>
                  product ? (
                    <div
                      key={product.id}
                      className="flex justify-between items-start gap-4 pb-3 border-b border-border last:border-0"
                    >
                      <div>
                        <p className="font-semibold text-sm">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {product.category}
                        </p>
                      </div>
                      <p className="font-bold text-accent">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                  ) : null
                )}
              </div>

              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Components Selected</span>
                  <span className="font-semibold">{selectedProducts.length}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-accent">${totalCost.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleAddBuildToCart}
                disabled={selectedProducts.length === 0}
                className="w-full py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed transition-colors"
              >
                Add Build to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Selection Modal */}
      {searchCategory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
              <h3 className="text-xl font-bold">Select {searchCategory}</h3>
              <button
                onClick={() => setSearchCategory(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 space-y-2">
              {categoryProducts[searchCategory]?.map((product) => (
                <button
                  key={product.id}
                  onClick={() => {
                    handleSelectProduct(searchCategory, product.id);
                    setSearchCategory(null);
                  }}
                  className="w-full text-left p-4 bg-secondary hover:bg-secondary/80 rounded-lg transition flex justify-between items-start gap-4"
                >
                  <div>
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.description}
                    </p>
                  </div>
                  <p className="font-bold text-accent flex-shrink-0">
                    ${product.price.toFixed(2)}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
