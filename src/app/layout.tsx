import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit, Playfair_Display, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/cart/CartDrawer";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["200", "300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

import CustomCursor from "@/components/common/CustomCursor";

export const metadata: Metadata = {
  title: "Yasmin Fashions - Modern Muslim Wear",
  description: "High-end, mobile-first e-commerce for modest fashion.",
};

import LoadingScreen from "@/components/common/LoadingScreen";

import { AuthProvider } from "@/context/AuthContext";
import { QuickViewProvider } from "@/context/QuickViewContext";
import { ToastProvider } from "@/context/ToastContext";
import QuickViewModal from "@/components/store/QuickViewModal";
import PageTransition from "@/components/common/PageTransition";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${outfit.variable} ${playfair.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased selection:bg-primary-gold selection:text-white`}>
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              <QuickViewProvider>
                <LoadingScreen />
                <CustomCursor />
                <CartDrawer />
                <QuickViewModal />
                <main className="animate-fade-in">
                  <PageTransition>
                    {children}
                  </PageTransition>
                </main>
              </QuickViewProvider>
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
