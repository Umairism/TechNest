"use client";

import { useState, useEffect, use } from "react";
import { useCart } from "@/lib/cart-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EnhancedNavbar } from "@/components/navbar-enhanced";
import { formatPKR } from "@/lib/api-utils";
import { toast } from "sonner";
import { ArrowLeft, ShoppingCart, Star } from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  rating: number;
  reviews: number;
  category: string;
  images: string[];
  sku: string;
  featured: boolean;
  inStock: number;
}

export default function ProductPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise);
  const router = useRouter();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`);
        if (!response.ok) {
          throw new Error("Product not found");
        }
        const data = await response.json();
        setProduct(data.data);
      } catch (error) {
        toast.error("Failed to load product");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  const handleAddToCart = () => {
    if (!product) return;

    setIsAdding(true);
    try {
      addItem(product, quantity);
      toast.success(`Added ${quantity} item(s) to cart`);
      setQuantity(1);
    } catch (error) {
      toast.error("Failed to add to cart");
      console.error(error);
    } finally {
      setIsAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <EnhancedNavbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-96 bg-secondary rounded mb-8"></div>
            <div className="h-12 bg-secondary rounded mb-4 w-1/2"></div>
            <div className="h-6 bg-secondary rounded w-full mb-4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <EnhancedNavbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Product not found</h1>
            <p className="text-muted-foreground mb-6">
              The product you're looking for doesn't exist.
            </p>
            <Button asChild>
              <Link href="/shop">Back to Shop</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;
  const displayPrice = product.discountPrice || product.price;

  return (
    <div className="min-h-screen bg-background">
      <EnhancedNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative w-full aspect-square bg-secondary rounded-lg overflow-hidden">
              {product.images?.[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  No image available
                </div>
              )}
              {discount > 0 && (
                <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  -{discount}%
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square bg-secondary rounded-lg overflow-hidden cursor-pointer hover:opacity-75 transition"
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Category & Title */}
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">
                {product.category}
              </p>
              <h1 className="text-4xl font-bold">{product.name}</h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold">{formatPKR(displayPrice)}</span>
                {product.discountPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    {formatPKR(product.price)}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">About this product</h3>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            {/* Stock Status */}
            <Card className="p-4 bg-secondary/50">
              <div className="flex items-center justify-between">
                <span className="font-semibold">In Stock:</span>
                <span
                  className={`font-semibold ${
                    product.inStock > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {product.inStock > 0
                    ? `${product.inStock} available`
                    : "Out of stock"}
                </span>
              </div>
            </Card>

            {/* SKU */}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">SKU:</span>
              <span className="font-mono">{product.sku}</span>
            </div>

            {/* Add to Cart */}
            <div className="space-y-3 pt-4">
              {product.inStock > 0 ? (
                <>
                  {/* Quantity */}
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">Quantity:</span>
                    <div className="flex items-center gap-2 border border-border rounded-lg">
                      <button
                        onClick={() =>
                          setQuantity(Math.max(1, quantity - 1))
                        }
                        className="px-3 py-2 hover:bg-secondary transition"
                      >
                        −
                      </button>
                      <span className="px-4 py-2 min-w-12 text-center">{quantity}</span>
                      <button
                        onClick={() =>
                          setQuantity(Math.min(product.inStock, quantity + 1))
                        }
                        className="px-3 py-2 hover:bg-secondary transition"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <Button
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    size="lg"
                    className="w-full"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {isAdding ? "Adding..." : "Add to Cart"}
                  </Button>
                </>
              ) : (
                <Card className="p-4 bg-red-100/20 border-red-200">
                  <p className="text-red-600 font-semibold">Out of Stock</p>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full mt-3"
                    asChild
                  >
                    <Link href="/shop">Browse Other Products</Link>
                  </Button>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-16 pt-8 border-t border-border">
          <h2 className="text-2xl font-bold mb-8">Continue Shopping</h2>
          <Button asChild variant="outline" size="lg">
            <Link href="/shop">Back to Shop</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
