import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

// PrimeReact CSS imports
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import 'primereact/resources/primereact.min.css'; 
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

import "./globals.css";
import { Providers } from "@/components/providers";
import { fetchConfig } from "@/lib/api";
import { setServerSSRData, getServerSSRData } from "@/components/server-data-store";

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
  // Fetch initial data for the entire app
  let initialData = {};
  let ssrData = {};
  
  try {
    const configResponse = await fetchConfig();
    const configData = configResponse.result;
    const timestamp = new Date().toISOString();
    
    // Store in server-side SSR data store using official Jotai SSR pattern
    setServerSSRData({
      config: configData,
      timestamp: timestamp,
      source: 'Root Layout'
    });
    
    // Prepare data for client hydration (existing atoms)
    initialData = {
      config: configData,
    };
    
    // Prepare SSR data for SSR atoms hydration
    ssrData = {
      config: configData,
      timestamp: timestamp,
      source: 'Root Layout'
    };
    
    console.log("[Root Layout] 📦 Stored global config using official Jotai SSR pattern");
  } catch (error) {
    console.error("Failed to fetch initial data in layout:", error);
    // Continue without initial data - components will handle fallbacks
  }
  
  // Get current SSR data state
  const serverData = getServerSSRData();
  console.log("[Root Layout] 🔍 Current SSR store state:", {
    hasConfig: !!serverData.config,
    timestamp: serverData.timestamp,
    source: serverData.source
  });

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
