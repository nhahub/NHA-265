import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { useRouter } from 'next/router';
import Link from 'next/link';
import NotificationBell from './NotificationBell';

const CustomerLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    router.push('/auth/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Customer Dashboard
          </Typography>
          <Link href="/customer/new-shipment" passHref>
             <Button color="inherit" sx={{ mr: 1 }}>New Shipment</Button>
          </Link>

          <Link href="/customer/profile" passHref>
             <Button color="inherit" sx={{ mr: 1 }}>My Profile</Button>
          </Link>

          <NotificationBell />
          
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: '100%',
          marginTop: '64px',
        }}
      >
        <Container maxWidth="lg">
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default CustomerLayout;