import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { 
  Typography, 
  Paper, 
  Table, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody, 
  CircularProgress, 
  Alert,
  Button
} from '@mui/material';
import DriverGuard from '../../components/auth/DriverGuard';
import DriverLayout from '../../components/layout/DriverLayout';
import { useRouter } from 'next/router';

interface ShipmentDto {
  shipmentId: number;
  origin: string;
  destination: string;
  status: string;
  scheduledDate: string | null;
}

const API_URL = 'https://localhost:7106';

const DriverDashboard: NextPage = () => {
  const router = useRouter();
  const [jobs, setJobs] = useState<ShipmentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.push('/auth/login');
        return;
      }
      const headers = { 'Authorization': `Bearer ${token}` };

      const response = await fetch(`${API_URL}/api/shipments/my-jobs`, {
        method: 'GET',
        headers: headers,
      });

      if (!response.ok) {
        if (response.status === 401) router.push('/auth/login');
        throw new Error('Failed to fetch jobs');
      }

      const data: ShipmentDto[] = await response.json();
      setJobs(data);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [router]);

  const handleUpdateStatus = async (shipmentId: number, newStatus: string) => {
        
    try {
      const token = localStorage.getItem('authToken');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const response = await fetch(`${API_URL}/api/shipments/${shipmentId}/status`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify({ newStatus: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status.');
      }

      alert('Status updated successfully!');
      
      fetchJobs(); 
      
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <>
      <Typography variant="h4" gutterBottom>
        My Assigned Jobs (In Transit)
      </Typography>
      
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="jobs table">
          <TableHead>
            <TableRow>
              <TableCell>Shipment ID</TableCell>
              <TableCell>Origin</TableCell>
              <TableCell>Destination</TableCell>
              <TableCell>Scheduled Date</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <TableRow key={job.shipmentId}>
                  <TableCell>{job.shipmentId}</TableCell>
                  <TableCell>{job.origin}</TableCell>
                  <TableCell>{job.destination}</TableCell>
                  <TableCell>{job.scheduledDate || 'N/A'}</TableCell>
                  
                  <TableCell>
                    <Button 
                      variant="contained" 
                      color="success"
                      size="small"
                      onClick={() => handleUpdateStatus(job.shipmentId, 'Delivered')}
                    >
                      Mark as Delivered
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  You have no assigned jobs.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

const ProtectedDriverDashboard: NextPage = () => {
  return (
    <DriverGuard>
      <DriverLayout>
        <DriverDashboard />
      </DriverLayout>
    </DriverGuard>
  );
};

export default ProtectedDriverDashboard;