import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Container, Stack, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useEffect, useMemo, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { getStaffSetting, staffsetting } from '../../../redux/slices/user/userApi';

const FALLBACKS = {
  staffPrefix: '',
  staffNumberSeprator: '#',
  staffNumberDigits: 0,
};

function computeExample(prefix, separator, digits) {
  return (prefix || '') + (separator || '') + String(1).padStart(Number(digits || 1), '0');
}

function getSafeSettings(apiRes) {
  return {
    staffPrefix: apiRes?.staffPrefix ?? '',
    staffNumberSeprator: apiRes?.staffNumberSeprator ?? '#',
    staffNumberDigits: Number(apiRes?.staffNumberDigits ?? 1),
    staffNumberExample: computeExample(
      apiRes?.staffPrefix,
      apiRes?.staffNumberSeprator,
      apiRes?.staffNumberDigits
    ),
  };
}

const FormSchema = Yup.object().shape({
  staffPrefix: Yup.string()
    .trim()
    .required('Required')
    .test('not-only-spaces', 'Cannot be only spaces', val => val.trim() !== ''),
  staffNumberSeprator: Yup.string().trim().required('Required'),
  staffNumberDigits: Yup.number()
    .typeError('Must be a number')
    .required('Required')
    .integer('Must be an integer')
    .min(1, 'Minimum 1 digit')
    .max(10, 'Maximum 10 digits'),
});

const StaffIdForm = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [initialValues, setInitialValues] = useState(FALLBACKS);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await dispatch(getStaffSetting());
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
    staffNumberExample: '',
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
      staffNumberExample: '',
      inwardRequestNumberExample: '',
      outwardRequestNumberExample: '',
    });
  }, [initialValues, reset]);

  useEffect(() => {
    setValue(
      'staffNumberExample',
      computeExample(values.staffPrefix, values.staffNumberSeprator, values.staffNumberDigits)
    );
  }, [values.staffPrefix, values.staffNumberSeprator, values.staffNumberDigits, setValue]);

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
    const response = await dispatch(staffsetting(data));
    if (response) {
      const res = await dispatch(getStaffSetting());
      const apiData = res?.payload ?? res?.data ?? res;
      const updatedValues = getSafeSettings(apiData);
      reset({
        ...updatedValues,
        staffNumberExample: computeExample(updatedValues.staffPrefix, updatedValues.staffNumberSeprator, updatedValues.staffNumberDigits),
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
              <Controller name="staffPrefix" control={control} render={({ field }) =>
                <TextField {...field} label="Staff Prefix *" error={!!errors.staffPrefix} helperText={errors.staffPrefix?.message} />
              } />
              <Controller name="staffNumberSeprator" control={control} render={({ field }) =>
                <TextField {...field} label="Staff Number Separator *" error={!!errors.staffNumberSeprator} helperText={errors.staffNumberSeprator?.message} />
              } />
              <Controller name="staffNumberDigits" control={control} render={({ field }) =>
                <TextField {...field} label="Staff Number Digits *" type="number" error={!!errors.staffNumberDigits} helperText={errors.staffNumberDigits?.message} />
              } />
              <Controller name="staffNumberExample" control={control} render={({ field }) =>
                <TextField {...field} label="Staff Number Example" disabled />
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

export default StaffIdForm;
