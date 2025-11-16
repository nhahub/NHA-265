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
  Button,
  Box,
} from '@mui/material';
import AdminGuard from '../../components/auth/AdminGuard';
import AdminLayout from '../../components/layout/AdminLayout';
import { useRouter } from 'next/router';
import PaymentFormModal from '../../components/admin/PaymentFormModal';

interface ShipmentAdminDto {
  shipmentId: number;
  customerName: string;
  driverName: string;
  origin: string;
  destination: string;
  status: string;
  scheduledDate: string | null;
}

type PaymentFormInputs = {
  shipmentId: number;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
};

const defaultPaymentValues: PaymentFormInputs = {
  shipmentId: 0,
  amount: 0,
  paymentMethod: 'Cash',
  paymentStatus: 'Pending',
};

const API_URL = 'https://localhost:7106';

const ManageAllShipmentsPage: NextPage = () => {
  const router = useRouter();

  const [shipments, setShipments] = useState<ShipmentAdminDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [currentPayment, setCurrentPayment] = useState<PaymentFormInputs>(defaultPaymentValues);

  const fetchAllShipments = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.push('/auth/login');
        return;
      }
      const headers = { 'Authorization': `Bearer ${token}` };
      const response = await fetch(`${API_URL}/api/shipments`, { headers });

      if (!response.ok) {
        throw new Error('Failed to fetch shipments.');
      }
      setShipments(await response.json());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllShipments();
  }, [router]);

  const handleOpenPaymentModal = async (shipmentId: number) => {
    setModalError(null);
    
    try {
        const token = localStorage.getItem('authToken');
        const headers = { 'Authorization': `Bearer ${token}` };
        const res = await fetch(`${API_URL}/api/payments/${shipmentId}`, { headers });
        
        if (res.ok) {
            const payments = await res.json();
            if (payments.length > 0) {
                setCurrentPayment({
                    shipmentId: shipmentId,
                    amount: payments[0].amount,
                    paymentMethod: payments[0].paymentMethod,
                    paymentStatus: payments[0].paymentStatus
                });
            } else {
                setCurrentPayment({ ...defaultPaymentValues, shipmentId: shipmentId });
            }
        } else {
             setCurrentPayment({ ...defaultPaymentValues, shipmentId: shipmentId });
        }
    } catch (err) {
         setCurrentPayment({ ...defaultPaymentValues, shipmentId: shipmentId });
    }
    
    setIsModalOpen(true);
  };

  const handlePaymentFormSubmit = async (data: PaymentFormInputs) => {
    setModalLoading(true);
    setModalError(null);
    
    const token = localStorage.getItem('authToken');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };

    try {
      const response = await fetch(`${API_URL}/api/payments`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update payment.');
      }

      setIsModalOpen(false); 
      alert('Payment updated successfully!');

    } catch (err: any) {
      setModalError(err.message);
    } finally {
      setModalLoading(false);
    }
  };


  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 0 }}>
          Manage All Shipments
        </Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Driver</TableCell>
              <TableCell>Origin</TableCell>
              <TableCell>Destination</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shipments.map((shipment) => (
              <TableRow key={shipment.shipmentId}>
                <TableCell>{shipment.shipmentId}</TableCell>
                <TableCell>{shipment.customerName}</TableCell>
                <TableCell>{shipment.driverName}</TableCell>
                <TableCell>{shipment.origin}</TableCell>
                <TableCell>{shipment.destination}</TableCell>
                <TableCell>{shipment.status}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => handleOpenPaymentModal(shipment.shipmentId)}>
                    Payment
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <PaymentFormModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handlePaymentFormSubmit}
        defaultValues={currentPayment}
        loading={modalLoading}
        error={modalError}
      />
    </>
  );
};

const ProtectedManageAllShipmentsPage: NextPage = () => {
  return (
    <AdminGuard>
      <AdminLayout>
        <ManageAllShipmentsPage />
      </AdminLayout>
    </AdminGuard>
  );
};

export default ProtectedManageAllShipmentsPage;