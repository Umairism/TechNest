"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center justify-center">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-accent/20 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 animate-fade-in-up">
            <div className="inline-block">
              <span className="text-accent text-sm font-semibold px-4 py-2 bg-accent/10 rounded-full">
                ✨ Welcome to TechNest
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              <span className="block text-foreground">Premium PC</span>
              <span className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Components
              </span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl">
              Build your dream gaming or workstation setup with our curated selection of high-performance components from trusted brands.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 py-8">
              <div>
                <div className="text-3xl font-bold text-accent">500+</div>
                <div className="text-sm text-muted-foreground">Products</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent">10K+</div>
                <div className="text-sm text-muted-foreground">Happy Customers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent">24/7</div>
                <div className="text-sm text-muted-foreground">Support</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition-colors"
              >
                Shop Now
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/pc-builder"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-accent/50 text-foreground rounded-lg font-semibold hover:border-accent hover:bg-accent/5 transition-colors"
              >
                Build PC
              </Link>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative h-96 md:h-full flex items-center justify-center animate-fade-in-down">
            <div className="relative w-80 h-80 rounded-2xl bg-gradient-to-br from-secondary to-muted border border-border/50 flex items-center justify-center overflow-hidden group hover-lift">
              {/* Animated Border */}
              <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Content */}
              <div className="relative z-10 text-center">
                <div className="text-7xl mb-4">💻</div>
                <div className="text-sm text-muted-foreground">High-Performance</div>
                <div className="text-sm text-muted-foreground">Components</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
