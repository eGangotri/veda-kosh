"use client"

import { useState } from "react"
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem } from "@mui/material"
import Link from "next/link"
import { usePathname } from "next/navigation"
import AuthButton from "@/components/AuthButton"
import { useRole } from '@/hooks/useRole'

export default function Navigation() {
  const pathname = usePathname()
  const { userRole } = useRole()

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

  const getUserRole = () => {
    return userRole?.toString() || "user"
  }

  return (
    <AppBar position="static" className="bg-blue-600">
      <Toolbar>
        <Typography variant="h6" component="div" className="flex-grow">
          Veda Kosh ({getUserRole()})
        </Typography>
        <Button
          color="inherit"
          onClick={handleMenuClick('vedas')}
          className={`text-white ${pathname === "/" || pathname?.startsWith("/vedas") ? "underline" : ""}`}
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
        {userRole === 'admin' && (
          <Link href="/upload" passHref>
            <Button color="inherit" className={`text-white ${pathname === "/upload" ? "underline" : ""}`}>
              Excel Upload
            </Button>
          </Link>
        )}
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
        <Link href="/user" passHref>
          <Button color="inherit" className={`text-white ${pathname === "/user" ? "underline" : ""}`}>
            User Management
          </Button>
        </Link>
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
        <AuthButton />
      </Toolbar>
    </AppBar>
  )
}
