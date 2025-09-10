import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Container, Stack, TextField } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { FormProvider, useForm, Controller } from 'react-hook-form';
import * as Yup from 'yup';
import { inventorysetting, getInventorySetting } from '../../../redux/slices/inventory/inventoryApi';
import { useDispatch } from 'react-redux';

const FALLBACKS = {
  itemPrefix: '',
  itemNumberSeprator: '#',
  itemNumberDigits: 0,
  inwardRequestPrefix: '',
  inwardRequestNumberSeprator: '#',
  inwardRequestDigits: 0,
  outwardRequestPrefix: '',
  outwardRequestNumberSeprator: '#',
  outwardRequestDigits: 0,
};

function computeExample(prefix, separator, digits) {
  return (prefix || '') + (separator || '') + String(1).padStart(Number(digits || 1), '0');
}

function getSafeSettings(apiRes) {
  return {
    itemPrefix: apiRes?.itemPrefix ?? '',
    itemNumberSeprator: apiRes?.itemNumberSeprator ?? '#',
    itemNumberDigits: Number(apiRes?.itemNumberDigits ?? 1),
    itemNumberExample: computeExample(
      apiRes?.itemPrefix,
      apiRes?.itemNumberSeprator,
      apiRes?.itemNumberDigits
    ),
    inwardRequestPrefix: apiRes?.inwardRequestPrefix ?? '',
    inwardRequestNumberSeprator: apiRes?.inwardRequestNumberSeprator ?? '#',
    inwardRequestDigits: Number(apiRes?.inwardRequestDigits ?? 1),
    inwardRequestNumberExample: computeExample(
      apiRes?.inwardRequestPrefix,
      apiRes?.inwardRequestNumberSeprator,
      apiRes?.inwardRequestDigits
    ),
    outwardRequestPrefix: apiRes?.outwardRequestPrefix ?? '',
    outwardRequestNumberSeprator: apiRes?.outwardRequestNumberSeprator ?? '#',
    outwardRequestDigits: Number(apiRes?.outwardRequestDigits ?? 1),
    outwardRequestNumberExample: computeExample(
      apiRes?.outwardRequestPrefix,
      apiRes?.outwardRequestNumberSeprator,
      apiRes?.outwardRequestDigits
    ),
  };
}

const FormSchema = Yup.object().shape({
  itemPrefix: Yup.string()
    .trim()
    .required('Required')
    .test('not-only-spaces', 'Cannot be only spaces', val => val.trim() !== ''),
  itemNumberSeprator: Yup.string().trim().required('Required'),
  itemNumberDigits: Yup.number()
    .typeError('Must be a number')
    .required('Required')
    .integer('Must be an integer')
    .min(1, 'Minimum 1 digit')
    .max(10, 'Maximum 10 digits'),
  inwardRequestPrefix: Yup.string()
    .trim()
    .required('Required')
    .test('not-only-spaces', 'Cannot be only spaces', val => val.trim() !== ''),
  inwardRequestNumberSeprator: Yup.string().trim().required('Required'),
  inwardRequestDigits: Yup.number()
    .typeError('Must be a number')
    .required('Required')
    .integer('Must be an integer')
    .min(1, 'Minimum 1 digit')
    .max(10, 'Maximum 10 digits'),
  outwardRequestPrefix: Yup.string()
    .trim()
    .required('Required')
    .test('not-only-spaces', 'Cannot be only spaces', val => val.trim() !== ''),
  outwardRequestNumberSeprator: Yup.string().trim().required('Required'),
  outwardRequestDigits: Yup.number()
    .typeError('Must be a number')
    .required('Required')
    .integer('Must be an integer')
    .min(1, 'Minimum 1 digit')
    .max(10, 'Maximum 10 digits'),
});

const ItemIdForm = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [initialValues, setInitialValues] = useState(FALLBACKS);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await dispatch(getInventorySetting());
        const apiData = res?.payload ?? res?.data ?? res;
        setInitialValues(getSafeSettings(apiData));
      } catch (e) {
        setInitialValues(FALLBACKS);
      }
    };
    fetchSettings();
  }, [dispatch]);

  const defaultValues = useMemo(() => ({
    ...initialValues,
    itemNumberExample: '',
    inwardRequestNumberExample: '',
    outwardRequestNumberExample: '',
  }), [initialValues]);

  const methods = useForm({
    resolver: yupResolver(FormSchema),
    defaultValues,
    mode: 'onBlur',
  });

  const { handleSubmit, watch, setValue, control, reset, formState: { isSubmitting, errors } } = methods;
  const values = watch();

  useEffect(() => {
    reset({
      ...initialValues,
      itemNumberExample: '',
      inwardRequestNumberExample: '',
      outwardRequestNumberExample: '',
    });
  }, [initialValues, reset]);

  useEffect(() => {
    setValue(
      'itemNumberExample',
      computeExample(values.itemPrefix, values.itemNumberSeprator, values.itemNumberDigits)
    );
  }, [values.itemPrefix, values.itemNumberSeprator, values.itemNumberDigits, setValue]);

  useEffect(() => {
    setValue(
      'inwardRequestNumberExample',
      computeExample(values.inwardRequestPrefix, values.inwardRequestNumberSeprator, values.inwardRequestDigits)
    );
  }, [values.inwardRequestPrefix, values.inwardRequestNumberSeprator, values.inwardRequestDigits, setValue]);

  useEffect(() => {
    setValue(
      'outwardRequestNumberExample',
      computeExample(values.outwardRequestPrefix, values.outwardRequestNumberSeprator, values.outwardRequestDigits)
    );
  }, [values.outwardRequestPrefix, values.outwardRequestNumberSeprator, values.outwardRequestDigits, setValue]);

 
  const onSubmit = async (data) => {
    try {
      const response = await dispatch(inventorysetting(data));
      if (response) {
        const res = await dispatch(getInventorySetting());
        const apiData = res?.payload ?? res?.data ?? res;
        const updatedValues = getSafeSettings(apiData);

        reset({
          ...updatedValues,
          itemNumberExample: computeExample(updatedValues.itemPrefix, updatedValues.itemNumberSeprator, updatedValues.itemNumberDigits),
          inwardRequestNumberExample: computeExample(updatedValues.inwardRequestPrefix, updatedValues.inwardRequestNumberSeprator, updatedValues.inwardRequestDigits),
          outwardRequestNumberExample: computeExample(updatedValues.outwardRequestPrefix, updatedValues.outwardRequestNumberSeprator, updatedValues.outwardRequestDigits),
        });
      }
    } catch (error) {
      console.error('Error occurred: ' + (error?.message || 'Unknown error'));
    }
  };

  return (
    <Container maxWidth="2xl">
      <Card sx={{ p: 3, background: theme.palette.background.default, my: 4 }}>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* <Box display="grid" rowGap={3} columnGap={2} gridTemplateColumns="repeat(4, 1fr)" 
            sx={{ display: 'flex', gap: 2, mt: 2, flexDirection: { xs: 'column', sm: 'column' , md:'row'} }}> */}
            <Box
              sx={{
                display: {
                  xs: 'flex',     
                  sm: 'flex',
                  md: 'grid',    
                },
                flexDirection: {
                  xs: 'column',  
                  sm: 'column',
                  md: 'row',     
                },
                gap: 2,  
                gridTemplateColumns: {
                  md: 'repeat(4, 1fr)',  
                },
                rowGap: {
                  md: 3,
                },
                columnGap: {
                  md: 2,
                },
                mt: 2,
              }}
            >
              {/* Item */}
              <Controller name="itemPrefix" control={control} render={({ field }) =>
                <TextField {...field} label="Item Prefix *" error={!!errors.itemPrefix} helperText={errors.itemPrefix?.message} />
              } />
              <Controller name="itemNumberSeprator" control={control} render={({ field }) =>
                <TextField {...field} label="Item Number Separator *" error={!!errors.itemNumberSeprator} helperText={errors.itemNumberSeprator?.message} />
              } />
              <Controller name="itemNumberDigits" control={control} render={({ field }) =>
                <TextField {...field} label="Item Number Digits *" type="number" error={!!errors.itemNumberDigits} helperText={errors.itemNumberDigits?.message} />
              } />
              <Controller name="itemNumberExample" control={control} render={({ field }) =>
                <TextField {...field} label="Item Number Example" disabled />
              } />

              {/* Inward Request */}
              <Controller name="inwardRequestPrefix" control={control} render={({ field }) =>
                <TextField {...field} label="Inward Request Prefix *" error={!!errors.inwardRequestPrefix} helperText={errors.inwardRequestPrefix?.message} />
              } />
              <Controller name="inwardRequestNumberSeprator" control={control} render={({ field }) =>
                <TextField {...field} label="Inward Request Number Separator *" error={!!errors.inwardRequestNumberSeprator} helperText={errors.inwardRequestNumberSeprator?.message} />
              } />
              <Controller name="inwardRequestDigits" control={control} render={({ field }) =>
                <TextField {...field} label="Inward Request Number Digits *" type="number" error={!!errors.inwardRequestDigits} helperText={errors.inwardRequestDigits?.message} />
              } />
              <Controller name="inwardRequestNumberExample" control={control} render={({ field }) =>
                <TextField {...field} label="Inward Request Number Example" disabled />
              } />

              {/* Outward Request */}
              <Controller name="outwardRequestPrefix" control={control} render={({ field }) =>
                <TextField {...field} label="Outward Request Prefix *" error={!!errors.outwardRequestPrefix} helperText={errors.outwardRequestPrefix?.message} />
              } />
              <Controller name="outwardRequestNumberSeprator" control={control} render={({ field }) =>
                <TextField {...field} label="Outward Request Number Separator *" error={!!errors.outwardRequestNumberSeprator} helperText={errors.outwardRequestNumberSeprator?.message} />
              } />
              <Controller name="outwardRequestDigits" control={control} render={({ field }) =>
                <TextField {...field} label="Outward Request Number Digits *" type="number" error={!!errors.outwardRequestDigits} helperText={errors.outwardRequestDigits?.message} />
              } />
              <Controller name="outwardRequestNumberExample" control={control} render={({ field }) =>
                <TextField {...field} label="Outward Request Number Example" disabled />
              } />
            </Box>
            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>Save</LoadingButton>
            </Stack>
          </form>
        </FormProvider>
      </Card>
    </Container>
  );
};

export default ItemIdForm;
