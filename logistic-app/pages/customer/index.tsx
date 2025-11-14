import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Typography, Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, CircularProgress, Alert, Link as MuiLink } from '@mui/material';
import AuthGuard from '../../components/auth/AuthGuard';
import CustomerLayout from '../../components/layout/CustomerLayout';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface ShipmentDto {
  shipmentId: number;
  origin: string;
  destination: string;
  status: string;
  scheduledDate: string | null;
}

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
        if (!token) {
          setError("No token found. Redirecting to login...");
          router.push('/auth/login');
          return;
        }
        const headers = { 'Authorization': `Bearer ${token}` };
        const response = await fetch(`${API_URL}/api/shipments/my-shipments`, {
          method: 'GET',
          headers: headers,
        });
        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('authToken');
            router.push('/auth/login');
          }
          throw new Error(`Failed to fetch shipments: ${response.statusText}`);
        }
        const data: ShipmentDto[] = await response.json();
        setShipments(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchShipments();
  }, [router]);

  if (loading) {
    return <CircularProgress />;
  }
  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  return (
    <>
      <Typography variant="h4" gutterBottom>
        My Shipments
      </Typography>
      
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Shipment ID</TableCell>
              <TableCell>Origin</TableCell>
              <TableCell>Destination</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Scheduled Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shipments.length > 0 ? (
              shipments.map((row) => (
                <TableRow key={row.shipmentId}>
                  
                  <TableCell>
                    <MuiLink component={Link} href={`/customer/shipments/${row.shipmentId}`} passHref>
                      {row.shipmentId}
                    </MuiLink>
                  </TableCell>
                  
                  <TableCell>{row.origin}</TableCell>
                  <TableCell>{row.destination}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>{row.scheduledDate || 'N/A'}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  You have no shipments yet.
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
  return (
    <AuthGuard>
      <CustomerLayout>
        <CustomerDashboard />
      </CustomerLayout>
    </AuthGuard>
  );
};

export default ProtectedCustomerDashboard;