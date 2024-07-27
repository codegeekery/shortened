import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from '@/components/ui/toaster';
import TanstackQueryProvider from "@/utils/TanstackQueryProvider";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "shortenerURL",
  description: "A URL shortener built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster />
        <TanstackQueryProvider>
          <Suspense fallback={<div>Loading...</div>}>
            {children}
          </Suspense>
        </TanstackQueryProvider>
      </body>
    </html>
  );
}
