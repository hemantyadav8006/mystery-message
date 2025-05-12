import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from "@/context/AuthProvider";

export const metadata: Metadata = {
  title: "Mystery Message",
  description: "Mystery Message for real/pure feedbacks!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SessionProvider>
        <body className={`antialiased`}>{children}</body>
      </SessionProvider>
    </html>
  );
}
