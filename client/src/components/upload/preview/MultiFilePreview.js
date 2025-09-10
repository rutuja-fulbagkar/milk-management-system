import PropTypes from 'prop-types';
import { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DownloadIcon from '@mui/icons-material/Download';
import { IconButton, MenuItem, Stack, Typography } from '@mui/material';
// utils
import { fData } from '../../../utils/formatNumber';
//
import Iconify from '../../iconify';
import { varFade } from '../../animate';
import FileThumbnail, { fileData } from '../../file-thumbnail';
import MenuPopover from '../../menu-popover';

// ----------------------------------------------------------------------

MultiFilePreview.propTypes = {
  sx: PropTypes.object,
  files: PropTypes.array,
  onRemove: PropTypes.func,
  thumbnail: PropTypes.bool,
};

export default function MultiFilePreview({ thumbnail, files, onRemove, sx }) {
  const [openPopover, setOpenPopover] = useState(null);
  const [singleFile, setSingleFile] = useState('');
  const themes = useTheme();

  if (!files?.length) {
    return null;
  }

  const handleOpenPopover = (event, file) => {
    setOpenPopover(event.currentTarget);
    setSingleFile(file);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const downloadFuction = async (file) => {
    if (file.preview) {
      try {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const filename = file?.path.split('/').pop();
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      } catch (error) {
        console.error('Download failed:', error);
      }
    } else {
      try {
        const response = await fetch(file);
        const fileName = new URL(file).pathname.split('/').pop();
        const fileExtension = fileName.match(/\.(.*)$/)[1];
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `file.${fileExtension}`;
        a.click();
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <AnimatePresence initial={false}>
      {files?.map((file) => {
        const { key, name = '', size = 0 } = fileData(file);

        const isNotFormatFile = typeof file === 'string';

        if (thumbnail) {
          return (
            <Stack
              key={key}
              component={m.div}
              {...varFade().inUp}
              alignItems="center"
              display="inline-flex"
              justifyContent="center"
              sx={{
                m: 0.5,
                width: 110,
                height: 90,
                borderRadius: 1.25,
                overflow: 'hidden',
                objectFit: 'contain',
                position: 'relative',
                background: (theme) => theme.palette.background.default,
                border: (theme) => `solid 1px ${theme.palette.divider}`,
                ...sx,
              }}
            >
              <FileThumbnail
                tooltip
                imageView
                file={file}
                sx={{ position: 'absolute' }}
                imgSx={{ position: 'absolute' }}
              />

              <IconButton
                size="small"
                onClick={(e) => handleOpenPopover(e, file)}
                sx={{
                  top: 4,
                  right: 4,
                  p: '1px',
                  position: 'absolute',
                  color: (theme) => alpha(theme.palette.common.white, 0.72),
                  bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
                  '&:hover': {
                    bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                  },
                }}
              >
                <MoreHorizIcon style={{ fontSize: '16px' }} />
              </IconButton>
            </Stack>
          );
        }

        return (
          <Stack
            key={key}
            component={m.div}
            {...varFade().inUp}
            spacing={2}
            direction="row"
            alignItems="center"
            sx={{
              my: 1,
              px: 1,
              py: 0.75,
              borderRadius: 0.75,
              border: (theme) => `solid 1px ${theme.palette.divider}`,
              ...sx,
            }}
          >
            <FileThumbnail file={file} />

            <Stack flexGrow={1} sx={{ minWidth: 0 }}>
              <Typography variant="subtitle2" noWrap>
                {isNotFormatFile ? file : name}
              </Typography>

              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {isNotFormatFile ? '' : fData(size)}
              </Typography>
            </Stack>

            {onRemove && (
              <IconButton edge="end" size="small" onClick={() => onRemove(file)}>
                <Iconify icon="eva:close-fill" />
              </IconButton>
            )}
          </Stack>
        );
      })}
      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        className="menu-popover-padding-remove"
        sx={{ width: 110, background: themes.palette.background.default }}
      >
        <MenuItem
          onClick={() => {
            handleClosePopover();
            downloadFuction(singleFile);
          }}
          className="!pb-0"
          sx={{
            color: themes.palette.info.main,
            fontSize: '10px !important',
          }}
        >
          <DownloadIcon className="!mr-1 !w-[16px]" />
          Download
        </MenuItem>

        {onRemove && (
          <MenuItem
            onClick={() => {
              handleClosePopover();
              onRemove(singleFile);
            }}
            sx={{
              color: 'error.main',
              fontSize: '10px !important',
            }}
          >
            <Iconify icon="eva:trash-2-outline" className="!mr-1 !w-[16px]" />
            Remove
          </MenuItem>
        )}
      </MenuPopover>
    </AnimatePresence>
  );
}
