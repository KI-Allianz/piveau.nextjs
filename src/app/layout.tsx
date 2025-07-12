import type { Metadata } from "next";
import { Geist, Geist_Mono, Nunito_Sans } from "next/font/google";
import "./globals.css";
import React from "react";
import { Providers } from "@/components/Providers";
import Header from "@/components/Header";

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Piveau Next",
  description: "Piveau using Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${nunitoSans.variable} antialiased`}
      >
        <div className="w-full bg-white">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
