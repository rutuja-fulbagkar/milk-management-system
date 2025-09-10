import PropTypes, { number } from 'prop-types';
// @mui
import { Typography, Stack } from '@mui/material';
//
import Image from '../image';

// ----------------------------------------------------------------------

EmptyContentSmall.propTypes = {
  sx: PropTypes.object,
  img: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  padding: PropTypes.number,
};

export default function EmptyContentSmall({ title, description, img, sx, padding, ...other }) {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{
        width: '100%',
        textAlign: 'center',
        p: (theme) => (padding ? 0 : theme.spacing(4, 2)),
        ...sx,
      }}
      {...other}
    >
      <Image
        disabledEffect
        alt="empty content"
        src={img || '/assets/illustrations/illustration_empty_content.svg'}
      />

      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>

      {description && (
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {description}
        </Typography>
      )}
    </Stack>
  );
}
