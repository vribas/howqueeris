"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { BlobBackground } from "@/components/BlobBackground";
import { createContext, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

// Create a context to pass the group selection setter
export const MinorityGroupContext = createContext<{
  selectedGroupId: string | null;
  setSelectedGroupId: (id: string | null) => void;
}>({
  selectedGroupId: null,
  setSelectedGroupId: () => {},
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  return (
    <html lang="en">
      <body className={inter.className}>
        <MinorityGroupContext.Provider value={{ selectedGroupId, setSelectedGroupId }}>
          <div className="relative flex min-h-screen flex-col">
            <main className="flex flex-1">
              <BlobBackground selectedGroupId={selectedGroupId} />
              <div className="py-8 flex-1">
                {children}
              </div>
            </main>
          </div>
          <Toaster />
        </MinorityGroupContext.Provider>
      </body>
    </html>
  );
}
