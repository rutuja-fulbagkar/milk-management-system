import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Card,
  Container,
  MenuItem,
  TextField,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useEffect, useMemo, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import ResponsivePaperWrapper from '../../../../components/table/ResponsivePaperWrapper';
import { createUpdateService, findService } from '../../../../redux/slices/service/serviceApi';
import { useDispatch } from '../../../../redux/store';

const validationSchema = Yup.object().shape({
  scheduleService: Yup.string().required('Schedule Service is required'),
  setReminder: Yup.boolean(),
});

const Index = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const theme = useTheme();
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchServiceData = async () => {
    try {
      const response = await dispatch(findService());
      if (response.payload?.success) {
        setEditData(response.payload.data?.[0] || null);
      }
    } catch (error) {
      console.error('Error fetching service data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceData();
  }, [dispatch]);
  

  const defaultValues = useMemo(() => ({
    scheduleService: editData?.scheduleService ?? 'Monthly',
    setReminder: editData?.setReminder ?? false,
  }), [editData]);

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
    mode: "onTouched"
  });

  const {
    reset,
    handleSubmit,
    control,
    formState: { isSubmitting, errors }
  } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const onSubmit = async (data) => {
    const payload = { id: editData._id, ...data };
    try {
      const res = await dispatch(createUpdateService(payload));
      if (res?.payload?.success) {
          await fetchServiceData(); 
          reset();
        navigate('/setting/service');
      }
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };
  

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Container maxWidth="2xl">
        <ResponsivePaperWrapper>
          <Box className="w-full py-4 px-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <Box className="w-full md:w-auto">
              <h1 className="text-md md:text-2xl text-gray-700 dark:text-gray-100 font-bold">
                Service Setting
              </h1>
            </Box>
          </Box>
        </ResponsivePaperWrapper>
      </Container>

      <Container maxWidth="2xl"  >
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Card sx={{ p: 3, background: theme.palette.background.default }} className="my-[25px]">
              <Box
                sx={{
                  display: 'grid',
                  columnGap: 2,
                  rowGap: 3,
                  gridTemplateColumns: {
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(1, 1fr)',
                    md: 'repeat(2, 1fr)',
                  },
                }}
              >
                <Controller
                  name="scheduleService"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Schedule Service"
                      error={!!errors?.scheduleService}
                      helperText={errors?.scheduleService?.message}
                      fullWidth
                    >
                      <MenuItem value="Monthly">Monthly</MenuItem>
                      <MenuItem value="Quaterly">Quaterly</MenuItem>
                      <MenuItem value="Half-Yearly">Half-Yearly</MenuItem>
                      <MenuItem value="Yearly">Yearly</MenuItem>
                    </TextField>
                  )}
                />

                <Controller
                  name="setReminder"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...field}
                          checked={!!field.value}
                          color="primary"
                        />
                      }
                      label="Set Reminder"
                    />
                  )}
                />
              </Box>
              <Box display="flex" justifyContent="flex-end" alignItems="center" mt={5}>
                <Button
                  component={RouterLink}
                  to="/setting"
                  variant="outlined"
                  color="inherit"
                  sx={{ mr: 2 }}
                >
                  Cancel
                </Button>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  Save
                </LoadingButton>
              </Box>
            </Card>
          </form>
        </FormProvider>
      </Container>
    </>
  );
};

export default Index;
