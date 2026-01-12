import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "@/app/globals.css";
import MainNavbar from "../../../components/common/MainNavbar";
import Footer from "../../../components/common/Footer";


const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900', '1000'],
  style: ['normal', 'italic'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Shapoorji Pallonji",
  description: "",
};

export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {


  return (
    <html>
      <body>
    <div>
        <MainNavbar/>
        {children}
        <Footer/>
    </div>
    </body>
    </html>
  );
}
