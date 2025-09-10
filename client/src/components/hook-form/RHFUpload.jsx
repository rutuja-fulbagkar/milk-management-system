import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { Avatar, FormHelperText } from '@mui/material';
//
import {
  UploadAvatar,
  Upload,
  UploadBox,
  UploadCompanyLogo,
  UploadBackgroundImage,
  UploadRecruitCompanyLogo,
} from '../upload';

// ----------------------------------------------------------------------

RHFUploadAvatar.propTypes = {
  name: PropTypes.string,
  _id: PropTypes.string,
  setValue: PropTypes.func,
  BASEURL: PropTypes.string,
};

// ----------------------------------------------------------------------

export function RHFUploadAvatar({ name, _id, setValue, BASEURL, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div>
          {/*  */}
          <UploadAvatar
            accept={{
              'image/*': [],
            }}
            _id={_id}
            name={name}
            error={!!error}
            file={field.value}
            setValue={setValue}
            BASEURL={BASEURL}
            {...other}
          />

          {!!error && (
            <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
              {error.message}
            </FormHelperText>
          )}
        </div>
      )}
    />
  );
}

// ----------------------------------------------------------------------
// ----------------------------------------------------------------------

RHFUploadCompanyLogo.propTypes = {
  name: PropTypes.string,
  _id: PropTypes.string,
};

// ----------------------------------------------------------------------

export function RHFUploadCompanyLogo({ name, _id, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div>
          {/*  */}
          <UploadCompanyLogo
            accept={{
              'image/*': [],
            }}
            _id={_id}
            error={!!error}
            file={field.value}
            {...other}
          />

          {!!error && (
            <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
              {error.message}
            </FormHelperText>
          )}
        </div>
      )}
    />
  );
}
// ----------------------------------------------------------------------

RHFUploadRecruitCompanyLogo.propTypes = {
  name: PropTypes.string,
  _id: PropTypes.string,
};

// ----------------------------------------------------------------------

export function RHFUploadRecruitCompanyLogo({ name, _id, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div>
          {/*  */}
          <UploadRecruitCompanyLogo
            accept={{
              'image/*': [],
            }}
            _id={_id}
            error={!!error}
            file={field.value}
            {...other}
          />

          {!!error && (
            <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
              {error.message}
            </FormHelperText>
          )}
        </div>
      )}
    />
  );
}

// ----------------------------------------------------------------------
RHFUploadBackgroundImage.propTypes = {
  name: PropTypes.string,
  _id: PropTypes.string,
};

// ----------------------------------------------------------------------

export function RHFUploadBackgroundImage({ name, _id, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div>
          {/*  */}
          <UploadBackgroundImage
            accept={{
              'image/*': [],
            }}
            _id={_id}
            error={!!error}
            file={field.value}
            {...other}
          />

          {!!error && (
            <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
              {error.message}
            </FormHelperText>
          )}
        </div>
      )}
    />
  );
}

// ----------------------------------------------------------------------

RHFUploadBox.propTypes = {
  name: PropTypes.string,
};

export function RHFUploadBox({ name, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <UploadBox files={field.value} error={!!error} {...other} />
      )}
    />
  );
}

// ----------------------------------------------------------------------

RHFUpload.propTypes = {
  name: PropTypes.string,
  multiple: PropTypes.bool,
  helperText: PropTypes.node,
};

export function RHFUpload({ name, multiple, helperText, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) =>
        multiple ? (
          <Upload
            multiple
            accept={{ 'image/*': [] }}
            files={field.value}
            error={!!error}
            helperText={
              (!!error || helperText) && (
                <FormHelperText error={!!error} sx={{ px: 2 }}>
                  {error ? error?.message : helperText}
                </FormHelperText>
              )
            }
            {...other}
          />
        ) : (
          <Upload
            accept={{ 'image/*': [] }}
            file={field.value}
            error={!!error}
            helperText={
              (!!error || helperText) && (
                <FormHelperText error={!!error} sx={{ px: 2 }}>
                  {error ? error?.message : helperText}
                </FormHelperText>
              )
            }
            {...other}
          />
        )
      }
    />
  );
}
