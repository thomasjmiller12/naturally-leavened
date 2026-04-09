import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Naturally Leavened | Artisan Sourdough by Haylee",
  description:
    "Handcrafted sourdough bread and baking classes. Food scientist Haylee shows you that sourdough can be simple, beautiful, and deeply satisfying.",
  keywords: [
    "sourdough",
    "bread",
    "baking class",
    "naturally leavened",
    "artisan bread",
    "sourdough starter",
  ],
  openGraph: {
    title: "Naturally Leavened | Artisan Sourdough by Haylee",
    description:
      "Handcrafted sourdough bread and baking classes. Sourdough made simple.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="bg-cream text-charcoal font-sans antialiased grain-overlay">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
