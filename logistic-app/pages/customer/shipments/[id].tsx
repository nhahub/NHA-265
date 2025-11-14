import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { 
  Typography, 
  Paper, 
  Box, 
  CircularProgress, 
  Alert, 
  List, 
  ListItem, 
  ListItemText, 
  Divider,
  Grid,
  Rating,
  TextField,
  Button 
} from '@mui/material';
import AuthGuard from '../../../components/auth/AuthGuard';
import CustomerLayout from '../../../components/layout/CustomerLayout';

interface ShipmentDetailsDto {
  shipmentId: number;
  origin: string;
  destination: string;
  status: string;
  priority: string;
  weight: number | null;
  createdAt: string;
  scheduledDate: string | null;
  scheduledTime: string | null;
  driverName: string;
  vehiclePlateNumber: string;
}

interface TrackingEntryDto {
  location: string;
  status: string;
  timestamp: string;
}

const API_URL = 'https://localhost:7106';

const ShipmentRating = ({ shipmentId, onRatingSuccess }: { shipmentId: number, onRatingSuccess: () => void }) => {
  const [ratingValue, setRatingValue] = useState<number | null>(null);
  const [comments, setComments] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmitRating = async () => {
    if (!ratingValue || ratingValue === 0) {
      setError("Please provide a rating (1-5 stars).");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('authToken');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const response = await fetch(`${API_URL}/api/ratings`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          shipmentId: shipmentId,
          ratingValue: ratingValue,
          comments: comments
        })
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Failed to submit rating.');
      }

      alert("Thank you for your feedback!");
      onRatingSuccess();

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Rate this Shipment
      </Typography>
      <Box component="form" noValidate>
        <Typography component="legend">Your Rating</Typography>
        <Rating
          name="shipment-rating"
          value={ratingValue}
          onChange={(event, newValue) => {
            setRatingValue(newValue);
          }}
        />
        <TextField
          margin="normal"
          fullWidth
          multiline
          rows={3}
          label="Comments (Optional)"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        />
        {error && <Alert severity="error" sx={{ my: 1 }}>{error}</Alert>}
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handleSubmitRating}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Submit Rating"}
        </Button>
      </Box>
    </Paper>
  );
};


const ShipmentDetailsPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query; 

  const [shipment, setShipment] = useState<ShipmentDetailsDto | null>(null);
  const [trackingHistory, setTrackingHistory] = useState<TrackingEntryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasRated, setHasRated] = useState(false);

  useEffect(() => {
    if (!id) return; 
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('authToken');
        if (!token) { router.push('/auth/login'); return; }
        const headers = { 'Authorization': `Bearer ${token}` };

        const [shipmentRes, trackingRes] = await Promise.all([
          fetch(`${API_URL}/api/shipments/${id}`, { headers }),
          fetch(`${API_URL}/api/tracking/${id}`, { headers })
        ]);

        if (!shipmentRes.ok) { throw new Error('Failed to fetch shipment details'); }
        if (!trackingRes.ok) { console.error("Failed to fetch tracking history"); }

        setShipment(await shipmentRes.json());
        if (trackingRes.ok) { setTrackingHistory(await trackingRes.json()); }

      } catch (err: any) { setError(err.message); } 
      finally { setLoading(false); }
    };
    fetchDetails();
  }, [id, router]); 

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!shipment) return <Alert severity="info">No details found.</Alert>;

  return (
    <>
      <Grid container spacing={3}>
        {/* @ts-ignore */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              Shipment Details #{shipment.shipmentId}
            </Typography>
            <List>
              <ListItem><ListItemText primary="Status" secondary={shipment.status} /></ListItem>
              <Divider />
              <ListItem><ListItemText primary="Origin" secondary={shipment.origin} /></ListItem>
              <Divider />
              <ListItem><ListItemText primary="Destination" secondary={shipment.destination} /></ListItem>
              <Divider />
              <ListItem><ListItemText primary="Driver" secondary={shipment.driverName} /></ListItem>
              <Divider />
              <ListItem><ListItemText primary="Vehicle" secondary={shipment.vehiclePlateNumber} /></ListItem>
            </List>
          </Paper>
        </Grid>

        {/* @ts-ignore */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              Tracking History
            </Typography>
            <List>
              {trackingHistory.length > 0 ? (
                trackingHistory.map((entry, index) => (
                  <ListItem key={index}>
                    <ListItemText 
                      primary={entry.location} 
                      secondary={`${entry.status} - ${entry.timestamp}`} 
                    />
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="No tracking history available yet." />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {shipment.status === 'Delivered' && !hasRated && (
        <ShipmentRating 
          shipmentId={shipment.shipmentId} 
          onRatingSuccess={() => setHasRated(true)} 
        />
      )}
      
      {hasRated && (
         <Alert severity="success" sx={{ mt: 3 }}>
           Thank you for rating this shipment!
         </Alert>
      )}
    </>
  );
};

const ProtectedShipmentDetailsPage: NextPage = () => {
  return (
    <AuthGuard>
      <CustomerLayout>
        <ShipmentDetailsPage />
      </CustomerLayout>
    </AuthGuard>
  );
};

export default ProtectedShipmentDetailsPage;