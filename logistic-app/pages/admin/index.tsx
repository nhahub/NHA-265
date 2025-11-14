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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Box
} from '@mui/material';
import AdminGuard from '../../components/auth/AdminGuard';
import AdminLayout from '../../components/layout/AdminLayout';
import { useRouter } from 'next/router';

interface ShipmentDto {
  shipmentId: number;
  origin: string;
  destination: string;
  status: string;
  scheduledDate: string | null;
}

interface AvailableDriverDto {
  driverId: number;
  name: string;
  status: string;
}

interface AvailableVehicleDto {
  vehicleId: number;
  plateNumber: string;
  type: string;
}

interface AssignmentState {
  [shipmentId: number]: {
    driverId: string;
    vehicleId: string;
  }
}

const API_URL = 'https://localhost:7106';

const AdminDashboard: NextPage = () => {
  const router = useRouter();
  
  const [pendingShipments, setPendingShipments] = useState<ShipmentDto[]>([]);
  const [availableDrivers, setAvailableDrivers] = useState<AvailableDriverDto[]>([]);
  const [availableVehicles, setAvailableVehicles] = useState<AvailableVehicleDto[]>([]);
  
  const [assignments, setAssignments] = useState<AssignmentState>({});
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.push('/auth/login');
        return;
      }
      const headers = { 'Authorization': `Bearer ${token}` };

      const [shipmentsRes, driversRes, vehiclesRes] = await Promise.all([
        fetch(`${API_URL}/api/shipments/pending`, { headers }),
        fetch(`${API_URL}/api/drivers/available`, { headers }),
        fetch(`${API_URL}/api/vehicles/available`, { headers })
      ]);

      if (!shipmentsRes.ok || !driversRes.ok || !vehiclesRes.ok) {
        throw new Error('Failed to fetch necessary data.');
      }

      setPendingShipments(await shipmentsRes.json());
      setAvailableDrivers(await driversRes.json());
      setAvailableVehicles(await vehiclesRes.json());
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [router]);

  const handleAssignmentChange = (shipmentId: number, type: 'driver' | 'vehicle', value: string) => {
    setAssignments(prev => ({
      ...prev,
      [shipmentId]: {
        ...prev[shipmentId],
        [type === 'driver' ? 'driverId' : 'vehicleId']: value
      }
    }));
  };

  const handleAssign = async (shipmentId: number) => {
    const assignment = assignments[shipmentId];

    if (!assignment || !assignment.driverId || !assignment.vehicleId) {
      alert("Please select both a driver and a vehicle.");
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const response = await fetch(`${API_URL}/api/shipments/${shipmentId}/assign`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify({
          driverId: Number(assignment.driverId),
          vehicleId: Number(assignment.vehicleId)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to assign shipment.');
      }

      alert('Shipment assigned successfully!');
      
      fetchData(); 
      
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };


  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Pending Shipments
      </Typography>
      
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 900 }} aria-label="assign table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Origin</TableCell>
              <TableCell>Destination</TableCell>
              <TableCell>Assign Driver</TableCell>
              <TableCell>Assign Vehicle</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingShipments.length > 0 ? (
              pendingShipments.map((shipment) => (
                <TableRow key={shipment.shipmentId}>
                  <TableCell>{shipment.shipmentId}</TableCell>
                  <TableCell>{shipment.origin}</TableCell>
                  <TableCell>{shipment.destination}</TableCell>
                  
                  <TableCell>
                    <FormControl fullWidth size="small">
                      <InputLabel>Driver</InputLabel>
                      <Select
                        value={assignments[shipment.shipmentId]?.driverId || ''}
                        label="Driver"
                        onChange={(e) => handleAssignmentChange(shipment.shipmentId, 'driver', e.target.value)}
                      >
                        {availableDrivers.map((driver) => (
                          <MenuItem key={driver.driverId} value={driver.driverId}>
                            {driver.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>

                  <TableCell>
                    <FormControl fullWidth size="small">
                      <InputLabel>Vehicle</InputLabel>
                      <Select
                        value={assignments[shipment.shipmentId]?.vehicleId || ''}
                        label="Vehicle"
                        onChange={(e) => handleAssignmentChange(shipment.shipmentId, 'vehicle', e.target.value)}
                      >
                        {availableVehicles.map((vehicle) => (
                          <MenuItem key={vehicle.vehicleId} value={vehicle.vehicleId}>
                            {vehicle.plateNumber} ({vehicle.type})
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>

                  <TableCell>
                    <Button 
                      variant="contained" 
                      size="small"
                      onClick={() => handleAssign(shipment.shipmentId)}
                    >
                      Assign
                    </Button>
                  </TableCell>

                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No pending shipments.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

const ProtectedAdminDashboard: NextPage = () => {
  return (
    <AdminGuard>
      <AdminLayout>
        <AdminDashboard />
      </AdminLayout>
    </AdminGuard>
  );
};

export default ProtectedAdminDashboard;