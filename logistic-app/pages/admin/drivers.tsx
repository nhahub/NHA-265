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
import DriverFormModal from '../../components/admin/DriverFormModal'; // (اتأكد إنك بتستدعي المودال)

// (تعريف DTO السائق)
interface DriverDto {
  driverId: number;
  name: string;
  email: string;
  phone: string | null;
  licenseNumber: string;
  status: string;
  availability: string;
}

// (تعريف داتا الفورم)
type DriverFormInputs = {
  name: string;
  email?: string;
  password?: string;
  phone: string | null;
  licenseNumber: string;
  status?: string;
  availability?: string;
};

const API_URL = 'https://localhost:7106';

// --- (الكومبوننت الرئيسي) ---
const ManageDriversPage: NextPage = () => {
  const router = useRouter();

  const [drivers, setDrivers] = useState<DriverDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // (States المودال)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentDriver, setCurrentDriver] = useState<DriverDto | null>(null);

  // (ميثود جلب السائقين)
  const fetchDrivers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.push('/auth/login');
        return;
      }
      const headers = { 'Authorization': `Bearer ${token}` };
      const response = await fetch(`${API_URL}/api/drivers`, { headers });

      if (!response.ok) {
        throw new Error('Failed to fetch drivers.');
      }
      setDrivers(await response.json());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, [router]);

  // (ميثود فتح "إضافة")
  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setCurrentDriver(null);
    setModalError(null);
    setIsModalOpen(true);
  };

  // (ميثود فتح "تعديل")
  const handleOpenEditModal = (driver: DriverDto) => {
    setIsEditMode(true);
    setCurrentDriver(driver); 
    setModalError(null);
    setIsModalOpen(true);
  };
  
  // (ميثود إرسال الفورم (Create/Update))
  const handleFormSubmit = async (data: Partial<DriverFormInputs>) => {
    setModalLoading(true);
    setModalError(null);
    
    const token = localStorage.getItem('authToken');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };

    try {
      let response: Response;
      
      if (isEditMode && currentDriver) {
        // --- (وضع التعديل - PUT) ---
        response = await fetch(`${API_URL}/api/drivers/${currentDriver.driverId}`, {
          method: 'PUT',
          headers: headers,
          body: JSON.stringify(data), 
        });
      } else {
        // --- (وضع الإضافة - POST) ---
        response = await fetch(`${API_URL}/api/drivers`, {
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
      fetchDrivers(); 

    } catch (err: any) {
      setModalError(err.message);
    } finally {
      setModalLoading(false);
    }
  };

  // --- (عرض الواجهة) ---
  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <>
      {/* (ده الهيدر اللي فيه الزرار والعنوان) */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 0 }}>
          Manage Drivers
        </Typography>
        <Button variant="contained" onClick={handleOpenAddModal}>
          Add New Driver
        </Button>
      </Box>

      {/* (ده الجدول - مفيهوش أي فورم) */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>License</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Availability</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {drivers.map((driver) => (
              <TableRow key={driver.driverId}>
                <TableCell>{driver.driverId}</TableCell>
                <TableCell>{driver.name}</TableCell>
                <TableCell>{driver.email}</TableCell>
                <TableCell>{driver.phone || 'N/A'}</TableCell>
                <TableCell>{driver.licenseNumber}</TableCell>
                <TableCell>{driver.status}</TableCell>
                <TableCell>{driver.availability}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => handleOpenEditModal(driver)}>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* (ده المودال "المخفي" اللي بيظهر لما تدوس على الأزرار) */}
      <DriverFormModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        isEditMode={isEditMode}
        defaultValues={isEditMode ? currentDriver : null}
        loading={modalLoading}
        error={modalError}
      />
    </>
  );
};

// --- (الحماية) ---
const ProtectedManageDriversPage: NextPage = () => {
  return (
    <AdminGuard>
      <AdminLayout>
        <ManageDriversPage />
      </AdminLayout>
    </AdminGuard>
  );
};

export default ProtectedManageDriversPage;