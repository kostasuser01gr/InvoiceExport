import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Europcar Greece - Invoice Intake",
  description: "Customer invoice intake portal for Europcar Greece",
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
