import type { Metadata } from "next";
import "../../../app/globals.css";

export const metadata: Metadata = {
  title: "Sp | Backend Console",
  description: "Sp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div lang="en">
      <div className={`antialiased overflow-x-hidden overflow-y-hidden`}>{children}</div>
    </div>
  );
}