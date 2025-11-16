import React, { useEffect } from 'react';
import { 
  Modal, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Grid,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from '@mui/material';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';

type PaymentFormInputs = {
  shipmentId: number;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
};

interface PaymentFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PaymentFormInputs) => Promise<void>;
  defaultValues: PaymentFormInputs;
  loading: boolean;
  error: string | null;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const PaymentFormModal: React.FC<PaymentFormModalProps> = ({ 
  open, 
  onClose, 
  onSubmit, 
  defaultValues, 
  loading,
  error
}) => {
  
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<PaymentFormInputs>();

  useEffect(() => {
    if (open) {
        reset(defaultValues); 
    }
  }, [open, defaultValues, reset]);

  const handleFormSubmit: SubmitHandler<PaymentFormInputs> = (data) => {
    onSubmit(data);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">
          Manage Payment for Shipment #{defaultValues.shipmentId}
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate sx={{ mt: 2 }}>
          {/* @ts-ignore */}
          <Grid container spacing={2}>
            
            {/* @ts-ignore */}
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Amount (EGP)"
                type="number"
                {...register("amount", { 
                    required: "Amount is required",
                    valueAsNumber: true,
                    min: { value: 1, message: "Amount must be positive" }
                })}
                error={!!errors.amount}
                helperText={errors.amount?.message}
              />
            </Grid>

            {/* @ts-ignore */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="method-label">Method</InputLabel>
                <Controller
                  name="paymentMethod"
                  control={control}
                  render={({ field }) => (
                    <Select labelId="method-label" {...field}>
                      <MenuItem value="Cash">Cash</MenuItem>
                      <MenuItem value="Card">Card</MenuItem>
                      <MenuItem value="Online">Online</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
            
            {/* @ts-ignore */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="status-label">Status</InputLabel>
                <Controller
                  name="paymentStatus"
                  control={control}
                  render={({ field }) => (
                    <Select labelId="status-label" {...field}>
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="Completed">Completed</MenuItem>
                      <MenuItem value="Failed">Failed</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>

            {error && (
              <>
                {/* @ts-ignore */}
                <Grid item xs={12}>
                  <Alert severity="error">{error}</Alert>
                </Grid>
              </>
            )}
            
            {/* @ts-ignore */}
            <Grid item xs={12}>
              <Button type="submit" fullWidth variant="contained" disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Save Payment'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Modal>
  );
};

export default PaymentFormModal;