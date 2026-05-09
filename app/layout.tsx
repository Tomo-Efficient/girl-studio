import type { Metadata } from "next";
import { Inter, Noto_Serif_SC } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const notoSerifSC = Noto_Serif_SC({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Girl Studio — 审美灵感库",
  description: "记录所有打动你的审美碎片",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${inter.variable} ${notoSerifSC.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster position="bottom-center" richColors closeButton />
      </body>
    </html>
  );
}
