"use client"

import { Inter } from 'next/font/google'
import { useState } from "react"
import { AppBar, Toolbar, Typography, Button, Container, Menu, MenuItem } from "@mui/material"
import Link from "next/link"
import { usePathname } from "next/navigation"
import "./globals.css"

const inter = Inter({ subsets: ['latin'] })

// Note: This metadata is defined here but won't be used by Next.js
// since this is a client component. Metadata should be defined in a separate
// metadata.ts file or in a server component.
const metadata = {
  title: 'Veda Kosha',
  description: 'A Digital Repository of Vedic Literature',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  // Single anchor element state with menu identifier
  const [anchorEl, setAnchorEl] = useState<{ [key: string]: HTMLElement | null }>({
    vedas: null,
    commentaries: null
  })

  // Handle menu opening
  const handleMenuClick = (menuId: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl({ ...anchorEl, [menuId]: event.currentTarget })
  }

  // Handle menu closing
  const handleMenuClose = (menuId: string) => () => {
    setAnchorEl({ ...anchorEl, [menuId]: null })
  }

  // Check if a specific menu is open
  const isMenuOpen = (menuId: string) => Boolean(anchorEl[menuId])

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
        <div className="min-h-screen flex flex-col">
          <AppBar position="static" className="bg-blue-600">
            <Toolbar>
              <Typography variant="h6" component="div" className="flex-grow">
                Veda Kosh
              </Typography>
              <Link href="/" passHref>
                <Button color="inherit" className={`text-white ${pathname === "/" ? "underline" : ""}`}>
                  Home
                </Button>
              </Link>
              <Button
                color="inherit"
                onClick={handleMenuClick('vedas')}
                className={`text-white ${pathname?.startsWith("/vedas") ? "underline" : ""}`}
              >
                Vedas
              </Button>
              <Menu
                id="vedas-menu"
                anchorEl={anchorEl.vedas}
                open={isMenuOpen('vedas')}
                onClose={handleMenuClose('vedas')}
              >
                <MenuItem onClick={handleMenuClose('vedas')}>
                  <Link href="/vedas" className="text-inherit no-underline">
                    ALL
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleMenuClose('vedas')}>
                  <Link href="/vedas/rigveda" className="text-inherit no-underline">
                    Rig Veda
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleMenuClose('vedas')}>
                  <Link href="/vedas/yajurveda" className="text-inherit no-underline">
                    Yajur Veda
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleMenuClose('vedas')}>
                  <Link href="/vedas/samaveda" className="text-inherit no-underline">
                    SamaVeda
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleMenuClose('vedas')}>
                  <Link href="/vedas/atharvaveda" className="text-inherit no-underline">
                    Atharva Veda
                  </Link>
                </MenuItem>
              </Menu>
              <Link href="/upload" passHref>
                <Button color="inherit" className={`text-white ${pathname === "/upload" ? "underline" : ""}`}>
                  Excel Upload
                </Button>
              </Link>
              <Link href="/indices" passHref>
                <Button color="inherit" className={`text-white ${pathname === "/indices" ? "underline" : ""}`}>
                  Vedic Indices
                </Button>
              </Link>

              <Button
                color="inherit"
                onClick={handleMenuClick('commentaries')}
                className={`text-white ${pathname?.startsWith("/commentaries") ? "underline" : ""}`}
              >
                Commentaries
              </Button>
              <Menu
                id="commentaries-menu"
                anchorEl={anchorEl.commentaries}
                open={isMenuOpen('commentaries')}
                onClose={handleMenuClose('commentaries')}
              >
                <MenuItem onClick={handleMenuClose('commentaries')}>
                  <Link href="/commentaries" passHref>
                    Commentaries
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleMenuClose('commentaries')}>
                  <Link href="/commentaries/metadata" className="text-inherit no-underline">
                    Commentary Metadata
                  </Link>
                </MenuItem>
              </Menu>
              <Link href="/about" passHref>
                <Button color="inherit" className={`text-white ${pathname === "/about" ? "underline" : ""}`}>
                  About
                </Button>
              </Link>
              <Link href="/scriptures" passHref>
                <Button color="inherit" className={`text-white ${pathname === "/scriptures" ? "underline" : ""}`}>
                  Scriptures
                </Button>
              </Link>
              <Link href="/contact" passHref>
                <Button color="inherit" className={`text-white ${pathname === "/contact" ? "underline" : ""}`}>
                  Contact
                </Button>
              </Link>
            </Toolbar>
          </AppBar>
          <Container className="flex-grow p-4">
            {children}
          </Container>
        </div>
      </body>
    </html>
  )
}
