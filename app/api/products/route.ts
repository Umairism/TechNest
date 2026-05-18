import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Mock products for development/testing
const MOCK_PRODUCTS = [
  {
    id: "1",
    name: "Dell XPS 13 Laptop",
    slug: "dell-xps-13",
    price: 185000,
    discountPrice: 165000,
    category: "Laptops",
    images: ["https://via.placeholder.com/300x200?text=XPS+13"],
    rating: 4.8,
    featured: true,
    inStock: 5,
    description: "Powerful and lightweight laptop for professionals",
  },
  {
    id: "2",
    name: "iPhone 15 Pro",
    slug: "iphone-15-pro",
    price: 250000,
    discountPrice: null,
    category: "Phones",
    images: ["https://via.placeholder.com/300x200?text=iPhone+15"],
    rating: 4.9,
    featured: true,
    inStock: 12,
    description: "Latest flagship smartphone with advanced camera",
  },
  {
    id: "3",
    name: "LG 27\" 4K Monitor",
    slug: "lg-27-4k-monitor",
    price: 95000,
    discountPrice: 85000,
    category: "Monitors",
    images: ["https://via.placeholder.com/300x200?text=LG+Monitor"],
    rating: 4.6,
    featured: false,
    inStock: 8,
    description: "Ultra HD display for content creators and gamers",
  },
  {
    id: "4",
    name: "Mechanical Gaming Keyboard RGB",
    slug: "mechanical-keyboard-rgb",
    price: 12000,
    discountPrice: 9999,
    category: "Keyboards",
    images: ["https://via.placeholder.com/300x200?text=Gaming+Keyboard"],
    rating: 4.7,
    featured: false,
    inStock: 20,
    description: "High-performance mechanical keyboard with RGB lighting",
  },
  {
    id: "5",
    name: "Logitech MX Master 3S",
    slug: "logitech-mx-master-3s",
    price: 18000,
    discountPrice: null,
    category: "Mice",
    images: ["https://via.placeholder.com/300x200?text=MX+Master"],
    rating: 4.8,
    featured: true,
    inStock: 15,
    description: "Professional-grade wireless mouse with precision tracking",
  },
  {
    id: "6",
    name: "MacBook Pro 16\"",
    slug: "macbook-pro-16",
    price: 450000,
    discountPrice: 425000,
    category: "Laptops",
    images: ["https://via.placeholder.com/300x200?text=MacBook+Pro"],
    rating: 4.9,
    featured: true,
    inStock: 3,
    description: "Ultimate laptop for professionals and developers",
  },
  {
    id: "7",
    name: "Samsung 32\" Curved Gaming Monitor",
    slug: "samsung-gaming-monitor",
    price: 120000,
    discountPrice: 98000,
    category: "Monitors",
    images: ["https://via.placeholder.com/300x200?text=Gaming+Monitor"],
    rating: 4.5,
    featured: false,
    inStock: 6,
    description: "High refresh rate curved display for immersive gaming",
  },
  {
    id: "8",
    name: "Microsoft Surface Pro 9",
    slug: "surface-pro-9",
    price: 220000,
    discountPrice: 195000,
    category: "Laptops",
    images: ["https://via.placeholder.com/300x200?text=Surface+Pro"],
    rating: 4.6,
    featured: false,
    inStock: 7,
    description: "2-in-1 tablet and laptop hybrid with stunning display",
  },
  {
    id: "9",
    name: "Samsung Galaxy S24",
    slug: "galaxy-s24",
    price: 150000,
    discountPrice: 135000,
    category: "Phones",
    images: ["https://via.placeholder.com/300x200?text=Galaxy+S24"],
    rating: 4.7,
    featured: false,
    inStock: 10,
    description: "Flagship Android phone with AI capabilities",
  },
  {
    id: "10",
    name: "Keychron K8 Pro Keyboard",
    slug: "keychron-k8-pro",
    price: 15000,
    discountPrice: 12500,
    category: "Keyboards",
    images: ["https://via.placeholder.com/300x200?text=Keychron"],
    rating: 4.5,
    featured: false,
    inStock: 25,
    description: "Compact wireless mechanical keyboard for Mac and PC",
  },
];

/**
 * GET /api/products
 * Fetch all products with filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const sortBy = searchParams.get("sort") || "featured";

    let filtered = [...MOCK_PRODUCTS];

    // Filter by category
    if (category && category !== "All") {
      filtered = filtered.filter((p) => p.category === category);
    }

    // Filter by search
    if (search) {
      const query = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        // Keep original order
        break;
      case "featured":
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    // Paginate
    const total = filtered.length;
    const skip = (page - 1) * limit;
    const products = filtered.slice(skip, skip + limit);

    return NextResponse.json({
      success: true,
      data: products,
      hasMore: page * limit < total,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[Products API] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
