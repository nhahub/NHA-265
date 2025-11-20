import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container, Stack, Divider } from '@mui/material';
import { useRouter } from 'next/router';
import Link from 'next/link';
import NotificationBell from './NotificationBell';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AddBoxIcon from '@mui/icons-material/AddBox';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import MapIcon from '@mui/icons-material/Map';

const CustomerLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    router.push('/auth/login');
  };

  const navButtonStyle = {
    color: 'white',
    textTransform: 'none',
    fontSize: '0.95rem',
    fontWeight: 500,
    padding: '6px 12px',
    borderRadius: 2,
    transition: '0.3s',
    '&:hover': {
      bgcolor: 'rgba(255, 193, 7, 0.15)', 
      color: '#FFC107', 
    },
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="fixed" elevation={2} sx={{ bgcolor: '#1A1A1A', borderBottom: '1px solid #333' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between' }}>
            
            <Typography variant="h5" noWrap component="div" sx={{ fontWeight: 800, letterSpacing: 1 }}>
              <Link href="/customer" style={{ textDecoration: 'none', color: 'white' }}>
                Cargo<span style={{ color: '#FFC107' }}>Client</span>
              </Link>
            </Typography>

            <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
              
              <Link href="/customer" style={{ textDecoration: 'none' }}>
                <Button startIcon={<LocalShippingIcon />} sx={navButtonStyle}>
                  My Shipments
                </Button>
              </Link>

              <Link href="/customer/new-shipment" style={{ textDecoration: 'none' }}>
                <Button startIcon={<AddBoxIcon />} sx={navButtonStyle}>
                  New Order
                </Button>
              </Link>

              <Link href="/track" style={{ textDecoration: 'none' }}>
                <Button startIcon={<MapIcon />} sx={navButtonStyle}>
                  Track ID
                </Button>
              </Link>

            </Stack>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <NotificationBell />
              
              <Divider orientation="vertical" flexItem sx={{ bgcolor: '#444', mx: 1, height: 25, alignSelf: 'center' }} />

              <Link href="/customer/profile" style={{ textDecoration: 'none' }}>
                 <Button startIcon={<AccountCircleIcon />} sx={navButtonStyle}>
                    Profile
                 </Button>
              </Link>

              <Button 
                onClick={handleLogout}
                variant="outlined" 
                color="error" 
                size="small"
                startIcon={<LogoutIcon />}
                sx={{ 
                    ml: 2, 
                    borderColor: '#D32F2F', 
                    color: '#FF8A80',
                    '&:hover': { borderColor: '#FF5252', bgcolor: 'rgba(255, 82, 82, 0.1)', color: 'white' }
                }}
              >
                Logout
              </Button>
            </Box>

          </Toolbar>
        </Container>
      </AppBar>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          width: '100%',
          marginTop: '64px',
          bgcolor: '#F5F7FA',
          minHeight: '100vh'
        }}
      >
        <Container maxWidth="xl">
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default CustomerLayout;