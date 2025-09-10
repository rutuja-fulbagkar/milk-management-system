import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import { Box, Button, IconButton, Stack, Typography } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { UploadIllustration } from '../../assets/illustrations';
import Iconify from '../iconify';
import RejectionFiles from './errors/RejectionFiles';
import MultiFilePreview from './preview/MultiFilePreview';
import SingleFilePreview from './preview/SingleFilePreview';

const StyledDropZone = styled('div')(({ theme }) => ({
  outline: 'none',
  cursor: 'pointer',
  overflow: 'hidden',
  position: 'relative',
  padding: theme.spacing(5),
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create('padding'),
  backgroundColor: theme.palette.background.neutral,
  border: `1px dashed ${alpha(theme.palette.grey[500], 0.32)}`,
  '&:hover': {
    opacity: 0.72,
  },
}));

Upload.propTypes = {
  sx: PropTypes.object,
  error: PropTypes.bool,
  files: PropTypes.array,
  BASEURL: PropTypes.string,
  hiddenButton: PropTypes.string,
  file: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  disabled: PropTypes.bool,
  multiple: PropTypes.bool,
  onDelete: PropTypes.func,
  onRemove: PropTypes.func,
  onUpload: PropTypes.func,
  thumbnail: PropTypes.bool,
  helperText: PropTypes.node,
  onRemoveAll: PropTypes.func,
  accept: PropTypes.object,
};

export default function Upload({
  disabled,
  multiple = false,
  error,
  helperText,
  BASEURL,
  file,
  onDelete,
  files,
  thumbnail,
  onUpload,
  onRemove,
  onRemoveAll,
  hiddenButton,
  accept,
  sx,
  ...other
}) {
  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    multiple,
    disabled,
    // accept: {
    //   'image/jpeg': ['.jpg', '.jpeg'],
    //   'image/png': ['.png'],
    // },
    accept,
    ...other,
  });

  const hasFile = !!file && !multiple;

  const hasFiles = files && multiple && files.length > 0;

  const isError = isDragReject || !!error;

  return (
    <Box sx={{ width: 1, height: 'inherit', position: 'relative', ...sx }}>
      <StyledDropZone
        {...getRootProps()}
        sx={{
          ...(isDragActive && {
            opacity: 0.72,
          }),
          ...(isError && {
            color: 'error.main',
            bgcolor: 'error.lighter',
            borderColor: 'error.light',
          }),
          ...(disabled && {
            opacity: 0.48,
            pointerEvents: 'none',
          }),
          ...(hasFile && {
            padding: '12% 0',
          }),
        }}
      >
        <input {...getInputProps()} />

        <Placeholder
          sx={{
            ...(hasFile && {
              opacity: 0,
            }),
          }}
        />
        {hasFile && <SingleFilePreview file={file} BASEURL={BASEURL} />}
      </StyledDropZone>

      {helperText && helperText}

      <RejectionFiles fileRejections={fileRejections} />

      {hasFile && onDelete && (
        <IconButton
          size="small"
          onClick={onDelete}
          sx={{
            top: 16,
            right: 16,
            zIndex: 9,
            position: 'absolute',
            color: (theme) => alpha(theme.palette.common.white, 0.8),
            bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
            '&:hover': {
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
            },
          }}
        >
          <Iconify icon="eva:close-fill" width={18} />
        </IconButton>
      )}

      {hasFiles && (
        <Box sx={{ my: 3 }}>
          <MultiFilePreview files={files} thumbnail={thumbnail} onRemove={onRemove} />
        </Box>
      )}
    </Box>
  );
}

Placeholder.propTypes = {
  sx: PropTypes.object,
};

function Placeholder({ sx, ...other }) {
  return (
    <Stack
      spacing={5}
      alignItems="center"
      justifyContent="center"
      direction={{
        xs: 'column',
        md: 'row',
      }}
      sx={{
        width: 1,
        textAlign: {
          xs: 'center',
          md: 'left',
        },
        ...sx,
      }}
      {...other}
    >
      <UploadIllustration className="sm:w-[220px] w-[150px]" />

      <Box
        sx={{
          margin: '50px auto',
        }}
      >
        <Typography variant="h5" gutterBottom>
          Drop or Select file
        </Typography>
        <Typography variant="body2" color="text.secondary" className="sm:block hidden">
          Drop files here or click
          <Button
            variant="text"
            component="span"
            sx={{ mx: 0.5, color: 'primary.main', textDecoration: 'underline' }}
          >
            browse
          </Button>
          through your machine
        </Typography>
      </Box>
    </Stack>
  );
}
