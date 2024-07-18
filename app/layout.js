import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from '@/components/ui/toaster';
import TanstackQueryProvider from "@/utils/TanstackQueryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Next.js + shortenerURL",
  description: "A URL shortener built with Next.js and Prisma",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TanstackQueryProvider>
          {children}
          <Toaster />
        </TanstackQueryProvider>
      </body>
    </html>
  );
}
