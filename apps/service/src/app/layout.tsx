import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import './index.css'
import { ConfigureAmplifyClientSide } from "./components/ConfigureAmplifyClientSide";
import MsgModal from "./components/MsgModal";
import Alert from "./components/Alert";
import { MsgProvider } from "../contexts/MsgContext";
import { AlertProvider } from "../contexts/AlertContext";

const inter = Inter({ subsets: ["latin"] });

// タイトルを動的に生成する
export const metadata: Metadata = {
  title: {
    template: "%s | 高知市帯屋町のコワーキングスペース オビヤギルド",
    default: "高知市帯屋町のコワーキングスペース オビヤギルド",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AlertProvider>
          <MsgProvider>
            {children}
            <Alert />
            <MsgModal />
          </MsgProvider>
        </AlertProvider>
      </body>
      <ConfigureAmplifyClientSide />
    </html>
  );
}
