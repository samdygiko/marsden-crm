import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";

const font = Archivo({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800", "900"], variable: "--font-main" });

export const metadata: Metadata = {
  title: "Marsden Construction — CRM",
  description: "Internal CRM for Marsden Construction Ltd. Pipeline, jobs, customers, quotes and invoices.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={font.variable}>
      <body>{children}</body>
    </html>
  );
}
