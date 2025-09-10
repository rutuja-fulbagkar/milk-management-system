import PropTypes from 'prop-types';
import { Typography, Stack } from '@mui/material';
import Image from '../image';


EmptyContent.propTypes = {
  sx: PropTypes.object,
  img: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
};

export default function EmptyContent({ title, description, img, sx, ...other }) {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{
        height: 1,
        textAlign: 'center',
        p: (theme) => theme.spacing(6, 2),
        ...sx,
      }}
      {...other}
    >
      <Image
        disabledEffect
        alt="empty content"
        src={img || 'https://cdn-icons-png.flaticon.com/512/4076/4076549.png'}
        sx={{ height: 240, mb: 3 }}
      />

      <Typography variant="h5" gutterBottom>
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
