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
import VehicleFormModal from '../../components/admin/VehicleFormModal';

interface VehicleDto {
  vehicleId: number;
  plateNumber: string;
  type: string;
  capacity: number | null;
  status: string;
}

type VehicleFormInputs = {
  vehicleId?: number;
  plateNumber: string;
  type: string;
  capacity: number | null;
  status: string;
};

const API_URL = 'https://localhost:7106';

const ManageVehiclesPage: NextPage = () => {
  const router = useRouter();

  const [vehicles, setVehicles] = useState<VehicleDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState<VehicleDto | null>(null);

  const fetchVehicles = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.push('/auth/login');
        return;
      }
      const headers = { 'Authorization': `Bearer ${token}` };
      const response = await fetch(`${API_URL}/api/vehicles`, { headers });

      if (!response.ok) {
        throw new Error('Failed to fetch vehicles.');
      }
      setVehicles(await response.json());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [router]);

  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setCurrentVehicle(null);
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (vehicle: VehicleDto) => {
    setIsEditMode(true);
    setCurrentVehicle(vehicle); 
    setModalError(null);
    setIsModalOpen(true);
  };
  
  const handleFormSubmit = async (data: Partial<VehicleFormInputs>) => {
    setModalLoading(true);
    setModalError(null);
    
    const token = localStorage.getItem('authToken');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };

    try {
      let response: Response;
      
      if (isEditMode && currentVehicle) {
        response = await fetch(`${API_URL}/api/vehicles/${currentVehicle.vehicleId}`, {
          method: 'PUT',
          headers: headers,
          body: JSON.stringify(data), 
        });
      } else {
        response = await fetch(`${API_URL}/api/vehicles`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(data),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit form.');
      }

      setIsModalOpen(false); 
      fetchVehicles();

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
          Manage Vehicles
        </Typography>
        <Button variant="contained" onClick={handleOpenAddModal}>
          Add New Vehicle
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Plate Number</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Capacity (kg)</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vehicles.map((vehicle) => (
              <TableRow key={vehicle.vehicleId}>
                <TableCell>{vehicle.vehicleId}</TableCell>
                <TableCell>{vehicle.plateNumber}</TableCell>
                <TableCell>{vehicle.type}</TableCell>
                <TableCell>{vehicle.capacity || 'N/A'}</TableCell>
                <TableCell>{vehicle.status}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => handleOpenEditModal(vehicle)}>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <VehicleFormModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        isEditMode={isEditMode}
        defaultValues={isEditMode ? currentVehicle : null}
        loading={modalLoading}
        error={modalError}
      />
    </>
  );
};

const ProtectedManageVehiclesPage: NextPage = () => {
  return (
    <AdminGuard>
      <AdminLayout>
        <ManageVehiclesPage />
      </AdminLayout>
    </AdminGuard>
  );
};

export default ProtectedManageVehiclesPage;