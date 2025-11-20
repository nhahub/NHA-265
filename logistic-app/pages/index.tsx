import * as React from 'react';
import { NextPage } from 'next';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Grid, 
  Paper,
  Stack
} from '@mui/material';
import Navbar from '../components/layout/Navbar';
import Link from 'next/link';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import PublicIcon from '@mui/icons-material/Public';

const Home: NextPage = () => {
  return (
    <>
      <Navbar />
      
      <Box
        sx={{
          position: 'relative',
          height: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: 'url(https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <Typography variant="h2" component="h1" sx={{ color: 'white', fontWeight: 900, mb: 2 }}>
            MOVING YOUR WORLD <span style={{ color: '#FFC107' }}>FORWARD</span>
          </Typography>
          <Typography variant="h5" sx={{ color: '#E0E0E0', mb: 4, fontWeight: 300 }}>
            Reliable, Fast, and Secure Logistics Solutions Across Egypt
          </Typography>
          
          <Stack direction="row" spacing={2} justifyContent="center">
            <Link href="/track" passHref>
              <Button variant="contained" color="primary" size="large" sx={{ px: 5, py: 1.5, fontSize: '1.1rem' }}>
                Track Your Shipment
              </Button>
            </Link>
            <Link href="/auth/register" passHref>
              <Button variant="outlined" size="large" sx={{ px: 5, py: 1.5, fontSize: '1.1rem', color: 'white', borderColor: 'white', '&:hover': { borderColor: '#FFC107', color: '#FFC107', bgcolor: 'rgba(255,255,255,0.1)' } }}>
                Join Us Now
              </Button>
            </Link>
          </Stack>
        </Container>
      </Box>

      <Box sx={{ py: 10, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            {/* @ts-ignore */}
            <Grid item xs={12} md={6}>
              {/* <Box 
                component="img"
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80"
                alt="Logistics worker"
                sx={{ width: '100%', borderRadius: 4, boxShadow: 3 }}
              /> */}
            </Grid>
            {/* @ts-ignore */}
            <Grid item xs={12} md={6}>
              <Typography variant="overline" sx={{ color: '#D32F2F', fontWeight: 'bold', letterSpacing: 2 }}>
                ABOUT CARGOXPRESS
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 3, color: '#1A1A1A' }}>
                We Provide The Best <span style={{ color: '#FFC107' }}>Logistic</span> Solutions
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3, lineHeight: 1.8 }}>
                CargoXpress is Egypt's leading logistics partner. We connect governorates with a vast network of vehicles and drivers. Whether you are a business or an individual, we ensure your goods arrive safely and on time.
              </Typography>
              <ListFeatures />
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: 10, bgcolor: '#F5F5F5' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" sx={{ fontWeight: 800, mb: 6 }}>
            Why Choose <span style={{ color: '#D32F2F' }}>Us?</span>
          </Typography>
          
          <Grid container spacing={4}>
            <FeatureCard 
              icon={<SpeedIcon sx={{ fontSize: 50, color: '#FFC107' }} />}
              title="Fast Delivery"
              desc="Optimized routes and real-time tracking to ensure the fastest delivery times in the market."
            />
            <FeatureCard 
              icon={<SecurityIcon sx={{ fontSize: 50, color: '#FFC107' }} />}
              title="Secure Cargo"
              desc="Your goods are safe with us. We use top-tier security measures and verified drivers."
            />
            <FeatureCard 
              icon={<PublicIcon sx={{ fontSize: 50, color: '#FFC107' }} />}
              title="Nationwide Coverage"
              desc="From Alexandria to Aswan, our network covers every corner of Egypt."
            />
          </Grid>
        </Container>
      </Box>

      <Box sx={{ bgcolor: '#1A1A1A', color: 'white', py: 6, mt: 'auto' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* @ts-ignore */}
            <Grid item xs={12} md={4}>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
                Cargo<span style={{ color: '#FFC107' }}>Xpress</span>
              </Typography>
              <Typography variant="body2" sx={{ color: '#B0B0B0' }}>
                The future of logistics in Egypt. Fast, reliable, and digital.
              </Typography>
            </Grid>
            {/* @ts-ignore */}
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ mb: 2, color: '#FFC107' }}>Quick Links</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Link href="/" style={{ color: '#B0B0B0', textDecoration: 'none' }}>Home</Link>
                <Link href="/track" style={{ color: '#B0B0B0', textDecoration: 'none' }}>Track Shipment</Link>
                <Link href="/auth/login" style={{ color: '#B0B0B0', textDecoration: 'none' }}>Login</Link>
              </Box>
            </Grid>
            {/* @ts-ignore */}
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ mb: 2, color: '#FFC107' }}>Contact Us</Typography>
              <Typography variant="body2" sx={{ color: '#B0B0B0' }}>
                Cairo, Egypt <br />
                Phone: +20 123 456 7890 <br />
                Email: info@cargoxpress.com
              </Typography>
            </Grid>
          </Grid>
          <Typography align="center" sx={{ mt: 5, color: '#555', fontSize: '0.8rem' }}>
            © 2025 CargoXpress. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </>
  );
};


const FeatureCard = ({ icon, title, desc }: { icon: any, title: string, desc: string }) => (<>
  {/* @ts-ignore */}
  <Grid item xs={12} md={4}>
    <Paper 
      elevation={0} 
      sx={{ 
        p: 4, 
        textAlign: 'center', 
        height: '100%', 
        borderRadius: 4,
        transition: '0.3s',
        '&:hover': { transform: 'translateY(-10px)', boxShadow: 6 }
      }}
    >
      <Box sx={{ mb: 2 }}>{icon}</Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>{title}</Typography>
      <Typography variant="body1" color="text.secondary">{desc}</Typography>
    </Paper>
  </Grid></>
);

const ListFeatures = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
    {['Real-Time Tracking', '24/7 Customer Support', 'Transparent Pricing'].map((item) => (
      <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#D32F2F' }} />
        <Typography fontWeight="600">{item}</Typography>
      </Box>
    ))}
  </Box>
);

export default Home;