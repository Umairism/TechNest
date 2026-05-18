"use client";

import { useState, useEffect, useCallback } from "react";
import { EnhancedNavbar } from "@/components/navbar-enhanced";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { formatPKR } from "@/lib/api-utils";
import { toast } from "sonner";
import { Search, Loader2, ChevronDown } from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number;
  category: string;
  images: string[];
  rating: number;
  featured: boolean;
  inStock: number;
}

const CATEGORIES = ["All", "Laptops", "Phones", "Monitors", "Keyboards", "Mice"];
const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: page.toString(),
          limit: "20",
          ...(selectedCategory !== "All" && { category: selectedCategory }),
          ...(searchQuery && { search: searchQuery }),
          sort: sortBy,
        });

        const response = await fetch(`/api/products?${params}`);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        if (page === 1) {
          setProducts(data.data || []);
        } else {
          setProducts((prev) => [...prev, ...(data.data || [])]);
        }
        setHasMore(data.hasMore || false);
      } catch (error) {
        toast.error("Failed to load products");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, sortBy, searchQuery, page]);

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    setPage(1);
  }, []);

  const handleSortChange = useCallback((sort: string) => {
    setSortBy(sort);
    setPage(1);
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    setPage(1);
  }, []);

  const handleLoadMore = () => {
    setPage((p) => p + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <EnhancedNavbar />

      {/* Header */}
      <section className="py-12 border-b border-border bg-gradient-to-b from-secondary/10 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Shop Premium Components</h1>
          <p className="text-muted-foreground max-w-2xl">
            Browse our extensive selection of high-performance PC components
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <div className="space-y-6 sticky top-24 h-fit">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-semibold mb-3">Categories</h3>
              <div className="space-y-2">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`block w-full text-left px-3 py-2 rounded transition ${
                      selectedCategory === category
                        ? "bg-accent text-accent-foreground font-semibold"
                        : "hover:bg-secondary"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div>
              <h3 className="font-semibold mb-3">Sort By</h3>
              <div className="space-y-2">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className={`block w-full text-left px-3 py-2 rounded transition text-sm ${
                      sortBy === option.value
                        ? "bg-accent text-accent-foreground font-semibold"
                        : "hover:bg-secondary"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content - Products Grid */}
          <div className="lg:col-span-3">
            {loading && page === 1 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <Card key={i} className="p-4 animate-pulse">
                      <div className="h-48 bg-secondary rounded mb-4"></div>
                      <div className="h-6 bg-secondary rounded mb-2"></div>
                      <div className="h-4 bg-secondary rounded"></div>
                    </Card>
                  ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="mb-6 text-sm text-muted-foreground">
                  Showing {products.length} product{products.length !== 1 ? "s" : ""}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {products.map((product) => {
                    const discount = product.discountPrice
                      ? Math.round(
                          ((product.price - product.discountPrice) /
                            product.price) *
                            100
                        )
                      : 0;
                    const displayPrice = product.discountPrice || product.price;

                    return (
                      <Link
                        key={product.id}
                        href={`/product/${product.slug}`}
                        className="group"
                      >
                        <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow">
                          {/* Image */}
                          <div className="relative h-48 bg-secondary overflow-hidden">
                            {product.images?.[0] ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                No image
                              </div>
                            )}
                            {discount > 0 && (
                              <div className="absolute top-3 right-3 bg-red-600 text-white px-2 py-1 rounded text-sm font-semibold">
                                -{discount}%
                              </div>
                            )}
                            {product.featured && (
                              <div className="absolute top-3 left-3 bg-accent text-accent-foreground px-2 py-1 rounded text-xs font-semibold">
                                Featured
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="p-4">
                            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                              {product.category}
                            </p>
                            <h3 className="font-semibold line-clamp-2 group-hover:text-accent transition mb-2">
                              {product.name}
                            </h3>

                            {/* Price */}
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-lg font-bold">
                                {formatPKR(displayPrice)}
                              </span>
                              {product.discountPrice && (
                                <span className="text-sm text-muted-foreground line-through">
                                  {formatPKR(product.price)}
                                </span>
                              )}
                            </div>

                            {/* Rating & Stock */}
                            <div className="flex justify-between items-center text-sm">
                              <div className="flex items-center gap-1">
                                <span className="text-yellow-400">★</span>
                                <span className="font-semibold">{product.rating}</span>
                              </div>
                              <span
                                className={product.inStock > 0 ? "text-green-600" : "text-red-600"}
                              >
                                {product.inStock > 0
                                  ? `${product.inStock} left`
                                  : "Out of stock"}
                              </span>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    );
                  })}
                </div>

                {/* Load More Button */}
                {hasMore && (
                  <div className="flex justify-center">
                    <Button
                      onClick={handleLoadMore}
                      variant="outline"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4 mr-2" />
                          Load More
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground mb-4">No products found</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCategory("All");
                    setSearchQuery("");
                  }}
                >
                  Clear Filters
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
