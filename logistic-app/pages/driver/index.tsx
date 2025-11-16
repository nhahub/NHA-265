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
import CustomerRatingModal from '../../components/driver/CustomerRatingModal';

interface ShipmentDto {
  shipmentId: number;
  customerId: number;
  origin: string;
  destination: string;
  status: string;
  scheduledDate: string | null;
}

interface RatingFormInputs {
  ratingValue: number | null;
  comments: string;
}

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

  const handleUpdateStatus = async (shipment: ShipmentDto, newStatus: string) => {
    
    try {
      const token = localStorage.getItem('authToken');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const response = await fetch(`${API_URL}/api/shipments/${shipment.shipmentId}/status`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify({ newStatus: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status.');
      }

      alert('Status updated successfully! Please rate the customer.');
      
      setSelectedCustomerId(shipment.customerId);
      setIsRatingModalOpen(true);
      
      fetchJobs(); 
      
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleRatingSubmit = async (data: RatingFormInputs) => {
    if (!selectedCustomerId) return;

    setRatingLoading(true);
    setRatingError(null);
    try {
      const token = localStorage.getItem('authToken');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const response = await fetch(`${API_URL}/api/ratings/customer`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          customerId: selectedCustomerId,
          ratingValue: data.ratingValue,
          comments: data.comments
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit rating.');
      }
      
      alert("Customer rated successfully!");
      setIsRatingModalOpen(false);

    } catch (err: any) {
      setRatingError(err.message);
    } finally {
      setRatingLoading(false);
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
              <TableCell>Customer ID</TableCell>
              <TableCell>Origin</TableCell>
              <TableCell>Destination</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <TableRow key={job.shipmentId}>
                  <TableCell>{job.shipmentId}</TableCell>
                  <TableCell>{job.customerId}</TableCell>
                  <TableCell>{job.origin}</TableCell>
                  <TableCell>{job.destination}</TableCell>
                  
                  <TableCell>
                    <Button 
                      variant="contained" 
                      color="success"
                      size="small"
                      onClick={() => handleUpdateStatus(job, 'Delivered')}
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

      {selectedCustomerId && (
        <CustomerRatingModal
          open={isRatingModalOpen}
          onClose={() => setIsRatingModalOpen(false)}
          onSubmit={handleRatingSubmit}
          customerId={selectedCustomerId}
          loading={ratingLoading}
          error={ratingError}
        />
      )}
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