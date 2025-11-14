import React, { useState } from 'react';
import { NextPage } from 'next';
import { Typography, TextField, Button, Box, Grid, CircularProgress, Alert } from '@mui/material';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import AuthGuard from '../../components/auth/AuthGuard';
import CustomerLayout from '../../components/layout/CustomerLayout';
import { useRouter } from 'next/router';

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
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const response = await fetch(`${API_URL}/api/shipments`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('authToken');
          router.push('/auth/login');
        }
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to create shipment: ${response.statusText}`);
      }

      setSuccess('Shipment created successfully!');
      setTimeout(() => {
        router.push('/customer');
      }, 2000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Create New Shipment
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
        <Grid container spacing={2}>
          {/* Origin */}
          {/* @ts-ignore */}
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              id="origin"
              label="Origin Address"
              {...register("origin", { required: "Origin is required" })}
              error={!!errors.origin}
              helperText={errors.origin?.message}
            />
          </Grid>

          {/* Destination */}
          {/* @ts-ignore */}
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              id="destination"
              label="Destination Address"
              {...register("destination", { required: "Destination is required" })}
              error={!!errors.destination}
              helperText={errors.destination?.message}
            />
          </Grid>

          {/* Weight (Optional) */}
          {/* @ts-ignore */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="weight"
              label="Weight (kg)"
              type="number"
              InputProps={{ inputProps: { step: 0.1, min: 0 } }}
              {...register("weight", { 
                valueAsNumber: true,
                min: { value: 0.1, message: "Weight must be positive" } 
              })}
              error={!!errors.weight}
              helperText={errors.weight?.message}
            />
          </Grid>

          {/* Scheduled Date (Optional) */}
          {/* @ts-ignore */}
          <Grid item xs={12} sm={6}>
            <Controller
                name="scheduledDate"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        fullWidth
                        id="scheduledDate"
                        label="Scheduled Date (Optional)"
                        type="date"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                )}
            />
          </Grid>
          
          {/* (ممكن نضيف حقول تانية زي Priority و Scheduled Time بنفس الطريقة) */}

        </Grid>

        {/* (5) عرض رسائل النجاح أو الفشل) */}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Create Shipment'}
        </Button>
      </Box>
    </>
  );
};

const ProtectedNewShipmentPage: NextPage = () => {
  return (
    <AuthGuard>
      <CustomerLayout>
        <NewShipmentPage />
      </CustomerLayout>
    </AuthGuard>
  );
};

export default ProtectedNewShipmentPage;