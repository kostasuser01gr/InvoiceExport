import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Europcar Greece - Admin Dashboard",
  description: "Staff dashboard for Europcar Greece invoicing",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ "--brand-primary": "#0EAD00" } as React.CSSProperties}>
        {children}
      </body>
    </html>
  );
}
