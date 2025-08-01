import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

// PrimeReact CSS imports
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";

import { Providers } from "@/components/providers";
import { getConfigDataForComponent } from "@/components/server-data-store";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "STC Frontend Next.js Demo",
  description: "Next.js frontend with SSR for Skilled Trades Connect",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch initial data using React's cache function
  let initialData = {};
  let ssrData = {};

  try {
    // Get cached config data - this will be shared across all server components
    const cachedData = await getConfigDataForComponent("Root Layout");

    // Prepare data for client hydration (existing atoms)
    initialData = {
      config: cachedData.config,
    };

    // Prepare SSR data for SSR atoms hydration
    ssrData = {
      config: cachedData.config,
      timestamp: cachedData.timestamp,
      source: cachedData.source,
    };

    console.log("[Root Layout] 📦 Using cached config data for SSR hydration");
    console.log("[Root Layout] 🔍 Current cached data state:", {
      hasConfig: !!cachedData.config,
      timestamp: cachedData.timestamp,
      source: cachedData.source,
    });
  } catch (error) {
    console.error("Failed to fetch initial data in layout:", error);
    // Continue without initial data - components will handle fallbacks
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers initialData={initialData} ssrData={ssrData}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
