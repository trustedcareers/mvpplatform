import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = GeistSans;
const geistMono = GeistMono;

export const metadata: Metadata = {
  title: "Trusted",
  description: "Smart job offer review, powered by AI + expert insight",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.className} ${geistMono.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
