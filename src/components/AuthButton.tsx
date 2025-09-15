'use client';

import { useSession, signOut } from 'next-auth/react';
import { Button, Menu, MenuItem, Avatar } from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';

export default function AuthButton() {
  const { data: session, status } = useSession();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
    handleMenuClose();
  };

  if (status === 'loading') {
    return (
      <Button color="inherit" disabled>
        Loading...
      </Button>
    );
  }

  if (session) {
    return (
      <>
        <Button
          color="inherit"
          onClick={handleMenuClick}
          startIcon={
            <Avatar
              src={session.user?.image || undefined}
              alt={session.user?.name || 'User'}
              sx={{ width: 24, height: 24 }}
            >
              {session.user?.name?.charAt(0).toUpperCase()}
            </Avatar>
          }
          className="text-white"
        >
          {session.user?.name || 'User'}
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>
            <div className="px-2 py-1">
              <div className="font-medium">{session.user?.name}</div>
              <div className="text-sm text-gray-500">{session.user?.email}</div>
            </div>
          </MenuItem>
          <MenuItem onClick={handleSignOut}>
            Sign Out
          </MenuItem>
        </Menu>
      </>
    );
  }

  return (
    <div className="flex space-x-2">
      <Link href="/auth/signin" passHref>
        <Button color="inherit" className="text-white">
          Sign In
        </Button>
      </Link>
      <Link href="/auth/signup" passHref>
        <Button 
          variant="outlined" 
          className="text-white border-white hover:bg-white hover:text-blue-600"
        >
          Sign Up
        </Button>
      </Link>
    </div>
  );
}
