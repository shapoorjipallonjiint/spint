import { headers } from "next/headers";
import "./globals.css";
import { initCron } from "@/lib/initCron";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  headers();
  initCron();
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
