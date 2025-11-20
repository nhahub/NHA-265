import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Typography, Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, CircularProgress, Alert, Link as MuiLink, Box, Chip, Button } from '@mui/material';
import AuthGuard from '../../components/auth/AuthGuard';
import CustomerLayout from '../../components/layout/CustomerLayout';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AddIcon from '@mui/icons-material/Add';

interface ShipmentDto { shipmentId: number; origin: string; destination: string; status: string; scheduledDate: string | null; }
const API_URL = 'https://localhost:7106';

const CustomerDashboard: NextPage = () => {
  const [shipments, setShipments] = useState<ShipmentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) { router.push('/auth/login'); return; }
        const headers = { 'Authorization': `Bearer ${token}` };
        const response = await fetch(`${API_URL}/api/shipments/my-shipments`, { method: 'GET', headers });
        if (!response.ok) { 
            if (response.status === 401) router.push('/auth/login');
            throw new Error('Failed'); 
        }
        setShipments(await response.json());
      } catch (err: any) { setError(err.message); } 
      finally { setLoading(false); }
    };
    fetchShipments();
  }, [router]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>My Shipments</Typography>
            <Typography variant="body1" color="text.secondary">Track and manage your orders.</Typography>
        </Box>
        <Link href="/customer/new-shipment" passHref>
            <Button variant="contained" startIcon={<AddIcon />} sx={{ fontWeight: 'bold' }}>
                New Shipment
            </Button>
        </Link>
      </Box>
      
      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead sx={{ bgcolor: '#1A1A1A' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Origin</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Destination</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shipments.length > 0 ? (
              shipments.map((row) => (
                <TableRow key={row.shipmentId} hover>
                  <TableCell>
                    <Link href={`/customer/shipments/${row.shipmentId}`} passHref>
                      <MuiLink underline="hover" fontWeight="bold" color="primary">#{row.shipmentId}</MuiLink>
                    </Link>
                  </TableCell>
                  <TableCell>{row.origin}</TableCell>
                  <TableCell>{row.destination}</TableCell>
                  <TableCell>
                    <Chip 
                        label={row.status} 
                        size="small"
                        color={
                            row.status === 'Delivered' ? 'success' : 
                            row.status === 'In Transit' ? 'primary' : 
                            row.status === 'Pending' ? 'warning' : 'default'
                        }
                        variant={row.status === 'Pending' ? 'outlined' : 'filled'}
                    />
                  </TableCell>
                  <TableCell>{row.scheduledDate || 'N/A'}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">You have no shipments yet.</Typography>
                    <Link href="/customer/new-shipment" passHref>
                        <Button variant="outlined" sx={{ mt: 2 }}>Create First Shipment</Button>
                    </Link>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

const ProtectedCustomerDashboard: NextPage = () => {
  return ( <AuthGuard> <CustomerLayout> <CustomerDashboard /> </CustomerLayout> </AuthGuard> );
};

export default ProtectedCustomerDashboard;