import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";

const promt = Prompt({
  subsets: ["latin", "thai"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Food Tracker App V 1.0",
  description: "Food Tracker For Health",
  keywords: [
    "Food",
    "Tracker",
    "Health",
    "Nutrition",
    "Diet",
    "อาหาร",
    "สุขภาพ",
    "โภชนาการ",
    "อาหารเพื่อสุขภาพ",
  ],
  icons: {
    icon: "/next.svg",
  },
  authors: [{ name: "MOOMOO888", url: "https://github.com/MOOMOO888" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${promt.className} antialiased`}>{children}</body>
    </html>
  );
}
