import * as React from 'react';
import type { NextPage } from 'next';
import { Container, Box, Typography, TextField, Button, Grid, Link as MuiLink } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/router'; 

const API_URL = 'https://localhost:7106'; 

type LoginFormInputs = {
  email: string;
  pass: string;
};

interface UserResponse {
  userId: number;
  email: string;
  name: string;
  role: string;
}

const LoginPage: NextPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
  const router = useRouter(); 

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), 
      });

      const result = await response.json();

      if (!response.ok) {
        alert(`Login Failed: ${result.message || 'Invalid credentials'}`);
        throw new Error(result.message || 'Something went wrong');
      }

      if (result.token && result.user) {
        
        localStorage.setItem('authToken', result.token);
        
        const user: UserResponse = result.user;
        localStorage.setItem('userRole', user.role); 

        alert('Login Successful! Redirecting...');
        
        if (user.role === 'Admin') {
          router.push('/admin');
        } else if (user.role === 'Customer') {
          router.push('/customer');
        } else if (user.role === 'Driver') {
          router.push('/driver');
        } else {
          router.push('/');
        }

      } else {
        alert('Login successful, but no token or user data received.');
      }

    } catch (error) {
      console.error('Failed to login:', error);
      alert('Failed to connect to the server.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            autoComplete="email"
            autoFocus
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
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            id="pass"
            autoComplete="current-password"
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            {/* @ts-ignore */}
            <Grid item>
              <MuiLink component={Link} href="/auth/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </MuiLink>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;