import { yupResolver } from '@hookform/resolvers/yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { LoadingButton } from '@mui/lab';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Container,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { Controller, FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import Iconify from '../../../../components/iconify';
import ResponsivePaperWrapper from '../../../../components/table/ResponsivePaperWrapper';
import { findcategoriesWithoutPagination } from '../../../../redux/slices/categories/categoriesApi';
import { findAllInventory, getInventorySetting } from '../../../../redux/slices/inventory/inventoryApi';
import { createInward, editInwardStatus, getInwardbyId } from '../../../../redux/slices/inward/inwardApi';
import { findWarehouseWithoutPagination } from '../../../../redux/slices/warehouse/warehouseApi';
import { useDispatch } from '../../../../redux/store';

const validationSchema = Yup.object().shape({
  requestId: Yup.string().required('Request ID is required'),
  inWardQtyDate: Yup.date().required('Inward Quantity Date is required').typeError('Invalid date format'),
  warehouseId: Yup.string().required('Warehouse ID is required'),
  items: Yup.array().of(
    Yup.object().shape({
      itemId: Yup.string().required('Item Name is required'),
      itemCode: Yup.string().required('Item Code / SKU is required'),
      category: Yup.string().required('Category is required'),
      unitType: Yup.string().required('Unit of Measurement is required'),
      quantity: Yup.number()
        .min(1, 'Quantity cannot be less than 1')
        .required('Quantity is required'),
    })
  ).required('At least one item is required')
});

const Inward = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const isAddMode = !params.id;
  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState(null);
  const [warehouseIdList, setWarehouseIdList] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [inwardPrefix, setInwardPrefix] = useState([]);
  const [selectedItemIds, setSelectedItemIds] = useState([]);

  const fetchData = useCallback(async () => {
    if (!isAddMode && params.id) {
      const res = await dispatch(getInwardbyId(params.id));
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

  const fetchAllInventory = useCallback(async () => {
    try {
      const response = await dispatch(findAllInventory());
      setItemList(response.payload.data || []);
    } catch (error) {
      console.error("Failed to fetch storage stock locations:", error);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchAllInventory();
  }, [fetchAllInventory]);

  const fetchInventorySettings = useCallback(async () => {
    const res = await dispatch(getInventorySetting());
    if (res) {
      setInwardPrefix(res?.payload);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchInventorySettings();
  }, [fetchInventorySettings]);

  const defaultValues = useMemo(() => ({
    requestId: editData?.requestId || (inwardPrefix?.requestCount ?? 0) + 1,
    inWardQtyDate: editData?.requestedDate ? new Date(editData.requestedDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    items: editData?.items?.length ? editData.items.map(item => ({
      itemId: item?.itemId?._id || '',
      itemCode: item?.itemCode || '',
      category: item?.category?._id || '',
      unitType: item?.unitType || '',
      quantity: item?.quantity || 1
    })) : [{ itemId: '', itemCode: '', category: '', unitType: '', quantity: 1 }],
    warehouseId: editData?.warehouseId?._id || ''
  }), [editData, inwardPrefix]);

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
    mode: 'onTouched'
  });

  const { handleSubmit, reset, control, watch, setValue, formState: { isSubmitting, errors } } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await dispatch(findcategoriesWithoutPagination());
        setCategoryList(response.payload.data || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, [dispatch]);

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const handleItemChange = useCallback((index, selectedItemId) => {
    setSelectedItemIds(prev => {
      const updated = [...prev];
      updated[index] = selectedItemId;
      return updated;
    });
  }, []);

  useEffect(() => {
    if (inwardPrefix?.inwardRequestPrefix && inwardPrefix?.inwardRequestNumberSeprator && inwardPrefix?.inwardRequestDigits) {
      const newId = inwardPrefix?.requestCount + 1;

      const paddedPrefix =
        `${inwardPrefix.inwardRequestPrefix}${inwardPrefix.inwardRequestNumberSeprator}` +
        `${'0'.repeat(
          Math.max(0, Number(inwardPrefix.inwardRequestDigits) - newId.toString().length)
        )}`;

      setValue('inwardPrefix', paddedPrefix, { shouldValidate: true });
      setValue('requestId', editData ? editData?.requestId : newId, { shouldValidate: true });
    }
  }, [
    setValue,
    inwardPrefix?.inwardRequestPrefix,
    inwardPrefix?.inwardRequestNumberSeprator,
    inwardPrefix?.inwardRequestDigits,
    inwardPrefix?.requestCount,
    editData
  ]);

  const onSubmit = async (data) => {
    const submitData = {
      ...data,
      inwardPrefix: data.inwardPrefix,
      items: data.items.map(({ warehouseId, ...item }) => item),
      inWardQtyDate: data.inWardQtyDate ? new Date(data.inWardQtyDate).toISOString() : null,
    };
    const updateData = {
      items: data.items.map(({ warehouseId, ...item }) => item),
      inWardQtyDate: data.inWardQtyDate ? new Date(data.inWardQtyDate).toISOString() : null,
    };

    if (isAddMode) {
      const res = await dispatch(createInward(submitData));
      if (res.payload.success) {
        reset();
        navigate('/inward-outward-request?tab=inward');
      }
    } else {
      const res = await dispatch(editInwardStatus({ paramsId: params.id, data: updateData }));
      if (res.payload.success) {
        reset();
        navigate('/inward-outward-request?tab=inward');
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Container maxWidth="2xl">
      <ResponsivePaperWrapper>
        <Box className="w-full py-4 px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <Typography variant="h5" fontWeight="bold">
            {isAddMode ? "Add" : "Update"} Inward Request
          </Typography>
          <IconButton onClick={() => navigate("/inward-outward-request?tab=inward")}>
            <ArrowBackIcon />
          </IconButton>
        </Box>
      </ResponsivePaperWrapper>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Card sx={{ p: 3, mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box className="flex">
                  <Box className="w-[35%]">
                    <Controller
                      name="inwardPrefix"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          InputLabelProps={{ shrink: true }}
                          disabled
                          fullWidth
                        />
                      )}
                    />
                  </Box>
                  <Box className="w-[85%]">
                    <Controller
                      name="requestId"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          disabled
                          InputLabelProps={{ shrink: true }}
                          label="Inward Request ID"
                          fullWidth
                        />
                      )}
                    />
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="inWardQtyDate"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Date of Inward Request"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.inWardQtyDate}
                      helperText={errors.inWardQtyDate?.message}
                      disabled={!isAddMode}
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Typography variant="h6" sx={{ mt: 4 }}>Item Details</Typography>
            {fields.map((item, index) => (
              <Box key={item.id} sx={{ display: 'flex', gap: 2, mt: 2, flexDirection: { xs: 'column', sm: 'column', md: 'row' } }}>

                <Controller
                  name={`items.${index}.itemId`}
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={itemList.filter(item => !selectedItemIds.includes(item._id) || item._id === field.value)}
                      getOptionLabel={(option) => option?.itemName || ''}
                      isOptionEqualToValue={(option, value) => option._id === value}
                      value={itemList.find(item => item._id === field.value) || null}
                      onChange={(_, selectedOption) => {
                        const selectedItemId = selectedOption ? selectedOption._id : '';
                        handleItemChange(index, selectedItemId);
                        const selectedItem = itemList.find(item => item._id === selectedItemId);

                        if (selectedItem) {
                          methods.setValue(`items.${index}.itemCode`, selectedItem.itemCode);
                          methods.setValue(
                            `items.${index}.category`,
                            selectedItem.category?._id || selectedItem.category || ''
                          );
                          methods.setValue(`items.${index}.unitType`, selectedItem.unitType);
                        } else {
                          methods.setValue(`items.${index}.itemCode`, '');
                          methods.setValue(`items.${index}.category`, '');
                          methods.setValue(`items.${index}.unitType`, '');
                        }
                        field.onChange(selectedItemId);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Item Name"
                          error={!!errors.items?.[index]?.itemId}
                          helperText={errors.items?.[index]?.itemId?.message}
                        />
                      )}
                      fullWidth
                      disableClearable
                    />
                  )}
                />


                <Controller
                  name={`items.${index}.itemCode`}
                  control={control}
                  render={({ field }) => (

                    <TextField
                      {...field}
                      label="Code/SKU"
                      placeholder=""
                      error={!!errors.items?.[index]?.itemCode}
                      helperText={errors.items?.[index]?.itemCode?.message}
                      fullWidth
                      disabled

                    />
                  )}
                />

                <Controller
                  name={`items.${index}.category`}
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.items?.[index]?.category}>
                      <InputLabel id={`category-label-${index}`} shrink>Category</InputLabel>
                      <Select
                        {...field}
                        labelId={`category-label-${index}`}
                        label="Category"
                        displayEmpty
                        disabled
                      >
                        <MenuItem value="">
                          <em>  Category</em>
                        </MenuItem>
                        {categoryList.map((category) => (
                          <MenuItem key={category._id} value={category._id}>
                            {category.categoryName || '-'}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.items?.[index]?.category && (
                        <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                          {errors.items[index].category.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />

                <Controller
                  name={`items.${index}.unitType`}
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.items?.[index]?.unitType}>
                      <InputLabel id={`unit-type-label-${index}`} shrink>Select UOM</InputLabel>
                      <Select
                        {...field}
                        labelId={`unit-type-label-${index}`}
                        label="Select UOM"
                        displayEmpty
                        disabled
                      >
                        <MenuItem value="">
                          <em>Unit of Measurement </em>
                        </MenuItem>
                        <MenuItem value="Kg">Kg</MenuItem>
                        <MenuItem value="Ltr">Liter</MenuItem>
                        <MenuItem value="Pcs">Piece</MenuItem>
                        <MenuItem value="Nos">Nos</MenuItem>
                      </Select>
                      {errors.items?.[index]?.unitType && (
                        <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                          {errors.items[index].unitType.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />

                <Controller
                  name={`items.${index}.quantity`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Qty"
                      type="number"
                      inputProps={{ min: 1 }}
                      error={!!errors.items?.[index]?.quantity}
                      helperText={errors.items?.[index]?.quantity?.message}
                      fullWidth
                      InputLabelProps={{ shrink: true }}  
                    />
                  )}
                />

                <Tooltip title="Remove this item" arrow>
                  <Button
                    color="error"
                    onClick={() => remove(index)}
                    disabled={index === 0}
                  >
                    <Iconify icon="eva:trash-2-outline" />
                  </Button>
                </Tooltip>
              </Box>
            ))}

            <Box pt={2}>
              <Tooltip title="Add another item" arrow>
                <Button onClick={() => append({ itemId: '', itemCode: '', category: '', unitType: '', quantity: 1 })}>
                  <Iconify icon="eva:plus-fill" className="m-2" />Add Another Item
                </Button>
              </Tooltip>
            </Box>

            <Box sx={{ mt: 4 }}>
              <Controller
                name="warehouseId"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={warehouseIdList}
                    getOptionLabel={(option) => option.location || ''}
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
                    disabled={!isAddMode}
                  />
                )}
              />
            </Box>

            <Box display="flex" justifyContent="flex-end" mt={4} gap={2}>
              <Button variant="outlined" onClick={() => navigate('/inward-outward-request?tab=inward')} size="large">
                Cancel
              </Button>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting} size="large">
                Save
              </LoadingButton>
            </Box>
          </Card>
        </form>
      </FormProvider>
    </Container>
  );
};

export default Inward;
