// components/Layout.tsx
import React, { ReactNode } from 'react';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <AppBar position="static" className="bg-blue-600">
        <Toolbar>
          <Typography variant="h6" component="div" className="flex-grow">
            Veda Kosh
          </Typography>
          <Button color="inherit" className="text-white">Home</Button>
          <Button color="inherit" className="text-white">About</Button>
          <Button color="inherit" className="text-white">Scriptures</Button>
          <Button color="inherit" className="text-white">Contact</Button>
        </Toolbar>
      </AppBar>
      <Container className="flex-grow p-4">
        {children}
      </Container>
    </div>
  );
};

export default Layout;