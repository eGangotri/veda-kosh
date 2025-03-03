"use client"

import type React from "react"
import { useState } from "react"
import type { ReactNode } from "react"
import { AppBar, Toolbar, Typography, Button, Container, Menu, MenuItem } from "@mui/material"
import Link from "next/link"
import { usePathname } from "next/navigation"
import "../pages/globals.css"

interface LayoutProps {
  children: ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

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
          <Button
            color="inherit"
            onClick={handleClick}
            className={`text-white ${pathname?.startsWith("/vedas") ? "underline" : ""}`}
          >
            Vedas
          </Button>
          <Menu
            id="vedas-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "vedas-button",
            }}
          >
            <MenuItem onClick={handleClose}>
              <Link href="/vedas" className="text-inherit no-underline">
                ALL
              </Link>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Link href="/vedas/rigveda" className="text-inherit no-underline">
                Rig Veda
              </Link>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Link href="/vedas/yajurveda" className="text-inherit no-underline">
                Yajur Veda
              </Link>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Link href="/vedas/samaveda" className="text-inherit no-underline">
                SamaVeda
              </Link>
            </MenuItem>
            <MenuItem onClick={handleClose}>
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
          <Link href="/commentaries" passHref>
            <Button color="inherit" className={`text-white ${pathname === "/commentaries" ? "underline" : ""}`}>
              Commentaries
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

