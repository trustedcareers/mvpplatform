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
