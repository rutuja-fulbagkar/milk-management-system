import { yupResolver } from '@hookform/resolvers/yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { LoadingButton } from '@mui/lab';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Container,
  IconButton,
  TextField,
  Typography
} from '@mui/material';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import ResponsivePaperWrapper from '../../../components/table/ResponsivePaperWrapper';
import { findcategoriesWithoutPagination } from '../../../redux/slices/categories/categoriesApi';
import { createInventory, editInventory, getInventorybyId, getInventorySetting } from '../../../redux/slices/inventory/inventoryApi';
import { findWarehouseWithoutPagination } from '../../../redux/slices/warehouse/warehouseApi';
import { useDispatch } from '../../../redux/store';

const validationSchema = Yup.object().shape({
  itemId: Yup.string().trim('Item ID cannot be just spaces').required('Item ID is required'),
  itemName: Yup.string().trim('Item Name cannot be just spaces').required('Item Name is required'),
  itemCode: Yup.string().trim('Item Code / SKU cannot be just spaces').required('Item Code / SKU is required'),
  category: Yup.string().trim('Category cannot be just spaces').required('Category is required'),
  unitType: Yup.string().trim('Unit of Measurement cannot be just spaces').required('Unit of Measurement is required'),
  openingStock: Yup.number()
    .transform((value, originalValue) => String(originalValue).trim() === '' ? undefined : value)
    .typeError('Opening Stock must be a number')
    .min(1, 'Opening Stock must be 1 or greater')
    .integer('Opening Stock must be an integer')
    .required('Opening Stock is required'),
  minStock: Yup.number()
    .transform((value, originalValue) => String(originalValue).trim() === '' ? undefined : value)
    .typeError('Reorder Level must be a number')
    .min(1, 'Reorder Level must be 1 or greater')
    .integer('Reorder Level must be an integer')
    .test('reorder-validation', 'Reorder Level should not exceed Opening Stock', function (value) {
      const { openingStock } = this.parent;
      if (openingStock !== undefined && value > openingStock) {
        return this.createError({ message: 'Reorder Level cannot be greater than Opening Stock' });
      }
      return true;
    })
    .required('Reorder Level is required'),
  warehouseId: Yup.string().trim('Warehouse cannot be just spaces').required('Warehouse is required'),
  description: Yup.string().trim('Description cannot be just spaces'),
  status: Yup.string().trim('Status cannot be just spaces').required('Status is required')
});

const Index = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const isAddMode = !params.id;

  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState(null);
  const [warehouseIdList, setWarehouseIdList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [itemPrefix, setItemPrefix] = useState([]);

  const fetchData = useCallback(async () => {
    if (!isAddMode && params.id) {
      const res = await dispatch(getInventorybyId(params.id));
      if (res.payload.success) setEditData(res.payload.data);
    }
    setLoading(false);
  }, [dispatch, isAddMode, params.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchWarehouseIds = useCallback(async () => {
    try {
      const response = await dispatch(findWarehouseWithoutPagination());
      setWarehouseIdList(response.payload.data || []);
    } catch (error) {
      console.error("Failed to fetch storage stock locations:", error);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchWarehouseIds();
  }, [fetchWarehouseIds]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await dispatch(findcategoriesWithoutPagination());
      setCategoryList(response.payload.data || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const fetchInventorySettings = useCallback(async () => {
    const res = await dispatch(getInventorySetting());
    if (res?.payload) {
      setItemPrefix(res?.payload);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchInventorySettings();
  }, [fetchInventorySettings]);

  const defaultValues = useMemo(() => ({
    itemPrefix: '',
    itemId: editData?.itemId || (itemPrefix?.itemCount ? itemPrefix.itemCount + 1 : 1),
    itemName: editData?.itemName || '',
    itemCode: editData?.itemCode || '',
    category: editData?.category?._id || '',
    unitType: editData?.unitType || '',
    openingStock: editData?.openingStock || 0,
    minStock: editData?.minStock || 0,
    warehouseId: editData?.warehouseId?._id || '',
    description: editData?.description || '',
    status: editData?.status || ''
  }), [editData, itemPrefix]);

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
    mode: 'onTouched'
  });

  const { handleSubmit, reset, control, watch, setValue, formState: { isSubmitting, errors } } = methods;

  const openingStock = watch('openingStock');
  const closingStock = openingStock || 0;

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  useEffect(() => {
    if (itemPrefix?.itemPrefix && itemPrefix?.itemNumberSeprator && itemPrefix?.itemNumberDigits) {
      const newId = itemPrefix?.itemCount + 1;
      const paddedPrefix =
        `${itemPrefix.itemPrefix}${itemPrefix.itemNumberSeprator}` +
        `${'0'.repeat(Math.max(0, Number(itemPrefix.itemNumberDigits) - newId.toString().length))}`;
      setValue('itemPrefix', paddedPrefix, { shouldValidate: true });
      setValue('itemId', editData ? editData?.itemId : newId, { shouldValidate: true });
    }
  }, [setValue, itemPrefix, editData]);

  const onSubmit = async (data) => {
    const submitData = {
      ...data,
      closingStock: closingStock
    };

    if (isAddMode) {
      const res = await dispatch(createInventory(submitData));
      if (res.payload.success) {
        reset();
        navigate('/inventory');
      }
    } else {
      const res = await dispatch(editInventory({ id: params.id, data: submitData }));
      if (res.payload.success) {
        reset();
        navigate('/inventory');
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  const uomOptions = [
    { value: 'Kg', label: 'Kg (Kilogram)' },
    { value: 'Ltr', label: 'Ltr (Liter)' },
    { value: 'Pcs', label: 'Pcs (Piece)' },
    { value: 'Nos', label: 'Nos (Numbers/Units)' },
  ];

  const statusOptions = isAddMode
    ? [{ value: 'In Stock', label: 'In Stock' }]
    : [
      { value: 'In Stock', label: 'In Stock' },
      { value: 'Out of Stock', label: 'Out of Stock' },
      { value: 'Low Stock', label: 'Low Stock' }
    ];

  return (
    <>
      <Container maxWidth="2xl">
        <ResponsivePaperWrapper>
          <Box className="w-full py-4 px-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <Box className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
              <Typography variant="h5" fontWeight="bold">
                {isAddMode ? "Add" : "Update"} Inventory
              </Typography>
              <IconButton onClick={() => navigate("/inventory")}>
                <ArrowBackIcon />
              </IconButton>
            </Box>
          </Box>
        </ResponsivePaperWrapper>
      </Container>

      <Container maxWidth="2xl" sx={{ minHeight: '100vh' }}>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Card sx={{ p: 3, mt: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                Inventory Details
              </Typography>

              <Box
                sx={{
                  display: 'grid',
                  gap: 3,
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)'
                  }
                }}
              >
                <Box className="flex">
                  <Box className="w-[35%]">
                    <Controller
                      name="itemPrefix"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          InputLabelProps={{ shrink: true }}
                          value={field.value ?? ''}
                          disabled
                          fullWidth
                        />
                      )}
                    />
                  </Box>
                  <Box className="w-[85%]">
                    <Controller
                      name="itemId"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          disabled
                          InputLabelProps={{ shrink: true }}
                          value={field.value ?? ''}
                          label="Item Id"
                          fullWidth
                        />
                      )}
                    />
                  </Box>
                </Box>

                <Controller
                  name="itemName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Item Name"
                      error={!!errors.itemName}
                      helperText={errors.itemName?.message}
                      fullWidth
                    />
                  )}
                />

                <Controller
                  name="itemCode"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Item Code / SKU"
                      error={!!errors.itemCode}
                      helperText={errors.itemCode?.message}
                      fullWidth
                    />
                  )}
                />


                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={categoryList}
                      getOptionLabel={(option) => option?.categoryName || '-'}
                      isOptionEqualToValue={(option, value) => option._id === value}
                      value={categoryList.find(category => category._id === field.value) || null}
                      onChange={(_, selectedOption) => {
                        field.onChange(selectedOption ? selectedOption._id : '');
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Category"
                          error={!!errors.category}
                          helperText={errors.category?.message}
                        />
                      )}
                      fullWidth
                      disableClearable
                    />
                  )}
                />



                <Controller
                  name="unitType"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={uomOptions}
                      getOptionLabel={(option) => option.label || ''}
                      isOptionEqualToValue={(option, value) => option.value === value}
                      value={uomOptions.find(option => option.value === field.value) || null}
                      onChange={(_, selectedOption) => {
                        field.onChange(selectedOption ? selectedOption.value : '');
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select UOM (Units of Measurement)"
                          error={!!errors.unitType}
                          helperText={errors.unitType?.message}
                        />
                      )}
                      fullWidth
                      disableClearable
                    />
                  )}
                />
                <Controller
                  name="openingStock"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Opening Stock Qty"
                      type="number"
                      inputProps={{ min: 0, step: 0.01 }}
                      error={!!errors.openingStock}
                      helperText={errors.openingStock?.message || "Daily Opening Stock will be closing Stock of Previous Day"}
                      fullWidth
                    />
                  )}
                />

                <Controller
                  name="minStock"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Reorder Level (Minimum Stock Qty)"
                      type="number"
                      inputProps={{ min: 0, step: 0.01 }}
                      error={!!errors.minStock}
                      helperText={errors.minStock?.message}
                      fullWidth
                    />
                  )}
                />

                <Controller
                  name="warehouseId"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={warehouseIdList}
                      getOptionLabel={(option) => option?.location || ''}
                      isOptionEqualToValue={(option, value) => option._id === value}
                      value={warehouseIdList.find(location => location._id === field.value) || null}
                      onChange={(_, selectedOption) => {
                        field.onChange(selectedOption ? selectedOption._id : '');
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Location / Warehouse"
                          error={!!errors.warehouseId}
                          helperText={errors.warehouseId?.message}
                        />
                      )}
                      fullWidth
                      disableClearable
                    />
                  )}
                />

                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={statusOptions}
                      getOptionLabel={(option) => option.label || ''}
                      isOptionEqualToValue={(option, value) => option.value === value}
                      value={statusOptions.find(option => option.value === field.value) || null}
                      onChange={(_, selectedOption) => {
                        field.onChange(selectedOption ? selectedOption.value : '');
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Status"
                          error={!!errors.status}
                          helperText={errors.status?.message}
                        />
                      )}
                      fullWidth
                      disableClearable
                    />
                  )}
                />
              </Box>

              <Box sx={{ mt: 3 }}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Description"
                      multiline
                      rows={4}
                      error={!!errors.description}
                      helperText={errors.description?.message}
                      fullWidth
                    />
                  )}
                />
              </Box>

              <Box sx={{ mt: 3 }}>
                <TextField
                  label="Closing Stock (Auto Calculated)"
                  value={closingStock}
                  InputProps={{
                    readOnly: true,
                  }}
                  variant="outlined"
                  fullWidth
                  sx={{
                    '& .MuiInputBase-input': {
                      backgroundColor: '#f5f5f5'
                    }
                  }}
                />
              </Box>

              <Box display="flex" justifyContent="flex-end" mt={4} gap={2}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/inventory')}
                  size="large"
                >
                  Cancel
                </Button>
                <LoadingButton  
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                  size="large"
                >
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
