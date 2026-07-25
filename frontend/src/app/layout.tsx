import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tomorrow Me — See Tomorrow. Decide Today.",
  description:
    "AI-powered Decision Intelligence Platform that helps you make better life decisions. Simulate possible futures, reality-check advice, and understand your mental state before deciding.",
  keywords: [
    "AI",
    "decision making",
    "future simulation",
    "career advice",
    "Gen Z",
    "life decisions",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="gradient-bg" />
        {children}
      </body>
    </html>
  );
}
