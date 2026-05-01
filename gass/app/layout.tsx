import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/service/useToas";
import { Dancing_Script } from "next/font/google";
import { Allura  } from "next/font/google";
import Providers from "@/utils/providers";

// const dancing = Dancing_Script({
//   subsets: ["vietnamese", "latin"],
//   variable: "--font-dancing",
//   weight: ['400', '700'], // Thêm các weight bạn cần
//   display: 'swap',
// });

export const metadata: Metadata = {
  title: "CLOTH SELLER",
  description: "CLOTH SELLER - Editorial Administration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ToastProvider>
          <Providers>
            {children}
          </Providers>
        </ToastProvider>
      </body>
    </html>
  );
}