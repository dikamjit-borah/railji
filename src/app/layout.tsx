import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Railje - Railway Exam Platform",
  description: "Prepare for Railway exams with our comprehensive platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
