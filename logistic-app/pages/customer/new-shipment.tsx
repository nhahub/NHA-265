import React, { useState } from 'react';
import { NextPage } from 'next';
import { Typography, TextField, Button, Box, Grid, CircularProgress, Alert, Paper, Container } from '@mui/material';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import AuthGuard from '../../components/auth/AuthGuard';
import CustomerLayout from '../../components/layout/CustomerLayout';
import { useRouter } from 'next/router';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

type CreateShipmentInputs = {
  origin: string;
  destination: string;
  weight?: number;
  priority?: string;
  scheduledDate?: string;
};
const API_URL = 'https://localhost:7106';

const NewShipmentPage: NextPage = () => {
  const { register, handleSubmit, control, formState: { errors } } = useForm<CreateShipmentInputs>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit: SubmitHandler<CreateShipmentInputs> = async (data) => {
    setLoading(true); setError(null); setSuccess(null);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) { router.push('/auth/login'); return; }
      const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
      const response = await fetch(`${API_URL}/api/shipments`, { method: 'POST', headers, body: JSON.stringify(data) });
      if (!response.ok) { 
          const err = await response.json(); 
          throw new Error(err.message || 'Failed'); 
      }
      setSuccess('Shipment created successfully!');
      setTimeout(() => { router.push('/customer'); }, 2000);
    } catch (err: any) { setError(err.message); } 
    finally { setLoading(false); }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 5, mt: 4, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          <Box sx={{ bgcolor: 'primary.light', p: 2, borderRadius: '50%', mb: 2 }}>
             <LocalShippingIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          </Box>
          <Typography variant="h4" fontWeight="bold" align="center">
            New Order
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Fill in the details to create a new shipment request.
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={3}>
            {/* @ts-ignore */}
            <Grid item xs={12} sm={6}>
              <TextField required fullWidth label="Origin Address" placeholder="e.g. Cairo, Nasr City" variant="outlined"
                {...register("origin", { required: "Required" })} error={!!errors.origin} helperText={errors.origin?.message}
              />
            </Grid>
            {/* @ts-ignore */}
            <Grid item xs={12} sm={6}>
              <TextField required fullWidth label="Destination Address" placeholder="e.g. Alex, Smouha" variant="outlined"
                {...register("destination", { required: "Required" })} error={!!errors.destination} helperText={errors.destination?.message}
              />
            </Grid>
            {/* @ts-ignore */}
            <Grid item xs={12} sm={6}>
               <TextField fullWidth label="Weight (kg)" type="number" InputProps={{ inputProps: { step: 0.1, min: 0 } }}
                {...register("weight", { valueAsNumber: true })}
               />
            </Grid>
            {/* @ts-ignore */}
            <Grid item xs={12} sm={6}>
               <Controller name="scheduledDate" control={control}
                render={({ field }) => (
                    <TextField {...field} fullWidth label="Scheduled Date" type="date" InputLabelProps={{ shrink: true }} />
                )}
               />
            </Grid>
          </Grid>

          {error && <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mt: 3 }}>{success}</Alert>}

          <Button type="submit" fullWidth variant="contained" size="large" sx={{ mt: 4, py: 1.5, fontWeight: 'bold', fontSize: '1.1rem' }} disabled={loading}>
            {loading ? <CircularProgress size={26} /> : 'Create Shipment'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

const ProtectedNewShipmentPage: NextPage = () => {
  return ( <AuthGuard> <CustomerLayout> <NewShipmentPage /> </CustomerLayout> </AuthGuard> );
};

export default ProtectedNewShipmentPage;