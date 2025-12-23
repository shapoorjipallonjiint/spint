import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "@/app/globals.css";
import MainNavbar from "../../components/common/MainNavbar";
import Footer from "../../components/common/Footer";



export const metadata: Metadata = {
  title: "Shapoorji Pallonji",
  description: "",
};

export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {


  return (
    <html lang="en">
     <body>
        <MainNavbar/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
