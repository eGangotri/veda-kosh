import { Inter } from 'next/font/google'
import { Container } from "@mui/material"
import SessionProvider from "@/components/SessionProvider"
import Navigation from "@/components/Navigation"
import "./globals.css"
import Footer from './footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Veda Kosha',
  description: 'A Digital Repository of Vedic Literature',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <head>
        <title>Veda Kosha - A Digital Repository of Vedic Literature</title>
        <meta name="description" content="A Digital Repository of Vedic Literature" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={inter.className}>
        <SessionProvider>
          <div className="min-h-screen flex flex-col">
            <Navigation />
            <Container className="flex-grow p-4">
              {children}
            </Container>
            <Footer />
          </div>
        </SessionProvider>
      </body>
    </html>
  )
}
