"use client";
import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";
import { AbstraxionProvider } from "@burnt-labs/abstraxion";
import "@burnt-labs/abstraxion/dist/index.css";
import { Metadata } from "next";

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: "--font-jakarta",
});

const treasuryConfig = {
  treasury: "xion1l57rz408u6vzcs2w3tejjrq863ud7kvudc43fhk69l70dlgfr7zswc0asw",
  gasPrice: "0.001uxion", 
  rpcUrl: "https://rpc.xion-testnet-1.burnt.com:443",
  restUrl: "https://api.xion-testnet-1.burnt.com:443",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en" className="h-full">
      <body className={`${jakarta.className} h-full`}>
        <AbstraxionProvider config={treasuryConfig}>
          {children}
        </AbstraxionProvider>
      </body>
    </html>
  );
}