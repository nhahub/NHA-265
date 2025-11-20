import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { 
  Typography, Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, 
  CircularProgress, Alert, Select, MenuItem, FormControl, InputLabel, Button, Box, Grid, 
  Card, CardContent, Avatar, Chip
} from '@mui/material';
import AdminGuard from '../../components/auth/AdminGuard';
import AdminLayout from '../../components/layout/AdminLayout';
import { useRouter } from 'next/router';

import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import PersonIcon from '@mui/icons-material/Person';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

interface DashboardStatsDto {
  pendingShipments: number;
  inTransitShipments: number;
  availableDrivers: number;
  availableVehicles: number;
  totalRevenue: number;
}
interface ShipmentDto {
  shipmentId: number;
  origin: string;
  destination: string;
  status: string;
  scheduledDate: string | null;
}
interface AvailableDriverDto { driverId: number; name: string; status: string; }
interface AvailableVehicleDto { vehicleId: number; plateNumber: string; type: string; }
interface AssignmentState { [shipmentId: number]: { driverId: string; vehicleId: string; } }

const API_URL = 'https://localhost:7106';

const StatCard = ({ title, value, icon, color }: { title: string, value: string | number, icon: any, color: string }) => (
  <Card sx={{ height: '100%', boxShadow: 3, borderRadius: 2, position: 'relative', overflow: 'hidden' }}>
    <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '5px', bgcolor: color }} />
    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, pt: 3 }}>
      <Avatar sx={{ bgcolor: `${color}22`, color: color, width: 56, height: 56 }}>
        {icon}
      </Avatar>
      <Box>
        <Typography variant="body2" color="text.secondary" fontWeight="bold" sx={{ textTransform: 'uppercase' }}>
          {title}
        </Typography>
        <Typography variant="h4" fontWeight="bold" color="text.primary">
          {value}
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

const AdminDashboard: NextPage = () => {
  const router = useRouter();
  
  const [stats, setStats] = useState<DashboardStatsDto | null>(null);
  const [pendingShipments, setPendingShipments] = useState<ShipmentDto[]>([]);
  const [availableDrivers, setAvailableDrivers] = useState<AvailableDriverDto[]>([]);
  const [availableVehicles, setAvailableVehicles] = useState<AvailableVehicleDto[]>([]);
  const [assignments, setAssignments] = useState<AssignmentState>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true); setError(null);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) { router.push('/auth/login'); return; }
      const headers = { 'Authorization': `Bearer ${token}` };

      const [statsRes, shipmentsRes, driversRes, vehiclesRes] = await Promise.all([
        fetch(`${API_URL}/api/dashboard/stats`, { headers }),
        fetch(`${API_URL}/api/shipments/pending`, { headers }),
        fetch(`${API_URL}/api/drivers/available`, { headers }),
        fetch(`${API_URL}/api/vehicles/available`, { headers })
      ]);

      if (!statsRes.ok || !shipmentsRes.ok || !driversRes.ok || !vehiclesRes.ok) throw new Error('Data fetch failed');

      setStats(await statsRes.json());
      setPendingShipments(await shipmentsRes.json());
      setAvailableDrivers(await driversRes.json());
      setAvailableVehicles(await vehiclesRes.json());
    } catch (err: any) { setError(err.message); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [router]);

  const handleAssign = async (shipmentId: number) => {
    const assignment = assignments[shipmentId];
    if (!assignment || !assignment.driverId || !assignment.vehicleId) { alert("Select driver & vehicle"); return; }
    try {
      const token = localStorage.getItem('authToken');
      const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
      const response = await fetch(`${API_URL}/api/shipments/${shipmentId}/assign`, {
        method: 'PUT', headers: headers,
        body: JSON.stringify({ driverId: Number(assignment.driverId), vehicleId: Number(assignment.vehicleId) })
      });
      if (!response.ok) throw new Error('Failed.');
      alert('Assigned!'); fetchData(); 
    } catch (err: any) { alert(err.message); }
  };

  const handleAssignmentChange = (shipmentId: number, type: 'driver' | 'vehicle', value: string) => {
    setAssignments(prev => ({
      ...prev, [shipmentId]: { ...prev[shipmentId], [type === 'driver' ? 'driverId' : 'vehicleId']: value }
    }));
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>;

  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="800" gutterBottom sx={{ color: 'secondary.main' }}>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Overview of your logistics operations.
        </Typography>
      </Box>

      {/* @ts-ignore */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {/* @ts-ignore */}
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard title="Pending" value={stats?.pendingShipments ?? 0} icon={<PendingActionsIcon />} color="#FF9800" />
        </Grid>
        {/* @ts-ignore */}
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard title="In Transit" value={stats?.inTransitShipments ?? 0} icon={<LocalShippingIcon />} color="#2196F3" />
        </Grid>
        {/* @ts-ignore */}
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard title="Drivers" value={stats?.availableDrivers ?? 0} icon={<PersonIcon />} color="#4CAF50" />
        </Grid>
        {/* @ts-ignore */}
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard title="Vehicles" value={stats?.availableVehicles ?? 0} icon={<DirectionsCarIcon />} color="#9C27B0" />
        </Grid>
        {/* @ts-ignore */}
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard title="Revenue" value={`EGP ${stats?.totalRevenue ?? 0}`} icon={<AttachMoneyIcon />} color="#FFC107" />
        </Grid>
      </Grid>

      <Paper sx={{ p: 0, boxShadow: 3, borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ p: 2, bgcolor: '#fff', borderBottom: '1px solid #eee' }}>
           <Typography variant="h6" fontWeight="bold">Assign Pending Shipments</Typography>
        </Box>
        <TableContainer>
          <Table sx={{ minWidth: 900 }}>
            <TableHead sx={{ bgcolor: 'secondary.main' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Origin</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Destination</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Assign Driver</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Assign Vehicle</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pendingShipments.length > 0 ? (
                pendingShipments.map((shipment) => (
                  <TableRow key={shipment.shipmentId} hover>
                    <TableCell>
                      <Chip label={`#${shipment.shipmentId}`} size="small" sx={{ fontWeight: 'bold' }} />
                    </TableCell>
                    <TableCell>{shipment.origin}</TableCell>
                    <TableCell>{shipment.destination}</TableCell>
                    <TableCell>
                      <FormControl fullWidth size="small" variant="outlined">
                        <InputLabel>Driver</InputLabel>
                        <Select
                          value={assignments[shipment.shipmentId]?.driverId || ''}
                          label="Driver"
                          onChange={(e) => handleAssignmentChange(shipment.shipmentId, 'driver', e.target.value)}
                        >
                          {availableDrivers.map((driver) => (
                            <MenuItem key={driver.driverId} value={driver.driverId}>{driver.name}</MenuItem>
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
                            <MenuItem key={vehicle.vehicleId} value={vehicle.vehicleId}>{vehicle.plateNumber}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="contained" 
                        color="primary"
                        disableElevation
                        onClick={() => handleAssign(shipment.shipmentId)}
                        sx={{ fontWeight: 'bold' }}
                      >
                        Assign
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                    <Typography variant="body1" color="text.secondary">No pending shipments to assign.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
};

const ProtectedAdminDashboard: NextPage = () => {
  return ( <AdminGuard> <AdminLayout> <AdminDashboard /> </AdminLayout> </AdminGuard> );
};

export default ProtectedAdminDashboard;