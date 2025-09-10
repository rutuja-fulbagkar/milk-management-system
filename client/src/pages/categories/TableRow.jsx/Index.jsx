import MoreVertIcon from '@mui/icons-material/MoreVert';
import { LoadingButton } from '@mui/lab';
import { IconButton, MenuItem } from '@mui/material';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import moment from 'moment';
import PropTypes from 'prop-types';
import * as React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import ConfirmDialog from '../../../components/confirm-dialog';
import Iconify from '../../../components/iconify';
import MenuPopover from '../../../components/menu-popover/MenuPopover';
import { deletecategories, findcategories } from '../../../redux/slices/categories/categoriesApi';
import { useDispatch } from '../../../redux/store';
const Index = ({ row, isItemSelected,  isLoading }) => {
  const dispatch = useDispatch();
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


  const deletecategoriesHandler = async (id) => {
    try {
      const response = await dispatch(deletecategories(id));
      if (response?.payload?.success) {
        await dispatch(findcategories());
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
        key={row.id}
        selected={isItemSelected}
        sx={{ cursor: 'pointer' }}
      >
        <TableCell padding="checkbox"/>
        <TableCell>
          {row.categoryName ? row.categoryName.charAt(0).toUpperCase() + row.categoryName.slice(1) : '-'}
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
        <Link to={`/categories/edit/${row?._id}`} state={{ ...row }}>
          <MenuItem>
            <Iconify icon="eva:edit-fill" />
            Edit
          </MenuItem>
        </Link>

        <Link to={`/categories/view/${row?._id}`} state={{ ...row }}>
          <MenuItem>
            <Iconify icon="eva:eye-outline" />
            View
          </MenuItem>
        </Link>
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
        content="Are you sure you want to delete?"
        action={
          <LoadingButton
            type="submit"
            variant="contained"
            color="error"
            loading={isLoading}
            onClick={() => {
              deletecategoriesHandler(row?._id);
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
  row: PropTypes.object.isRequired,
  isLoading: PropTypes.bool,
};

export default Index