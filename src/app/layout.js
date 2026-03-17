import { Prompt } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const prompt = Prompt({
  variable: "--font-prompt",
  subsets: ["latin", "thai"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "BeanBliss Coffee | ร้านกาแฟมินิมอล",
  description: "สัมผัสกาแฟที่ดีที่สุดพร้อมจองโต๊ะออนไลน์ที่ BeanBliss Coffee ร้านกาแฟมินิมอลที่ใส่ใจทุกรายละเอียด",
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body className={`${prompt.variable} antialiased`}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
