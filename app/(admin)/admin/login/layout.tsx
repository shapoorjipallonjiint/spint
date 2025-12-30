
export const metadata = {
  title: "Shapoorji Pallonji | Backend Console",
  description: "Shapoorji Pallonji",
};

import '../../../../app/globals.css'

  export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
      <html lang="en">
        <body>{children}</body>
      </html>
    );
  }