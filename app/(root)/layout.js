import { Inter } from "next/font/google";
import "../../dist/output.css";
import Provider from "@components/Provider";
import TopBar from "@components/TopBar";
import Bottombar from "@components/Bottombar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Halo Chat App",
  description: "A Next.js Chat App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-blue-2`}>
        <Provider>
          <TopBar />
          {children}
          <Bottombar />
        </Provider>
      </body>
    </html>
  );
}
