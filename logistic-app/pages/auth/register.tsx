import * as React from 'react';
import type { NextPage } from 'next';
import { Container, Box, Typography, TextField, Button, Grid, Link as MuiLink } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import Link from 'next/link';

type RegisterFormInputs = {
  name: string;
  email: string;
  pass: string;
  phone: string;
  companyName?: string; 
  address: string;
};


const RegisterPage: NextPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormInputs>();

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    
    const API_URL = 'http://localhost:5073/api/auth/register';

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), 
      });

      const result = await response.json();

      if (!response.ok) {
        alert(`Error: ${result.message}`);
        throw new Error(result.message || 'Something went wrong');
      }

      alert('Registration successful! Please login.');

    } catch (error) {
      console.error('Failed to register:', error);
      alert('Failed to connect to the server.'); 
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          marginBottom: 8, 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 3 }}>
          {/* @ts-ignore */}
          <Grid container spacing={2}>
            {/* @ts-ignore */}
            <Grid item xs={12}> 
              <TextField
                required
                fullWidth
                id="name"
                label="Full Name"
                autoFocus
                {...register("name", { required: "Name is required" })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>
            {/* @ts-ignore */}
            <Grid item xs={12}> 
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                autoComplete="email"
                {...register("email", { 
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>

            {/* @ts-ignore */}
            <Grid item xs={12}> 
              <TextField
                required
                fullWidth
                label="Password"
                type="password"
                id="pass"
                {...register("pass", { 
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters"
                  }
                })}
                error={!!errors.pass}
                helperText={errors.pass?.message}
              />
            </Grid>

            {/* @ts-ignore */}
            <Grid item xs={12}> 
              <TextField
                required
                fullWidth
                id="phone"
                label="Phone Number"
                {...register("phone", { required: "Phone number is required" })}
                error={!!errors.phone}
                helperText={errors.phone?.message}
              />
            </Grid>

            {/* @ts-ignore */}
            <Grid item xs={12}> 
              <TextField
                required
                fullWidth
                id="address"
                label="Address"
                {...register("address", { required: "Address is required" })}
                error={!!errors.address}
                helperText={errors.address?.message}
              />
            </Grid>

            {/* @ts-ignore */}
            <Grid item xs={12}> 
              <TextField
                fullWidth
                id="companyName"
                label="Company Name (Optional)"
                {...register("companyName")}
              />
            </Grid>

          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          {/* @ts-ignore */}
          <Grid container justifyContent="flex-end">
            {/* @ts-ignore */}
            <Grid item>
              <MuiLink component={Link} href="/auth/login" variant="body2">
                Already have an account? Sign in
              </MuiLink>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterPage;