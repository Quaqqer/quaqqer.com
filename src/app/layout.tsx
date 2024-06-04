import type { Metadata } from "next";
import { Roboto_Slab } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import clsx from "clsx";
import Footer from "@/components/Footer";

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
      <body>
        <div
          className={clsx(
            "text-gray-500 bg-gray-800 min-h-screen",
            robotoSlab.className
          )}
        >
          <Navbar />

          <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </div>
        <Footer />
      </body>
    </html>
  );
}
