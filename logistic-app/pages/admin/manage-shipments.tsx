import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import {
  Typography, Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody,
  CircularProgress, Alert, Button, Box, Chip, Container
} from '@mui/material';
import AdminGuard from '../../components/auth/AdminGuard';
import AdminLayout from '../../components/layout/AdminLayout';
import { useRouter } from 'next/router';
import PaymentFormModal from '../../components/admin/PaymentFormModal';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EditIcon from '@mui/icons-material/Edit';

interface ShipmentAdminDto {
  shipmentId: number; customerName: string; driverName: string; origin: string;
  destination: string; status: string; scheduledDate: string | null; paymentStatus: string;
}
type PaymentFormInputs = { shipmentId: number; amount: number; paymentMethod: string; paymentStatus: string; };
const defaultPaymentValues: PaymentFormInputs = { shipmentId: 0, amount: 0, paymentMethod: 'Cash', paymentStatus: 'Pending' };
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
    setLoading(true); setError(null);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) { router.push('/auth/login'); return; }
      const headers = { 'Authorization': `Bearer ${token}` };
      const response = await fetch(`${API_URL}/api/shipments`, { headers });
      if (!response.ok) throw new Error('Failed');
      setShipments(await response.json());
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };
  useEffect(() => { fetchAllShipments(); }, [router]);

  const handleOpenPaymentModal = async (shipmentId: number) => {
     setModalError(null);
     try {
         const token = localStorage.getItem('authToken');
         const headers = { 'Authorization': `Bearer ${token}` };
         const res = await fetch(`${API_URL}/api/payments/${shipmentId}`, { headers });
         if (res.ok) {
             const payments = await res.json();
             if (payments.length > 0) {
                 setCurrentPayment({ shipmentId, amount: payments[0].amount, paymentMethod: payments[0].paymentMethod, paymentStatus: payments[0].paymentStatus });
             } else { setCurrentPayment({ ...defaultPaymentValues, shipmentId }); }
         } else { setCurrentPayment({ ...defaultPaymentValues, shipmentId }); }
     } catch (err) { setCurrentPayment({ ...defaultPaymentValues, shipmentId }); }
     setIsModalOpen(true);
  };

  const handlePaymentFormSubmit = async (data: PaymentFormInputs) => {
     setModalLoading(true); setModalError(null);
     const token = localStorage.getItem('authToken');
     const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
     try {
       const response = await fetch(`${API_URL}/api/payments`, { method: 'POST', headers, body: JSON.stringify(data) });
       if (!response.ok) throw new Error('Failed');
       setIsModalOpen(false); alert('Saved!'); fetchAllShipments();
     } catch (err: any) { setModalError(err.message); } finally { setModalLoading(false); }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: 'secondary.main' }}>
          Financial & Shipments
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage all shipments billing and statuses.
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: '#1A1A1A' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Customer</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Driver</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Route</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Payment</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {shipments.map((shipment) => (
                <TableRow key={shipment.shipmentId} hover>
                  <TableCell>
                     <Typography variant="body2" fontWeight="bold">#{shipment.shipmentId}</Typography>
                  </TableCell>
                  <TableCell>{shipment.customerName}</TableCell>
                  <TableCell>{shipment.driverName}</TableCell>
                  <TableCell>
                    <Typography variant="body2">{shipment.origin}</Typography>
                    <Typography variant="caption" color="text.secondary">to {shipment.destination}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                        label={shipment.status} size="small"
                        color={shipment.status === 'Delivered' ? 'success' : shipment.status === 'Pending' ? 'warning' : 'primary'} 
                        variant={shipment.status === 'Pending' ? 'outlined' : 'filled'}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                        label={shipment.paymentStatus} size="small"
                        icon={shipment.paymentStatus === 'Completed' ? undefined : <AttachMoneyIcon />}
                        color={shipment.paymentStatus === 'Completed' ? 'success' : shipment.paymentStatus === 'Pending' ? 'warning' : 'default'} 
                    />
                  </TableCell>
                  <TableCell>
                    <Button 
                        variant="outlined" size="small" startIcon={<EditIcon />}
                        onClick={() => handleOpenPaymentModal(shipment.shipmentId)}
                        sx={{ borderColor: '#FFC107', color: 'black', '&:hover': { borderColor: 'black', bgcolor: '#FFF8E1' } }}
                    >
                      {shipment.paymentStatus === 'Unpaid' ? 'Bill' : 'Edit'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <PaymentFormModal
        open={isModalOpen} onClose={() => setIsModalOpen(false)}
        onSubmit={handlePaymentFormSubmit} defaultValues={currentPayment}
        loading={modalLoading} error={modalError}
      />
    </>
  );
};

const ProtectedManageAllShipmentsPage: NextPage = () => {
  return ( <AdminGuard> <AdminLayout> <ManageAllShipmentsPage /> </AdminLayout> </AdminGuard> );
};
export default ProtectedManageAllShipmentsPage;