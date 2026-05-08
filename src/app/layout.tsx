import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Marsden Construction — CRM",
  description: "Internal CRM for Marsden Construction Ltd. Pipeline, jobs, customers, quotes and invoices.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
