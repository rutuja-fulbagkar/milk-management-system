import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Container, Stack, TextField } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { FormProvider, useForm, Controller } from 'react-hook-form';
import * as Yup from 'yup';
import { companysetting, getCompanySetting,sitesetting ,getSiteSetting} from '../../../redux/slices/company/companyApi';
import { useDispatch } from 'react-redux';

const FALLBACKS = {
  companyPrefix: '',
  companyNumberSeprator: '#',
  companyNumberDigits: 0,
};

function computeExample(prefix, separator, digits) {
  return (prefix || '') + (separator || '') + String(1).padStart(Number(digits || 1), '0');
}

function getSafeSettings(apiRes) {
  return {
    companyPrefix: apiRes?.companyPrefix ?? '',
    companyNumberSeprator: apiRes?.companyNumberSeprator ?? '#',
    companyNumberDigits: Number(apiRes?.companyNumberDigits ?? 1),
    companyNumberExample: computeExample(
      apiRes?.companyPrefix,
      apiRes?.companyNumberSeprator,
      apiRes?.companyNumberDigits
    ),
  };
}

const FormSchema = Yup.object().shape({
  companyPrefix: Yup.string()
    .trim()
    .required('Required')
    .test('not-only-spaces', 'Cannot be only spaces', val => val.trim() !== ''),
  companyNumberSeprator: Yup.string().trim().required('Required'),
  companyNumberDigits: Yup.number()
    .typeError('Must be a number')
    .required('Required')
    .integer('Must be an integer')
    .min(1, 'Minimum 1 digit')
    .max(10, 'Maximum 10 digits'),
});

const CompanyIdForm = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [initialValues, setInitialValues] = useState(FALLBACKS);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await dispatch(getCompanySetting());
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
    companyNumberExample: '',
    siteNumberExample: '',
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
      companyNumberExample: '',
    });
  }, [initialValues, reset]);

  useEffect(() => {
    setValue(
      'companyNumberExample',
      computeExample(values.companyPrefix, values.companyNumberSeprator, values.companyNumberDigits)
    );
  }, [values.companyPrefix, values.companyNumberSeprator, values.companyNumberDigits, setValue]);

  const onSubmit = async (data) => {
  try {
    const response = await dispatch(companysetting(data));
    if (response) {
      const res = await dispatch(getCompanySetting());
      const apiData = res?.payload ?? res?.data ?? res;
      const updatedValues = getSafeSettings(apiData);
      reset({
        ...updatedValues,
        companyNumberExample: computeExample(updatedValues.companyPrefix, updatedValues.companyNumberSeprator, updatedValues.companyNumberDigits),
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
            {/* <Box display="grid" rowGap={3} columnGap={2} gridTemplateColumns="repeat(4, 1fr)"> */}
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
              <Controller name="companyPrefix" control={control} render={({ field }) =>
                <TextField {...field} label="Company Prefix *" error={!!errors.companyPrefix} helperText={errors.companyPrefix?.message} />
              } />
              <Controller name="companyNumberSeprator" control={control} render={({ field }) =>
                <TextField {...field} label="Company Number Separator *" error={!!errors.companyNumberSeprator} helperText={errors.companyNumberSeprator?.message} />
              } />
              <Controller name="companyNumberDigits" control={control} render={({ field }) =>
                <TextField {...field} label="Company Number Digits *" type="number" error={!!errors.companyNumberDigits} helperText={errors.companyNumberDigits?.message} />
              } />
              <Controller name="companyNumberExample" control={control} render={({ field }) =>
                <TextField {...field} label="Company Number Example" disabled />
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

export default CompanyIdForm;
