import type { Metadata } from "next";
import { Lato, Montserrat } from 'next/font/google';
import "./globals.css";
import { Providers } from "./providers";

const lato = Lato({
  weight: ['700', '900'], // For headlines and bold emphasis
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lato',
});

const montserrat = Montserrat({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
});

export const metadata: Metadata = {
  title: "Trusted",
  description: "Smart job offer review, powered by AI + expert insight",
  icons: {
    icon: [
      { url: '/favicons/favicon.ico', sizes: 'any' },
      { url: '/favicons/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/favicons/apple-touch-icon.png',
  },
  manifest: '/favicons/web-app-manifest-512x512.png',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${lato.variable} ${montserrat.variable} antialiased`}>
      <body className="font-body">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
