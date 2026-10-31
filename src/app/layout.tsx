import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WispFlow Career OS | Autonomous Career Intelligence & Voice Simulation",
  description: "Closed-loop career acceleration platform bridging empirical JD skill-gap analysis, dynamic week-by-week learning sprints, voice mock interviews, and application tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-[#090A0F] text-[#F3F4F6]`}
      >
        {children}
      </body>
    </html>
  );
}
