import PropTypes from 'prop-types';
//
import Image from '../../image';
import { baseURL } from '../../../api';

// ----------------------------------------------------------------------

AvatarPreview.propTypes = {
  file: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  BASEURL: PropTypes.string,
};

export default function AvatarPreview({ file, BASEURL }) {
  if (!file) {
    return null;
  }

  const imgUrl = typeof file === 'string' ? file : file.preview;

  const URL = imgUrl?.includes('http') || imgUrl?.length > 500 ? imgUrl : `${BASEURL}/${imgUrl}`;

  return (
    <Image
      alt="avatar"
      src={URL}
      sx={{
        zIndex: 8,
        overflow: 'hidden',
        borderRadius: '50%',
        position: 'absolute',
        width: `calc(100% - 16px)`,
        height: `calc(100% - 16px)`,
      }}
    />
  );
}
