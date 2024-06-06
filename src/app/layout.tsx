import type { Metadata } from "next";
import { Roboto_Slab } from "next/font/google";

import Footer from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

import "./globals.css";

const robotoSlab = Roboto_Slab({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quaqqer.com",
  description: "Quaqqer's personal website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={robotoSlab.className}>
        <div className={"min-h-screen bg-gray-800 text-gray-500"}>
          <Navbar />

          <div className="mx-auto max-w-screen-lg px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </div>
        <Footer />
      </body>
    </html>
  );
}
