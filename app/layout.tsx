import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import { DockNav } from "@/components/DockNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Arpan Agrawal",
  description: "Arpan Agrawal's Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black relative min-h-screen`}
      >
        <div className="fixed inset-0 z-0 pointer-events-none mask-[linear-gradient(to_bottom,white,transparent_40%)]">
          <FlickeringGrid
            className="w-full h-full"
            squareSize={4}
            gridGap={6}
            color="#ffffff"
            maxOpacity={0.15}
            flickerChance={0.1}
          />
        </div>

        <div className="relative z-10 pb-24">
          {children}
        </div>

        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <DockNav />
        </div>
      </body>
    </html>
  );
}
