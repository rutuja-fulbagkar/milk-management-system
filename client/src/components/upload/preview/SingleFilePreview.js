import PropTypes from 'prop-types';
import { Buffer } from 'buffer';
import Image from '../../image';

// ----------------------------------------------------------------------

SingleFilePreview.propTypes = {
  file: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  BASEURL: PropTypes.string,
};

export default function SingleFilePreview({ file, BASEURL }) {
  if (!file) {
    return null;
  }

  // function bufferToBase64(bufferData) {
  //   const buffer = Buffer.from(bufferData?.data);
  //   const base64String = buffer.toString('base64');
  //   return `data:image/png;base64,${base64String}`;
  // }
  function bufferToBase64(bufferData) {
    if (!bufferData?.data) return ''; // Handle case where data is undefined

    try {
      const buffer = Buffer.from(bufferData.data);
      const base64String = buffer.toString('base64');
      return `data:image/png;base64,${base64String}`;
    } catch (error) {
      console.error('Error converting buffer to base64:', error);
      return '';
    }
  }

  const imgUrl = typeof file === 'string' ? file : file.preview || bufferToBase64(file?.data);

  const URL =
    imgUrl?.includes('http') || imgUrl?.length > 500 ? imgUrl : BASEURL && `${BASEURL}/${imgUrl}`;

  return (
    <Image
      alt="file preview"
      className="!object-contain"
      src={URL}
      sx={{
        top: 8,
        left: 8,
        zIndex: 8,
        borderRadius: 1,
        position: 'absolute',
        width: 'calc(100% - 16px)',
        height: 'calc(100% - 16px)',
      }}
    />
  );
}
