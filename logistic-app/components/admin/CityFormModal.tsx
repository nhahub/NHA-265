import React, { useEffect } from 'react';
import { 
  Modal, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';

type CityFormInputs = {
  cityId?: number;
  cityName: string;
  region: string | null;
};

interface CityFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<CityFormInputs>) => Promise<void>;
  defaultValues?: Partial<CityFormInputs> | null;
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

const CityFormModal: React.FC<CityFormModalProps> = ({ 
  open, 
  onClose, 
  onSubmit, 
  defaultValues, 
  isEditMode,
  loading,
  error
}) => {
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CityFormInputs>();

  useEffect(() => {
    if (open) {
      if (isEditMode && defaultValues) {
        reset(defaultValues);
      } else {
        reset({
          cityName: '',
          region: ''
        }); 
      }
    }
  }, [open, isEditMode, defaultValues, reset]);

  const handleFormSubmit: SubmitHandler<CityFormInputs> = (data) => {
    const dataToSubmit = isEditMode ? { ...data, cityId: defaultValues?.cityId } : data;
    onSubmit(dataToSubmit);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">
          {isEditMode ? 'Edit City' : 'Add New City'}
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate sx={{ mt: 2 }}>
          {/* @ts-ignore */}
          <Grid container spacing={2}>
            {/* @ts-ignore */}
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="City Name"
                autoFocus
                {...register("cityName", { required: "City name is required" })}
                error={!!errors.cityName}
                helperText={errors.cityName?.message}
              />
            </Grid>

            {/* @ts-ignore */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Region (Optional)"
                {...register("region")}
              />
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
                {loading ? <CircularProgress size={24} /> : (isEditMode ? 'Save Changes' : 'Add City')}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Modal>
  );
};

export default CityFormModal;