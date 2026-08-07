import type { Metadata } from "next";
import { Playfair_Display, Inter, Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Lather High School | Best School in Karnal, Haryana",
  description: "Lather High School, Karnal - A prestigious CBSE educational institution offering elite academic standards, world-class athletic facilities, and holistic student-centric leadership coaching.",
  keywords: "Lather High School, Karnal School, Best CBSE School Karnal, Elite School Haryana, Top Residential School Karnal",
  openGraph: {
    title: "Lather High School, Karnal",
    description: "Empowering Minds, Shaping Futures. Join Karnal's leading school with academic and sports excellence.",
    images: [
      {
        url: "/schoollogo.png",
        width: 800,
        height: 600,
      }
    ],
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body bg-white text-text-main">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
