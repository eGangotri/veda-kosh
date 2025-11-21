import { Inter } from 'next/font/google'
import { Container } from "@mui/material"
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import SessionProvider from "@/components/SessionProvider"
import Navigation from "@/components/Navigation"
import "./globals.css"
import Footer from './footer'
import Script from 'next/script'
import { AnalyticsListener } from '@/components/AnalyticsListener'

const inter = Inter({ subsets: ['latin'] })

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;

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
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-setup" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </head>
      <body className={inter.className}>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <SessionProvider>
            <div className="min-h-screen flex flex-col">
              <Navigation />
              <Container className="flex-grow p-4">
                  <AnalyticsListener />
                {children}
              </Container>
              <Footer />
            </div>
          </SessionProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
