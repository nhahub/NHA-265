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
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AdminGuard from '../../components/auth/AdminGuard';
import AdminLayout from '../../components/layout/AdminLayout';
import { useRouter } from 'next/router';
import CityFormModal from '../../components/admin/CityFormModal';

interface City {
  cityId: number;
  cityName: string;
  region: string | null;
}

type CityFormInputs = {
  cityId?: number;
  cityName: string;
  region: string | null;
};

const API_URL = 'https://localhost:7106';

const ManageCitiesPage: NextPage = () => {
  const router = useRouter();

  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCity, setCurrentCity] = useState<City | null>(null);

  const fetchCities = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.push('/auth/login');
        return;
      }
      const headers = { 'Authorization': `Bearer ${token}` };
      const response = await fetch(`${API_URL}/api/cities`, { headers });

      if (!response.ok) {
        throw new Error('Failed to fetch cities.');
      }
      setCities(await response.json());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, [router]);

  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setCurrentCity(null);
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (city: City) => {
    setIsEditMode(true);
    setCurrentCity(city);
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (data: Partial<CityFormInputs>) => {
    setModalLoading(true);
    setModalError(null);

    const token = localStorage.getItem('authToken');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };

    try {
      let response: Response;

      if (isEditMode && currentCity) {
        response = await fetch(`${API_URL}/api/cities/${currentCity.cityId}`, {
          method: 'PUT',
          headers: headers,
          body: JSON.stringify(data),
        });
      } else {
        response = await fetch(`${API_URL}/api/cities`, {
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
      fetchCities();
    } catch (err: any) {
      setModalError(err.message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this city?")) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const headers = { 'Authorization': `Bearer ${token}` };

      const response = await fetch(`${API_URL}/api/cities/${id}`, {
        method: 'DELETE',
        headers: headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete city.');
      }

      fetchCities();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 0 }}>
          Manage Cities
        </Typography>
        <Button variant="contained" onClick={handleOpenAddModal}>
          Add New City
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>City Name</TableCell>
              <TableCell>Region</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cities.map((city) => (
              <TableRow key={city.cityId}>
                <TableCell>{city.cityId}</TableCell>
                <TableCell>{city.cityName}</TableCell>
                <TableCell>{city.region || 'N/A'}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpenEditModal(city)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(city.cityId)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <CityFormModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        isEditMode={isEditMode}
        defaultValues={isEditMode ? currentCity : null}
        loading={modalLoading}
        error={modalError}
      />
    </>
  );
};

const ProtectedManageCitiesPage: NextPage = () => {
  return (
    <AdminGuard>
      <AdminLayout>
        <ManageCitiesPage />
      </AdminLayout>
    </AdminGuard>
  );
};

export default ProtectedManageCitiesPage;