import type { Metadata } from "next";
import "@/app/globals.css";
import MainNavbar from "../../../components/common/MainNavbarTwo";
import Footer from "../../../components/common/FooterTwo";


export const metadata: Metadata = {
  title: "Shapoorji Pallonji",
  description: "",
};

export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {


  return (
    <div>
        <MainNavbar/>
        {children}
        <Footer/>
    </div>
  );
}
