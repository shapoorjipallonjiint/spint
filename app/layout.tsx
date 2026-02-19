import { headers } from "next/headers";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  headers();
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
