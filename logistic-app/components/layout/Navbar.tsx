import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import Link from 'next/link';
import Container from '@mui/material/Container';

export default function Navbar() {
  return (
    <AppBar position="static" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <LocalShippingIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: 'primary.main' }} />
          <Typography
            variant="h5"
            noWrap
            component="div"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 800,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
              flexGrow: 1
            }}
          >
            <Link href="/" style={{ textDecoration: 'none', color: 'white' }}>
              Cargo<span style={{ color: '#FFC107' }}>Xpress</span>
            </Link>
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            
            <Link href="/track" passHref>
              <Button variant="outlined" color="primary" sx={{ borderColor: '#FFC107', color: '#FFC107', '&:hover': { borderColor: 'white', color: 'white' } }}>
                Track Shipment
              </Button>
            </Link>

            <Link href="/auth/login" passHref>
              <Button variant="text" sx={{ color: 'white' }}>Login</Button>
            </Link>
            
            <Link href="/auth/register" passHref>
              <Button variant="contained" color="primary">
                Get Started
              </Button>
            </Link>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}