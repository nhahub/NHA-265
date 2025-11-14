import * as React from 'react';
import type { NextPage } from 'next';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Navbar from '../components/layout/Navbar';

const Home: NextPage = () => {
  return (
    <>
      <Navbar />
      <Container maxWidth="lg">
        <Box
          sx={{
            my: 4,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to CargoXpress
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            The fastest logistics system in Egypt
          </Typography>
        </Box>
      </Container>
    </>
  );
};

export default Home;