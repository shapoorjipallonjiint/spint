import { headers } from "next/headers";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  headers();
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
