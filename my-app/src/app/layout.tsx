import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HTML5 Code Generator",
  description: "Generate HTML + JS code for Moodle LMS with inline CSS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const studentName = "Risan Shrestha"; 
  const studentNumber = "21662159"; 

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <a href="#main" className="visually-hidden">
          Skip to main content
        </a>
        <Header studentNumber={studentNumber} />
        <main id="main" className="container" role="main">
          {children}
        </main>
        <Footer name={studentName} studentNumber={studentNumber} />
      </body>
    </html>
  );
}
