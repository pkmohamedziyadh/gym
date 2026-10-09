import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Forma — Build your better", template: "%s | Forma" },
  description:
    "Your workouts, nutrition, and progress. One focused space to build a stronger you. A browser-local gym tracker starter.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
