import React, { useState } from 'react';
import { NextPage } from 'next';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  TextField, 
  Button, 
  CircularProgress, 
  Alert, 
  Grid, 
  List, 
  ListItem, 
  ListItemText, 
  Divider
} from '@mui/material';
import Navbar from '../components/layout/Navbar'; // (اتأكد إن المسار ده صح عندك)

// (استدعاء الخريطة بشكل Dynamic عشان تشتغل في المتصفح)
import dynamic from 'next/dynamic';
const MapComponent = dynamic(
  () => import('../components/layout/MapComponent'), 
  { ssr: false }
);

// (تعريف شكل الداتا اللي راجعة من الـ API)
interface PublicShipmentDto {
  shipmentId: number;
  origin: string;
  destination: string;
  status: string;
  lastLatitude: number | null;
  lastLongitude: number | null;
  lastLocationText: string | null;
  lastUpdate: string | null;
}

const API_URL = 'https://localhost:7106'; // (اتأكد من البورت بتاعك)

const TrackPage: NextPage = () => {
  const [searchId, setSearchId] = useState('');
  const [shipment, setShipment] = useState<PublicShipmentDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // (دالة البحث)
  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId) return;

    setLoading(true);
    setError(null);
    setShipment(null);

    try {
      // (بنكلم الـ Public API من غير توكن)
      const response = await fetch(`${API_URL}/api/public/track/${searchId}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Shipment not found. Please check the ID.');
        }
        throw new Error('Failed to track shipment.');
      }

      const data: PublicShipmentDto = await response.json();
      setShipment(data);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // (تجهيز الدبوس للخريطة لو فيه إحداثيات)
  const mapMarkers = shipment && shipment.lastLatitude && shipment.lastLongitude
    ? [{
        lat: shipment.lastLatitude,
        lng: shipment.lastLongitude,
        popupText: shipment.lastLocationText || 'Current Location'
      }]
    : [];

  return (
    <>
      <Navbar />
      
      <Box sx={{ bgcolor: '#F5F5F5', minHeight: '90vh', py: 8 }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ color: '#1A1A1A' }}>
              Track Your Shipment
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Enter your shipment ID to see the live status.
            </Typography>
          </Box>

          {/* (فورم البحث) */}
          <Paper elevation={4} sx={{ p: 4, mb: 5, borderRadius: 3 }}>
            <Box component="form" onSubmit={handleTrack} sx={{ display: 'flex', gap: 2, alignItems: 'stretch' }}>
              <TextField
                fullWidth
                label="Shipment ID"
                variant="outlined"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="e.g. 1"
                InputProps={{ sx: { fontSize: '1.1rem' } }}
              />
              <Button 
                type="submit" 
                variant="contained" 
                size="large"
                disabled={loading}
                sx={{ px: 5, fontSize: '1rem', fontWeight: 'bold', bgcolor: '#1A1A1A', '&:hover': { bgcolor: '#333' } }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Track'}
              </Button>
            </Box>
          </Paper>

          {/* (رسالة الخطأ) */}
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          {/* (عرض النتائج) */}
          {shipment && (
            <Grid container spacing={3}>
              
              {/* (تفاصيل الشحنة) */}
              {/* @ts-ignore */}
              <Grid item xs={12} md={mapMarkers.length > 0 ? 6 : 12}>
                <Paper sx={{ p: 3, height: '100%', borderRadius: 2 }}>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Shipment Status: <span style={{ color: '#FFC107' }}>{shipment.status}</span>
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText primary="Origin" secondary={shipment.origin} />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText primary="Destination" secondary={shipment.destination} />
                    </ListItem>
                    <Divider />
                    {shipment.lastUpdate && (
                      <ListItem>
                        <ListItemText 
                          primary="Last Update" 
                          secondary={`${shipment.lastLocationText || ''} (${shipment.lastUpdate})`} 
                        />
                      </ListItem>
                    )}
                  </List>
                </Paper>
              </Grid>

              {/* (الخريطة - تظهر فقط لو فيه إحداثيات) */}
              {mapMarkers.length > 0 && (
                <>
                   {/* @ts-ignore */}
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ height: 400, width: '100%', overflow: 'hidden', borderRadius: 2 }}>
                       <MapComponent markers={mapMarkers} />
                    </Paper>
                  </Grid>
                </>
              )}
            </Grid>
          )}
        </Container>
      </Box>
    </>
  );
};

export default TrackPage;