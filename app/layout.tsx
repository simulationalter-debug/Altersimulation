import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import "./globals.css";
import AppChrome from "@/components/providers/AppChrome";

export const metadata: Metadata = {
  title: "ALTER — The AI Life Simulator",
  description: "Meet the version of you who made the other choice.",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-[#0a0813] text-white">
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
