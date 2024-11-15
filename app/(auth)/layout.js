import ToasterContext from "@components/ToasterContext";
import "../../dist/output.css";
import { Inter } from "next/font/google";
import Provider from "@components/Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Auth Halo Next-Chat",
  description: "Build a Next Chat App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-purple-1`}>
        <Provider>
          <ToasterContext />
          {children}
        </Provider>
      </body>
    </html>
  );
}
