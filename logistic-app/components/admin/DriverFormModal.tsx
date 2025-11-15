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

// (ده الشكل الكامل للفورم)
type DriverFormInputs = {
  name: string;
  email: string;
  password?: string;
  phone: string | null;
  licenseNumber: string;
  status: string;
  availability: string;
};

interface DriverFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<DriverFormInputs>) => Promise<void>; 
  defaultValues?: Partial<DriverFormInputs> | null; 
  isEditMode: boolean;
  loading: boolean;
  error: string | null;
}

// (الـ style بتاع المودال)
const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh', // (عشان المودال ميبقاش طويل أوي)
  overflowY: 'auto' // (عشان نقدر نعمل سكرول لو المودال طويل)
};

const DriverFormModal: React.FC<DriverFormModalProps> = ({ 
  open, 
  onClose, 
  onSubmit, 
  defaultValues, 
  isEditMode,
  loading,
  error
}) => {
  
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<DriverFormInputs>();

  useEffect(() => {
    if (open) {
      if (isEditMode && defaultValues) {
        reset(defaultValues);
      } else {
        reset({
          name: '',
          email: '',
          password: '',
          phone: '',
          licenseNumber: '',
          status: 'Active',
          availability: 'Available'
        }); 
      }
    }
  }, [open, isEditMode, defaultValues, reset]);

  const handleFormSubmit: SubmitHandler<DriverFormInputs> = (data) => {
    onSubmit(data);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">
          {isEditMode ? 'Edit Driver' : 'Add New Driver'}
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate sx={{ mt: 2 }}>
          {/* @ts-ignore */}
          <Grid container spacing={2}>
            {/* @ts-ignore */}
            <Grid item xs={12}>
               <TextField
                required
                fullWidth
                label="Full Name"
                {...register("name", { required: "Name is required" })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>
            {/* @ts-ignore */}
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Email Address"
                type="email"
                disabled={isEditMode}
                {...register("email", { required: "Email is required" })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>
            
            {!isEditMode && (
              <>
                {/* @ts-ignore */}
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Password"
                    type="password"
                    {...register("password", { required: "Password is required" })}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                  />
                </Grid>
              </>
            )}
            
            {/* @ts-ignore */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone"
                {...register("phone")}
              />
            </Grid>
            {/* @ts-ignore */}
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="License Number"
                {...register("licenseNumber", { required: "License is required" })}
                error={!!errors.licenseNumber}
                helperText={errors.licenseNumber?.message}
              />
            </Grid>
            
            {isEditMode && (
              <>
                {/* @ts-ignore */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id="status-label">Status</InputLabel>
                    <Controller
                      name="status"
                      control={control}
                      defaultValue="Active" // (قيمة افتراضية)
                      render={({ field }) => (
                        <Select labelId="status-label" {...field}>
                          <MenuItem value="Active">Active</MenuItem>
                          <MenuItem value="On Leave">On Leave</MenuItem>
                          <MenuItem value="Suspended">Suspended</MenuItem>
                        </Select>
                      )}
                    />
                  </FormControl>
                </Grid>

                {/* @ts-ignore */}
                <Grid item xs={12} sm={6}>
                   <FormControl fullWidth>
                    <InputLabel id="availability-label">Availability</InputLabel>
                    <Controller
                      name="availability"
                      control={control}
                      defaultValue="Available" // (قيمة افتراضية)
                      render={({ field }) => (
                        <Select labelId="availability-label" {...field}>
                          <MenuItem value="Available">Available</MenuItem>
                          <MenuItem value="Unavailable">Unavailable</MenuItem>
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
                {loading ? <CircularProgress size={24} /> : (isEditMode ? 'Save Changes' : 'Add Driver')}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Modal>
  );
};

export default DriverFormModal;