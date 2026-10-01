import type { Metadata } from "next";
import "@/app/globals.css";
import MainNavbar from "@/app/components/common/MainNavbar";
import Footer from "@/app/components/common/Footer";


export const metadata: Metadata = {
  title: "Shapoorji Pallonji",
  description: "",
};

export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {


  return (

    <div >
        <MainNavbar/>
        {children}
        <Footer/>
    </div>

  );
}
