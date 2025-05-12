'use client';

import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import type { PropsWithChildren } from "react";
import { useEffect } from "react";

import { Footer } from "@/components/main/footer";
import { StarsCanvas } from "@/components/main/star-background";
import { siteConfig } from "@/config";
import { cn } from "@/lib/utils";
import { initMobileScrollFix } from "./scrollFix";
import { MobileProvider } from "./providers/MobileProvider";

import "./globals.css";
import "./globals-mobile.css"; // Import mobile-specific fixes
import "./mobile-touch.css"; // Import touch-specific fixes

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#030014",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5, // Increased to allow more zoom on mobile
  userScalable: true,
};

export const metadata: Metadata = siteConfig;

export default function RootLayout({ children }: PropsWithChildren) {
  // Initialize the mobile scroll fixes
  useEffect(() => {
    const cleanup = initMobileScrollFix();
    return cleanup;
  }, []);

  return (
    <html lang="en">
      <body
        className={cn(
          "bg-[#030014] overflow-y-auto overflow-x-hidden mobile-scroll-enabled",
          inter.className
        )}
      >
        <MobileProvider>
          <StarsCanvas />
          <div className="main-content">
            {children}
          </div>
          <Footer />
        </MobileProvider>
      </body>
    </html>
  );
}
