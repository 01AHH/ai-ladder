import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Ladder",
  description:
    "Walk up the six-rung AI capability ladder. See one vivid example tailored to you, then take one small step.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
