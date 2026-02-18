import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mystery Message | True Feedback",
  description: "Get honest, anonymous feedback from anyone — without revealing identities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <SessionProvider>
        <body className={`${inter.className} antialiased`}>
          {children}
          <Toaster />
        </body>
      </SessionProvider>
    </html>
  );
}
