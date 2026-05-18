import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { AuthProvider } from "@/app/providers/auth-provider";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | TechNest",
    default: "TechNest - Premium PC Components & Gaming Hardware",
  },
  description: "High-quality computer components, gaming hardware, and custom PC builders. Premium specs at competitive prices.",
  keywords: ["PC components", "gaming hardware", "laptops", "GPUs", "CPUs", "custom PC"],
  authors: [{ name: "TechNest" }],
  creator: "TechNest",
  publisher: "TechNest",
  formatDetection: {
    email: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://technest.vercel.app",
    siteName: "TechNest",
    title: "TechNest - Premium PC Components",
    description: "High-quality computer components and gaming hardware",
    images: [
      {
        url: "https://technest.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TechNest - Premium PC Components",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@technest",
    creator: "@technest",
    title: "TechNest - Premium PC Components",
    description: "High-quality computer components and gaming hardware",
    images: ["https://technest.vercel.app/og-image.jpg"],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
  alternates: {
    canonical: "https://technest.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark bg-background">
      <body className="font-sans antialiased bg-background text-foreground">
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
