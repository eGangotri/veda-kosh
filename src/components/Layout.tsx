"use client"

import type React from "react"
import type { ReactNode } from "react"
import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface LayoutProps {
  children: ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname()

  return (
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
          <Link href="/db" passHref>
            <Button color="inherit" className={`text-white ${pathname === "/db" ? "underline" : ""}`}>
              DB
            </Button>
          </Link>
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
      <Container className="flex-grow p-4">{children}</Container>
    </div>
  )
}

export default Layout

