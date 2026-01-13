"use client"
import { Inter } from 'next/font/google'
import './globals.css'
import './index.css'
import { ConfigureAmplifyClientSide } from './amplify-client-config';
import { MsgProvider } from "./context/MsgContext";
import MsgModal from "./components/MsgModal";
const inter = Inter({ subsets: ['latin'] })

// export const metadata: Metadata = {
//   title: 'Admin App',
//   description: 'Admin application in monorepo',
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConfigureAmplifyClientSide />
          <MsgProvider>
            {children}
            <MsgModal />
          </MsgProvider>
      </body>
    </html>
  )
}