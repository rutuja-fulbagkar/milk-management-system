import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Autocomplete, Box, Button, Card, Container, MenuItem, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { FormProvider, useForm, Controller } from 'react-hook-form';
import { Link as RouterLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { createwarehouse, editwarehouse, geteditwarehousebyId, findUserWithoutPagination, findAllComapny } from '../../../redux/slices/warehouse/warehouseApi';
import { useDispatch } from '../../../redux/store';
import ResponsivePaperWrapper from '../../../components/table/ResponsivePaperWrapper';

const validationSchema = Yup.object().shape({
  name: Yup.string().trim().required('Name is required'),
  code: Yup.string().trim().required('Code is required'),
  location: Yup.string().trim().required('Location is required'),
  supervisor: Yup.object({
    _id: Yup.string().required('Supervisor is required'),
    firstName: Yup.string().required(),
  }).required('Supervisor is required'),
  status: Yup.string().required('Status is required'),
});

const Index = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const isAddMode = !params?.id;
  const theme = useTheme();
  const location = useLocation();
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [UserData, setUserData] = useState([]);
  const [companyData, setCompanyData] = useState([]);

  const fetchData = useCallback(async () => {
    if (!isAddMode && params.id) {
      const res = await dispatch(geteditwarehousebyId(params.id));
      if (res.payload.success) {
        setEditData(res.payload.data);
      }
    }
    setLoading(false);
  }, [dispatch, isAddMode, params.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchfindUserWithoutPagination = useCallback(async () => {
    const response = await dispatch(findUserWithoutPagination());
    if (response.payload.success) {
      setUserData(response.payload.data);
    }
  }, [dispatch]);

  const fetchfindAllComapny = useCallback(async () => {
    const response = await dispatch(findAllComapny());
    if (response.payload.data) {
      setCompanyData(response.payload.data);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchfindUserWithoutPagination();
    fetchfindAllComapny();
  }, [fetchfindUserWithoutPagination, fetchfindAllComapny]);

  const defaultValues = useMemo(() => ({
    name: editData?.name ?? '',
    code: editData?.code ?? '',
    location: editData?.location ?? '',
    supervisor: editData?.supervisor || null,
    status: editData?.status ?? 'Active',
  }), [editData]);

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
    mode: "onTouched"
  });

  const { reset, handleSubmit, control, formState: { isSubmitting, errors } } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const onSubmit = useCallback(async (data) => {
    const payload = {
      ...data,
      supervisor: data.supervisor?._id,
    };

    if (!isAddMode) {
      await dispatch(editwarehouse({ paramsId: params?.id, data: payload }));
      reset();
      navigate('/warehouse');
    } else {
      const res = await dispatch(createwarehouse(payload));
      if (res.payload.success) {
        reset();
        navigate('/warehouse');
      }
    }
  }, [dispatch, isAddMode, navigate, params.id, reset]);

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
                {isAddMode ? 'Create' : 'Update'} Warehouse
              </h1>
            </Box>
          </Box>
        </ResponsivePaperWrapper>
      </Container>

      <Container maxWidth="2xl" sx={{ minHeight: '100vh' }}>
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
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Warehouse Name"
                      error={!!errors?.name}
                      helperText={errors?.name?.message}
                      fullWidth
                    />
                  )}
                />
                <Controller
                  name="code"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Warehouse Code"
                      error={!!errors?.code}
                      helperText={errors?.code?.message}
                      fullWidth
                      disabled={!isAddMode}
                    />
                  )}
                />
                <Controller
                  name="location"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Location"
                      error={!!errors?.location}
                      helperText={errors?.location?.message}
                      fullWidth
                    />
                  )}
                />
                <Controller
                  name="supervisor"
                  control={control}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <Autocomplete
                      options={UserData}
                      getOptionLabel={(option) => option?.firstName || ''}
                      isOptionEqualToValue={(option, value) => option._id === value._id}
                      value={value}
                      onChange={(_, newValue) => onChange(newValue)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Supervisor"
                          error={!!error}
                          helperText={error?.message}
                          fullWidth
                        />
                      )}
                    />
                  )}
                />
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Status"
                      error={!!errors?.status}
                      helperText={errors?.status?.message}
                      fullWidth
                    >
                      <MenuItem value="Active">Active</MenuItem>
                      <MenuItem value="Inactive">Inactive</MenuItem>
                    </TextField>
                  )}
                />
              </Box>
              <Box display="flex" justifyContent="flex-end" alignItems="center" mt={5}>
                <Button
                  component={RouterLink}
                  to="/warehouse"
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

export default React.memo(Index);
