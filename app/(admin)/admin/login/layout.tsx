
export const metadata = {
  title: "Shapoorji Pallonji | Backend Console",
  description: "Shapoorji Pallonji",
};

import '../../../../app/globals.css'

  export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
      <div lang="en">
        <div className={`antialiased overflow-x-hidden overflow-y-hidden`}>{children}</div>
      </div>
    );
  }