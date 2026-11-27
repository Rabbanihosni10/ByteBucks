import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ByteBucks",
  description: "Build money skills with short quizzes and rewards.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
