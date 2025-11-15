import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { useRouter } from 'next/router';
import Link from 'next/link';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
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
            <Link href="/admin" passHref style={{ textDecoration: 'none', color: 'inherit' }}>
                Admin Dashboard
            </Link>
          </Typography>

          <Link href="/admin/cities" passHref>
             <Button color="inherit" sx={{ mr: 1 }}>Manage Cities</Button>
          </Link>

          <Link href="/admin/vehicles" passHref>
             <Button color="inherit" sx={{ mr: 1 }}>Manage Vehicles</Button>
          </Link>

          <Link href="/admin/drivers" passHref>
             <Button color="inherit" sx={{ mr: 1 }}>Manage Drivers</Button>
          </Link>
          

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

export default AdminLayout;