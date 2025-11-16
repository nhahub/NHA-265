import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { 
  Typography, 
  Paper, 
  Box, 
  TextField, 
  Button, 
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import DriverGuard from '../../components/auth/DriverGuard';
import DriverLayout from '../../components/layout/DriverLayout';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/router';

interface ProfileDto {
  name: string;
  email: string;
  phone: string | null;
  role: string;
  address: string | null;
  licenseNumber: string | null;
}

type UpdateProfileInputs = {
  name: string;
  phone: string | null;
  licenseNumber: string | null;
};

type ChangePasswordInputs = {
  oldPassword: string;
  newPassword: string;
};

const API_URL = 'https://localhost:7106';

const UpdateProfileForm = () => {
  const router = useRouter();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<UpdateProfileInputs>();
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) { router.push('/auth/login'); return; }
      const headers = { 'Authorization': `Bearer ${token}` };
      
      try {
        const res = await fetch(`${API_URL}/api/profile/me`, { headers });
        if (!res.ok) throw new Error('Failed to fetch profile data.');
        const data: ProfileDto = await res.json();
        
        reset({ name: data.name, phone: data.phone, licenseNumber: data.licenseNumber });

      } catch (err: any) { setError(err.message); } 
      finally { setLoading(false); }
    };
    fetchProfile();
  }, [router, reset]);

  const onSubmit: SubmitHandler<UpdateProfileInputs> = async (data) => {
    setFormLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const token = localStorage.getItem('authToken');
      const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
      
      const res = await fetch(`${API_URL}/api/profile/me`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(data)
      });

      if (!res.ok) { const errData = await res.json(); throw new Error(errData.message || 'Failed to update.'); }
      setSuccess('Profile updated successfully!');
    } catch (err: any) { setError(err.message); } 
    finally { setFormLoading(false); }
  };

  if (loading) return <CircularProgress />;

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Update Profile</Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        {/* @ts-ignore */}
        <Grid container spacing={2}>
          {/* @ts-ignore */}
          <Grid item xs={12}>
            <TextField fullWidth label="Name" {...register("name", { required: "Name is required" })} error={!!errors.name} helperText={errors.name?.message} />
          </Grid>
          {/* @ts-ignore */}
          <Grid item xs={12}>
            <TextField fullWidth label="Phone" {...register("phone")} />
          </Grid>
          {/* @ts-ignore */}
          <Grid item xs={12}>
            <TextField fullWidth label="License Number" {...register("licenseNumber")} />
          </Grid>
          
          {error && (
            <>
              {/* @ts-ignore */}
              <Grid item xs={12}><Alert severity="error">{error}</Alert></Grid>
            </>
          )}
          {success && (
            <>
              {/* @ts-ignore */}
              <Grid item xs={12}><Alert severity="success">{success}</Alert></Grid>
            </>
          )}

          {/* @ts-ignore */}
          <Grid item xs={12}>
            <Button type="submit" variant="contained" disabled={formLoading}>
              {formLoading ? <CircularProgress size={24}/> : 'Save Changes'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

const ChangePasswordForm = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ChangePasswordInputs>();
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit: SubmitHandler<ChangePasswordInputs> = async (data) => {
    setFormLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const token = localStorage.getItem('authToken');
      const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
      
      const res = await fetch(`${API_URL}/api/profile/change-password`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
      });

      if (!res.ok) { const errData = await res.json(); throw new Error(errData.message || 'Failed to change password.'); }
      setSuccess('Password changed successfully!');
      reset(); 
    } catch (err: any) { setError(err.message); } 
    finally { setFormLoading(false); }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Change Password</Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        {/* @ts-ignore */}
        <Grid container spacing={2}>
          {/* @ts-ignore */}
          <Grid item xs={12}>
            <TextField type="password" fullWidth label="Old Password" {...register("oldPassword", { required: "Old password is required" })} error={!!errors.oldPassword} helperText={errors.oldPassword?.message} />
          </Grid>
          {/* @ts-ignore */}
          <Grid item xs={12}>
            <TextField type="password" fullWidth label="New Password" {...register("newPassword", { required: "New password is required", minLength: { value: 6, message: "Min 6 chars"} })} error={!!errors.newPassword} helperText={errors.newPassword?.message} />
          </Grid>
          
          {error && (
            <>
              {/* @ts-ignore */}
              <Grid item xs={12}><Alert severity="error">{error}</Alert></Grid>
            </>
          )}
          {success && (
            <>
              {/* @ts-ignore */}
              <Grid item xs={12}><Alert severity="success">{success}</Alert></Grid>
            </>
          )}

          {/* @ts-ignore */}
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="secondary" disabled={formLoading}>
              {formLoading ? <CircularProgress size={24}/> : 'Change Password'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};


const ProfilePage: NextPage = () => {
  return (
    <>
      <Typography variant="h4" gutterBottom>My Profile</Typography>
      {/* @ts-ignore */}
      <Grid container spacing={3}>
        {/* @ts-ignore */}
        <Grid item xs={12} md={6}>
          <UpdateProfileForm />
        </Grid>
        {/* @ts-ignore */}
        <Grid item xs={12} md={6}>
          <ChangePasswordForm />
        </Grid>
      </Grid>
    </>
  );
};

const ProtectedProfilePage: NextPage = () => {
  return (
    <DriverGuard>
      <DriverLayout>
        <ProfilePage />
      </DriverLayout>
    </DriverGuard>
  );
};

export default ProtectedProfilePage;