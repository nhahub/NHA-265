import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Typography, Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, CircularProgress, Alert, Button, Box, Container, Card, CardContent, Grid } from '@mui/material';
import DriverGuard from '../../components/auth/DriverGuard';
import DriverLayout from '../../components/layout/DriverLayout';
import { useRouter } from 'next/router';
import CustomerRatingModal from '../../components/driver/CustomerRatingModal';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

interface ShipmentDto { shipmentId: number; customerId: number; origin: string; destination: string; status: string; scheduledDate: string | null; }
interface RatingFormInputs { ratingValue: number | null; comments: string; }
const API_URL = 'https://localhost:7106';

const DriverDashboard: NextPage = () => {
  const router = useRouter();
  const [jobs, setJobs] = useState<ShipmentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [ratingError, setRatingError] = useState<string | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);

  const fetchJobs = async () => {
    setLoading(true); setError(null);
    try {
        const token = localStorage.getItem('authToken');
        if (!token) { router.push('/auth/login'); return; }
        const headers = { 'Authorization': `Bearer ${token}` };
        const response = await fetch(`${API_URL}/api/shipments/my-jobs`, { headers });
        if (!response.ok) { if (response.status === 401) router.push('/auth/login'); throw new Error('Failed'); }
        setJobs(await response.json());
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };
  useEffect(() => { fetchJobs(); }, [router]);

  const handleUpdateStatus = async (shipment: ShipmentDto, newStatus: string) => {
     try {
         const token = localStorage.getItem('authToken');
         const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
         const response = await fetch(`${API_URL}/api/shipments/${shipment.shipmentId}/status`, { method: 'PUT', headers, body: JSON.stringify({ newStatus }) });
         if (!response.ok) throw new Error('Failed');
         alert('Delivered! Please rate the customer.');
         setSelectedCustomerId(shipment.customerId); setIsRatingModalOpen(true); fetchJobs();
     } catch (err: any) { alert(err.message); }
  };

  const handleRatingSubmit = async (data: RatingFormInputs) => {
     setRatingLoading(true); setRatingError(null);
     try {
         const token = localStorage.getItem('authToken');
         const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
         const response = await fetch(`${API_URL}/api/ratings/customer`, { method: 'POST', headers, body: JSON.stringify({ customerId: selectedCustomerId, ...data }) });
         if (!response.ok) throw new Error('Failed');
         alert("Rated successfully!"); setIsRatingModalOpen(false);
     } catch (err: any) { setRatingError(err.message); } finally { setRatingLoading(false); }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <>
      <Box sx={{ mb: 4 }}>
         <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: 'secondary.main' }}>
            Driver Dashboard
         </Typography>
         <Typography variant="body1" color="text.secondary">
            View your tasks and manage deliveries.
         </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* @ts-ignore */}
        <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ bgcolor: 'primary.main', color: 'black', borderRadius: 2 }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <LocalShippingIcon sx={{ fontSize: 40 }} />
                    <Box>
                        <Typography variant="h4" fontWeight="bold">{jobs.length}</Typography>
                        <Typography variant="subtitle2" fontWeight="bold">Active Jobs</Typography>
                    </Box>
                </CardContent>
            </Card>
        </Grid>
      </Grid>

      <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ p: 2, bgcolor: '#fff', borderBottom: '1px solid #eee' }}>
           <Typography variant="h6" fontWeight="bold">Current Assignments</Typography>
        </Box>
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: '#1A1A1A' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Job ID</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Route</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Scheduled</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <TableRow key={job.shipmentId} hover>
                    <TableCell>
                        <Typography fontWeight="bold">#{job.shipmentId}</Typography>
                    </TableCell>
                    <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocationOnIcon color="error" fontSize="small" /> 
                            <Typography variant="body2">{job.origin} ➝ {job.destination}</Typography>
                        </Box>
                    </TableCell>
                    <TableCell>{job.scheduledDate || 'ASAP'}</TableCell>
                    <TableCell>
                      <Button 
                        variant="contained" 
                        color="success" 
                        startIcon={<CheckCircleIcon />}
                        onClick={() => handleUpdateStatus(job, 'Delivered')}
                        sx={{ fontWeight: 'bold', borderRadius: 2, px: 3 }}
                      >
                        Delivered
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                        <LocalShippingIcon sx={{ fontSize: 60, color: '#ddd', mb: 1 }} />
                        <Typography variant="h6" color="text.secondary">No active jobs.</Typography>
                        <Typography variant="body2" color="text.secondary">You are all caught up!</Typography>
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {selectedCustomerId && (
        <CustomerRatingModal
          open={isRatingModalOpen} onClose={() => setIsRatingModalOpen(false)}
          onSubmit={handleRatingSubmit} customerId={selectedCustomerId}
          loading={ratingLoading} error={ratingError}
        />
      )}
    </>
  );
};

const ProtectedDriverDashboard: NextPage = () => {
  return ( <DriverGuard> <DriverLayout> <DriverDashboard /> </DriverLayout> </DriverGuard> );
};
export default ProtectedDriverDashboard;