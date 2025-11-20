import * as React from 'react';
import type { NextPage } from 'next';
import { Container, Box, Typography, TextField, Button, Grid, Link as MuiLink, Paper, Avatar } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import Link from 'next/link';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

type RegisterFormInputs = { name: string; email: string; pass: string; phone: string; companyName?: string; address: string; };
const API_URL = 'https://localhost:7106/api/auth/register';

const RegisterPage: NextPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormInputs>();

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    try {
      const response = await fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      alert('Registration successful! Please login.');
      window.location.href = '/auth/login';
    } catch (error) { alert('Failed to register.'); }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', background: 'linear-gradient(135deg, #1A1A1A 0%, #2C2C2C 100%)', py: 4 }}>
      <Container component="main" maxWidth="sm">
        <Paper elevation={6} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 3 }}>
          <Avatar sx={{ m: 1, bgcolor: 'primary.main', color: 'black' }}>
            <PersonAddIcon />
          </Avatar>
          <Typography component="h1" variant="h5" fontWeight="bold">
            Join CargoXpress
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create your account to start shipping
          </Typography>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 3, width: '100%' }}>
            <Grid container spacing={2}>
              {/* @ts-ignore */}
              <Grid item xs={12}>
                <TextField required fullWidth label="Full Name" {...register("name", { required: "Required" })} error={!!errors.name} />
              </Grid>
              {/* @ts-ignore */}
              <Grid item xs={12}>
                <TextField required fullWidth label="Email" {...register("email", { required: "Required" })} error={!!errors.email} />
              </Grid>
              {/* @ts-ignore */}
              <Grid item xs={12}>
                <TextField required fullWidth label="Password" type="password" {...register("pass", { required: "Required", minLength: { value: 6, message: "Min 6 chars" } })} error={!!errors.pass} />
              </Grid>
              {/* @ts-ignore */}
              <Grid item xs={12}>
                <TextField required fullWidth label="Phone" {...register("phone", { required: "Required" })} error={!!errors.phone} />
              </Grid>
              {/* @ts-ignore */}
              <Grid item xs={12}>
                <TextField required fullWidth label="Address" {...register("address", { required: "Required" })} error={!!errors.address} />
              </Grid>
              {/* @ts-ignore */}
              <Grid item xs={12}>
                <TextField fullWidth label="Company (Optional)" {...register("companyName")} />
              </Grid>
            </Grid>
            <Button type="submit" fullWidth variant="contained" size="large" sx={{ mt: 4, mb: 2, py: 1.5, fontWeight: 'bold' }}>
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              {/* @ts-ignore */}
              <Grid item>
                <Link href="/auth/login" passHref>
                  <MuiLink variant="body2" sx={{ textDecoration: 'none', color: 'secondary.main' }}>
                    Already have an account? Sign in
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

export default RegisterPage;