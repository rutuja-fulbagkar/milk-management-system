import MoreVertIcon from '@mui/icons-material/MoreVert';
import { LoadingButton } from '@mui/lab';
import { Box, Chip, IconButton, List, ListItem, ListItemText, MenuItem, Select, Stack, Tooltip, Typography } from '@mui/material';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import moment from 'moment';
import PropTypes from 'prop-types';
import * as React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ConfirmDialog from '../../../../components/confirm-dialog';
import Iconify from '../../../../components/iconify';
import MenuPopover from '../../../../components/menu-popover/MenuPopover';
import { deleteOutward, editOutwardStatus, findOutward } from '../../../../redux/slices/outward/outwardApi';
import { useDispatch } from '../../../../redux/store';
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


  const deleteProductHandler = async (id) => {
    try {
      const response = await dispatch(deleteOutward(id));
      if (response?.payload?.success) {
        await dispatch(findOutward());
      }
    } catch (error) {
      console.error('Failed to deactivate:', error);
    } finally {
      handleClosePopover();
    }
  };
  //
  const renderTooltipList = (items) => (
    <List>
      {items.map((id, index) => (
        <ListItem key={index}>
          <Typography
            variant="body1"
            component="span"
            style={{ marginRight: "8px" }}
          >
            {index + 1}.
          </Typography>
          <ListItemText primary={id} />
        </ListItem>
      ))}
    </List>
  );

  const renderLimitedList = (items) => {
    const visibleItems = items.slice(0, 2);
    const remainingCount = items.length - 2;

    return (
      <>
        <List>
          {visibleItems?.map((id, index) => (
            <ListItem key={index}>
              <Typography
                variant="body1"
                component="span"
                style={{ marginRight: "8px" }}
              >
                {index + 1}.
              </Typography>
              <ListItemText primary={id} />
            </ListItem>
          ))}
        </List>
        {remainingCount > 0 && (
          <Typography variant="caption" color="text.secondary">
            +{remainingCount} more
          </Typography>
        )}
      </>
    );
  };

  //
  const handleChangeStatus = async (newStatus) => {
    const payload = {
      paramsId: row._id,
      data: {
        status: newStatus,
      },
    };

    try {
      const response = await dispatch(editOutwardStatus(payload));
      if (response.payload.success) {
        await dispatch(findOutward());
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };


  const badgecolor = row?.orderType === 'AdHoc' ? '#83bd47' : '#0b70a8';


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
        <TableCell component="th" id={labelId} scope="row" padding="none" onClick={() => navigate(`/inward-outward-request/outward/view/${row?._id}`)}>
          {row?.requestId || '-'}
        </TableCell>
        <TableCell>
          {moment(row?.requestedDate).isValid()
            ? moment(row?.requestedDate).format('DD/MM/YYYY')
            : '-'}
        </TableCell>
        <TableCell>
          {row?.requestedBy ? `${row.requestedBy.firstName} ${row.requestedBy.lastName} ` : '-' || '-'}
        </TableCell>
        <TableCell>
          <Stack direction="row" alignItems="center" onClick={() => navigate(`/inward-outward-request/outward/view/${row?._id}`)}>
            <Tooltip
              title={renderTooltipList(
                row.items?.map(
                  (item) =>
                    `${item?.itemId?.itemName || "-"} (${item?.quantity} ${item?.unitType})`
                ) || []

              )}
              arrow
            >
              <Typography variant="subtitle2" noWrap>
                {renderLimitedList(
                  row.items?.map(
                    (item) =>
                      `${item?.itemId?.itemName || "-"} (${item?.quantity} ${item?.unitType})`
                  ) || []

                )}
              </Typography>
            </Tooltip>
          </Stack>
        </TableCell>

        <TableCell> {row.requestType || "-"}</TableCell>
        <TableCell>{row?.siteId?.siteName || '-'}</TableCell>
        <TableCell>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography variant="body2" fontWeight="500">
              {row?.billNumber || '-'}
            </Typography>
            <Tooltip title="Order Type">
              <Chip
                label={row?.orderType === 'AdHoc' ? 'Ad Hoc' : 'In-House'}
                size="small"
                sx={{
                  mt: 0.5,
                  padding: '2px 6px',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  height: 'auto',
                  minWidth: 'auto',
                  color: '#fff',
                  backgroundColor: badgecolor,
                }}
              />
            </Tooltip>
          </Box>
        </TableCell>


        <TableCell>
          <Select
            size="small"
            value={row?.status}
            onChange={(e) => handleChangeStatus(e.target.value)}
            disabled={row?.status === "Approved" || row?.status === "Rejected"}
            displayEmpty
            fullWidth
          >
            <MenuItem value="Pending">
              <span className="status-badge status-pending"></span>
              Pending
            </MenuItem>
            <MenuItem value="Approved">
              <span className="status-badge status-approved"></span>
              Approved
            </MenuItem>
            <MenuItem value="Rejected">
              <span className="status-badge status-rejected"></span>
              Rejected
            </MenuItem>
          </Select>
        </TableCell>
        <TableCell>{row?.approvedBy ? `${row.approvedBy.firstName} ${row.approvedBy.lastName} ` : '-' || '-'}</TableCell>
        <TableCell>
          {moment(row?.approvedDate).isValid() ? moment(row?.approvedDate).format('DD/MM/YY hh:mm A') : '-'}
        </TableCell>
        <TableCell>{row?.rejectedBy ? `${row.rejectedBy.firstName} ${row.rejectedBy.lastName} ` : '-' || '-'}</TableCell>
        <TableCell>
          {moment(row?.rejectionDate).isValid() ? moment(row?.rejectionDate).format('DD/MM/YY hh:mm A') : '-'}
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
        <Link to={`/inward-outward-request/outward/view/${row?._id}`} state={{ ...row }}>
          <MenuItem>
            <Iconify icon="eva:eye-outline" />
            View
          </MenuItem>
        </Link>
        {(row?.status === "Pending") && (
          <Link to={`/inward-outward-request/outward/edit/${row?._id}`} state={{ ...row }}>
            <MenuItem>
              <Iconify icon="eva:edit-fill" />
              Edit
            </MenuItem>
          </Link>
        )}
        {(row?.status === "Pending") && (
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
        )}
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