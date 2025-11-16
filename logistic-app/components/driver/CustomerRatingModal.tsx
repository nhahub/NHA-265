import React, { useState } from 'react';
import { 
  Modal, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Grid,
  CircularProgress,
  Alert,
  Rating
} from '@mui/material';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';

type RatingFormInputs = {
  ratingValue: number | null;
  comments: string;
};

interface CustomerRatingModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: RatingFormInputs) => Promise<void>;
  customerId: number;
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

const CustomerRatingModal: React.FC<CustomerRatingModalProps> = ({ 
  open, 
  onClose, 
  onSubmit, 
  customerId,
  loading,
  error
}) => {
  
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<RatingFormInputs>({
    defaultValues: { ratingValue: 3, comments: '' }
  });

  const handleFormSubmit: SubmitHandler<RatingFormInputs> = (data) => {
    onSubmit(data);
    reset();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">
          Rate Customer (ID: {customerId})
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate sx={{ mt: 2 }}>
          {/* @ts-ignore */}
          <Grid container spacing={2}>
            
            {/* @ts-ignore */}
            <Grid item xs={12}>
              <Typography component="legend">Rating</Typography>
              <Controller
                name="ratingValue"
                control={control}
                render={({ field }) => (
                  <Rating
                    {...field}
                    onChange={(event, newValue) => field.onChange(newValue)}
                  />
                )}
              />
            </Grid>

            {/* @ts-ignore */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Comments (Optional)"
                {...register("comments")}
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
                {loading ? <CircularProgress size={24} /> : 'Submit Rating'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Modal>
  );
};

export default CustomerRatingModal;