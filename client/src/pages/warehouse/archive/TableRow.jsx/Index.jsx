import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton, MenuItem } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import moment from 'moment';
import PropTypes from 'prop-types';
import * as React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import Iconify from '../../../../components/iconify';
import MenuPopover from '../../../../components/menu-popover/MenuPopover';
import { archivewarehousebyIdForSingle, deactivatewarehouse, deletewarehouse, findwarehouse } from '../../../../redux/slices/warehouse/warehouseApi';
import { useDispatch } from '../../../../redux/store';
import ConfirmDialog from '../../../../components/confirm-dialog';
import { LoadingButton } from '@mui/lab';
const Index = ({ row, isItemSelected, labelId, handleClick , isLoading}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openPopover, setOpenPopover] = useState(null);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [openConfirmRestore, setOpenConfirmRestore] = useState(false);
  


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
    dispatch(findwarehouse({isArchived:true}));
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
      const response = await dispatch(deletewarehouse(id));
      if (response?.payload?.success) {
        await fetchWarehouseData();
      }
    } catch (error) {
      console.error('Failed to deactivate:', error);
    } finally {
      handleClosePopover();
    }
  };

  const restoreHandler = async (id) => {
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
        <TableCell  onClick={() => navigate(`/user/view/${row?.supervisor?._id}`)}>{`${row?.supervisor?.firstName || ''} ${row?.supervisor?.lastName || ''}`.trim() || "-"}</TableCell>
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
        
        <Link to={`/warehouse/view/${row?._id}`} state={{ ...row }}>
          <MenuItem>
            <Iconify icon="eva:eye-outline" />
            View
          </MenuItem>
        </Link>
       
 
<MenuItem
            onClick={() => {
              setOpenConfirmRestore(true);
              handleClosePopover();
            }}
            sx={{ color: 'success.main' }}
          >
            <RestoreFromTrashIcon fontSize="small" />
            Restore
          </MenuItem>
        <MenuItem
        onClick={() => {
          handleOpenConfirm();
          handleClosePopover();
        }}
          sx={{ color: "error.main" }}
        >
          <Iconify icon="eva:trash-2-outline" />
          Delete
        </MenuItem>
      </MenuPopover>
      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content="Are you sure you want to delete ?"
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
        <ConfirmDialog
        open={openConfirmRestore}
        onClose={() => setOpenConfirmRestore(false)}
        title="Restore"
        content="Are you sure you want to restore ?"
        action={
          <LoadingButton
            type="submit"
            variant="contained"
            color="success"
            loading={isLoading}
            onClick={() => {
              restoreHandler(row?._id);
              setOpenConfirmRestore(false);
            }}
          >
            Restore
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
  isLoading:PropTypes.bool
};

export default Index