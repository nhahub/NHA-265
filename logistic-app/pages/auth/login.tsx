import * as React from 'react';
import type { NextPage } from 'next';
import { Container, Box, Typography, TextField, Button, Grid, Link as MuiLink, Paper, Avatar } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/router';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const API_URL = 'https://localhost:7106';

type LoginFormInputs = { email: string; pass: string; };
interface UserResponse { userId: number; email: string; name: string; role: string; }

const LoginPage: NextPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
  const router = useRouter();

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
      });
      const result = await response.json();

      if (!response.ok) { alert(`Login Failed: ${result.message || 'Invalid credentials'}`); throw new Error(result.message); }

      if (result.token && result.user) {
        localStorage.setItem('authToken', result.token);
        const user: UserResponse = result.user;
        localStorage.setItem('userRole', user.role);
        
        if (user.role === 'Admin') router.push('/admin');
        else if (user.role === 'Customer') router.push('/customer');
        else if (user.role === 'Driver') router.push('/driver');
        else router.push('/');
      }
    } catch (error) { console.error('Failed to login:', error); }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      background: 'linear-gradient(135deg, #1A1A1A 0%, #2C2C2C 100%)' // خلفية سوداء مودرن
    }}>
      <Container component="main" maxWidth="xs">
        <Paper elevation={6} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 3 }}>
          <Avatar sx={{ m: 1, bgcolor: 'primary.main', color: 'black' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" fontWeight="bold">
            Welcome Back
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Sign in to Cargo<span style={{ color: '#FFC107', fontWeight: 'bold' }}>Xpress</span>
          </Typography>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal" required fullWidth id="email" label="Email Address" autoComplete="email" autoFocus
              {...register("email", { required: "Required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })}
              error={!!errors.email} helperText={errors.email?.message}
            />
            <TextField
              margin="normal" required fullWidth label="Password" type="password" id="pass" autoComplete="current-password"
              {...register("pass", { required: "Required", minLength: { value: 6, message: "Min 6 chars" } })}
              error={!!errors.pass} helperText={errors.pass?.message}
            />
            <Button type="submit" fullWidth variant="contained" size="large" sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: 'bold', fontSize: '1rem' }}>
              Sign In
            </Button>
            <Grid container justifyContent="flex-end">
              {/* @ts-ignore */}
              <Grid item>
                <Link href="/auth/register" passHref>
                  <MuiLink variant="body2" sx={{ textDecoration: 'none', color: 'secondary.main' }}>
                    {"Don't have an account? Sign Up"}
                  </MuiLink>
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;