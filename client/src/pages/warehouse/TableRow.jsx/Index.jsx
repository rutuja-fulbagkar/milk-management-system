import ArchiveIcon from '@mui/icons-material/Archive';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { LoadingButton } from '@mui/lab';
import { IconButton, MenuItem } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import moment from 'moment';
import PropTypes from 'prop-types';
import * as React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ConfirmDialog from '../../../components/confirm-dialog';
import Iconify from '../../../components/iconify';
import MenuPopover from '../../../components/menu-popover/MenuPopover';
import { archivewarehousebyIdForSingle, deactivatewarehouse, findwarehouse } from '../../../redux/slices/warehouse/warehouseApi';
import { useDispatch } from '../../../redux/store';
const Index = ({ row, isItemSelected, labelId, handleClick, isLoading }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openPopover, setOpenPopover] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);

  const handleOpenPopover = (event, _) => {
    setOpenPopover(event.currentTarget);
  };
  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const fetchWarehouseData = () => {
    dispatch(findwarehouse());
  };

  const deactivateWarehouseHandler = async (id) => {
    try {
      const response = await dispatch(deactivatewarehouse(id));
      if (response?.payload?.success) {
        await fetchWarehouseData();
      }
    } catch (error) {
      console.error('Failed to deactivate:', error);
    } finally {
      handleClosePopover();
    }
  };

  const deleteProductHandler = async (id) => {
    try {
      const response = await dispatch(archivewarehousebyIdForSingle(id));
      if (response?.payload?.success) {
        await fetchWarehouseData();
      }
    } catch (error) {
      console.error('Failed to deactivate:', error);
    } finally {
      handleClosePopover();
    }
  };


  return (
    <>
      <TableRow
        hover
        role="checkbox"
        aria-checked={isItemSelected}
        tabIndex={-1}
        key={row._id}
        selected={isItemSelected}
        sx={{ cursor: 'pointer' }}
      >
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            onClick={(event) => handleClick(event, row._id)}
            checked={isItemSelected}
            inputProps={{
              'aria-labelledby': labelId,
            }}
          />
        </TableCell>
        <TableCell
          component="th"
          id={labelId}
          scope="row"
          padding="none"
          onClick={() => navigate(`/warehouse/view/${row?._id}`)}
        >
          {row.name}
        </TableCell>
        <TableCell onClick={() => navigate(`/user/view/${row?.supervisor?._id}`)}>{`${row?.supervisor?.firstName || ''} ${row?.supervisor?.lastName || ''}`.trim() || "-"}</TableCell>
        <TableCell>{row.location || '-'}</TableCell>
        <TableCell>
          {row.status === 'Active' ? (
            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset">{row.status || '-'}</span>
          ) : (<span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-red-600/10 ring-inset">{row.status || '-'}</span>
          )}
        </TableCell>
        <TableCell>
          {moment(row?.createdAt).isValid() ? moment(row?.createdAt).format('DD/MM/YY hh:mm A') : '-'}

        </TableCell>
        <TableCell>
          {moment(row?.updatedAt).isValid() ? moment(row?.updatedAt).format('DD/MM/YY hh:mm A') : '-'}

        </TableCell>
        <TableCell>
          <IconButton
            color={openPopover ? 'inherit' : 'default'}
            onClick={(event) => handleOpenPopover(event, row)}
          >
            <MoreVertIcon />
          </IconButton>
        </TableCell>
      </TableRow>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{
          width: 'auto',
        }}
      >
        <Link to={`/warehouse/edit/${row?._id}`} state={{ ...row }}>
          <MenuItem>
            <Iconify icon="eva:edit-fill" />
            Edit
          </MenuItem>
        </Link>

        <Link to={`/warehouse/view/${row?._id}`} state={{ ...row }}>
          <MenuItem>
            <Iconify icon="eva:eye-outline" />
            View
          </MenuItem>
        </Link>
        {row?.status !== 'Inactive' && (
          <MenuItem
            onClick={() => {
              deactivateWarehouseHandler(row?._id);
              handleClosePopover();
            }}
          >
            <Iconify icon="mdi:block-helper" />

            Inactivate
          </MenuItem>


        )}
        {row?.status === 'Inactive' && (
          <MenuItem
            onClick={() => {
              handleOpenConfirm();
              handleClosePopover();
            }}
            sx={{ color: "error.main" }}
          >
            <ArchiveIcon />
            Archive
          </MenuItem>
        )}
      </MenuPopover>
      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Archive"
        content="Are you sure you want to archive the current warehouse?"
        action={
          <LoadingButton
            type="submit"
            variant="contained"
            color="error"
            loading={isLoading}
            onClick={() => {
              deleteProductHandler(row?._id);
            }}
          >
            Archive
          </LoadingButton>
        }
      />
    </>
  )
}


Index.propTypes = {
  isItemSelected: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
  labelId: PropTypes.string.isRequired,
  row: PropTypes.object.isRequired,
  isLoading: PropTypes.bool
};

export default Index