import MoreVertIcon from '@mui/icons-material/MoreVert';
import { LoadingButton } from '@mui/lab';
import { Chip, IconButton, MenuItem } from '@mui/material';
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
import { deleteInventory, findInventory } from '../../../redux/slices/inventory/inventoryApi';
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

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const deleteProductHandler = async (id) => {
    try {
      const response = await dispatch(deleteInventory(id));
      if (response?.payload?.success) {
        await dispatch(findInventory({ limit: 10, page: 0, filters: {} }));
      }
    } catch (error) {
      console.error('Failed to deactivate:', error);
    } finally {
      handleClosePopover();
    }
  };

  const getStatusChipColor = (status) => {
    switch (status) {
      case "In Stock":
        return "success";
      case "Low Stock":
        return "warning";
      case "Out of Stock":
        return "error";
      default:
        return "default";
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
        <TableCell padding="checkbox" />
        <TableCell onClick={() => navigate(`/inventory/view/${row?._id}`)}>{row?.itemId || '-'}</TableCell>
        <TableCell onClick={() => navigate(`/inventory/view/${row?._id}`)}>{row?.itemName || '-'}</TableCell>
        <TableCell>{row?.unitType || '-'}</TableCell>
        <TableCell>{row?.openingStock || 0}</TableCell>
        <TableCell>{row?.inWardQty || 0}</TableCell>
        <TableCell>
          {moment(row?.inWardQtyDate).isValid() ? moment(row?.inWardQtyDate).format('DD/MM/YY hh:mm A') : '-'}
        </TableCell>
        <TableCell>{row?.outWardQty || 0}</TableCell>
        <TableCell>
          {moment(row?.outWardQtyDate).isValid() ? moment(row?.outWardQtyDate).format('DD/MM/YY hh:mm A') : '-'}
        </TableCell>
        <TableCell>{row?.closingStock || 0}</TableCell>
        <TableCell>
          {row?.warehouseId?.name || '-'} ({row?.warehouseId?.location || '-'})
        </TableCell>
        <TableCell>
          {row?.status ? (
            <Chip
              label={row.status}
              color={getStatusChipColor(row.status)}
              size="small"
              variant="outlined"
              sx={{ fontWeight: 500, fontSize: 13 }}
            />
          ) : (
            <Chip
              label="-"
              color="default"
              size="small"
              variant="outlined"
              sx={{ fontWeight: 500, fontSize: 13 }}
            />
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
        sx={{ width: 'auto' }}
      >
        <Link to={`/inventory/edit/${row?._id}`} state={{ ...row }}>
          <MenuItem>
            <Iconify icon="eva:edit-fill" />
            Edit
          </MenuItem>
        </Link>

        <Link to={`/inventory/view/${row?._id}`} state={{ ...row }}>
          <MenuItem>
            <Iconify icon="eva:eye-outline" />
            View
          </MenuItem>
        </Link>

        {/* <MenuItem
   
    onClick={() => {
      handleOpenConfirm();
      handleClosePopover();
    }}
    sx={{ color: "error.main" }}
  >
    <Iconify icon="eva:trash-2-outline" />
    Delete
  </MenuItem> */}

      </MenuPopover>
      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content="Are you sure you want to delete?"
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
            Delete
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
  isLoading: PropTypes.bool,
};

export default Index