import { Content, Inter } from 'next/font/google'
import './globals.css'
import { VscServerProcess } from "react-icons/vsc";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: "Democracy",
  description: 'Create by ALVA',
}

export default async function RootLayout({ children }) {

  return (
    <html lang="en">
      <head>
        <link rel="icon" type='image/png' href="/logo.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className={inter.className + " text-gray-300 w-full h-screen overflow-x-hidden relative"}>
          {/* <Alert className="bg-yellow-600 flex justify-center gap-2 font-bold border-0 p-1 absolute top-0 z-50 sm:gap-4">
            <AlertTitle className="flex gap-2 items-center"><VscServerProcess size={25}/>Hey!</AlertTitle>
            <AlertDescription className="flex items-center mr-[9%] sm:mr-0">
              This is a game development in progress.
            </AlertDescription>
          </Alert> */}
          {children}
          <Toaster />
      </body>
    </html>
  )
}
