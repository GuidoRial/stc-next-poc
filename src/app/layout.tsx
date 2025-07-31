import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

// PrimeReact CSS imports
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import 'primereact/resources/primereact.min.css'; 
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

import "./globals.css";
import { Providers } from "@/components/providers";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
