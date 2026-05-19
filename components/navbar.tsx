"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { items } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="text-xl font-bold hidden sm:inline">TechNest</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-foreground/70 hover:text-foreground transition">
              Home
            </Link>
            <Link href="/shop" className="text-foreground/70 hover:text-foreground transition">
              Shop
            </Link>
            <Link href="/pc-builder" className="text-foreground/70 hover:text-foreground transition">
              PC Builder
            </Link>
            <Link href="/about" className="text-foreground/70 hover:text-foreground transition">
              About
            </Link>
            <Link href="/contact" className="text-foreground/70 hover:text-foreground transition">
              Contact
            </Link>
          </div>

          {/* Right Side Items */}
          <div className="flex items-center space-x-4">
            <Link
              href="/cart"
              className="relative p-2 hover:bg-secondary rounded-lg transition"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-accent text-accent-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-secondary rounded-lg transition"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              href="/"
              className="block px-4 py-2 text-foreground/70 hover:text-foreground hover:bg-secondary rounded transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/shop"
              className="block px-4 py-2 text-foreground/70 hover:text-foreground hover:bg-secondary rounded transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              href="/pc-builder"
              className="block px-4 py-2 text-foreground/70 hover:text-foreground hover:bg-secondary rounded transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              PC Builder
            </Link>
            <Link
              href="/about"
              className="block px-4 py-2 text-foreground/70 hover:text-foreground hover:bg-secondary rounded transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block px-4 py-2 text-foreground/70 hover:text-foreground hover:bg-secondary rounded transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
