import type { Metadata } from "next";
import { getListing } from "@/lib/data";
import "./globals.css";

export const metadata: Metadata = {
  title: getListing().pageTitle,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
