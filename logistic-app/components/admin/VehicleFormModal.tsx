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

type VehicleFormInputs = {
  vehicleId?: number;
  plateNumber: string;
  type: string;
  capacity: number | null;
  status: string;
};

interface VehicleFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<VehicleFormInputs>) => Promise<void>;
  defaultValues?: Partial<VehicleFormInputs> | null;
  isEditMode: boolean; 
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

const VehicleFormModal: React.FC<VehicleFormModalProps> = ({ 
  open, 
  onClose, 
  onSubmit, 
  defaultValues, 
  isEditMode,
  loading,
  error
}) => {
  
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<VehicleFormInputs>();

  useEffect(() => {
    if (open) {
      if (isEditMode && defaultValues) {
        reset(defaultValues);
      } else {
        reset({
          plateNumber: '',
          type: 'Van',
          capacity: null,
          status: 'Available'
        }); 
      }
    }
  }, [open, isEditMode, defaultValues, reset]);

  const handleFormSubmit: SubmitHandler<VehicleFormInputs> = (data) => {
    const dataToSubmit = isEditMode ? { ...data, vehicleId: defaultValues?.vehicleId } : data;
    onSubmit(dataToSubmit);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">
          {isEditMode ? 'Edit Vehicle' : 'Add New Vehicle'}
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate sx={{ mt: 2 }}>
          {/* @ts-ignore */}
          <Grid container spacing={2}>
            {/* @ts-ignore */}
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Plate Number"
                {...register("plateNumber", { required: "Plate number is required" })}
                error={!!errors.plateNumber}
                helperText={errors.plateNumber?.message}
              />
            </Grid>

            {/* @ts-ignore */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="type-label">Type</InputLabel>
                <Controller
                  name="type"
                  control={control}
                  defaultValue="Van"
                  render={({ field }) => (
                    <Select labelId="type-label" {...field}>
                      <MenuItem value="Van">Van</MenuItem>
                      <MenuItem value="Truck">Truck</MenuItem>
                      <MenuItem value="Bike">Bike</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>

            {/* @ts-ignore */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Capacity (kg)"
                type="number"
                {...register("capacity", { 
                  valueAsNumber: true,
                  min: { value: 0, message: "Must be positive" }
                })}
                error={!!errors.capacity}
                helperText={errors.capacity?.message}
              />
            </Grid>

            {isEditMode && (
              <>
                {/* @ts-ignore */}
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="status-label">Status</InputLabel>
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <Select labelId="status-label" {...field}>
                          <MenuItem value="Available">Available</MenuItem>
                          <MenuItem value="In Use">In Use</MenuItem>
                          <MenuItem value="Maintenance">Maintenance</MenuItem>
                        </Select>
                      )}
                    />
                  </FormControl>
                </Grid>
              </>
            )}
            
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
                {loading ? <CircularProgress size={24} /> : (isEditMode ? 'Save Changes' : 'Add Vehicle')}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Modal>
  );
};

export default VehicleFormModal;