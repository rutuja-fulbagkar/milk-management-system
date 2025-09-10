import MoreVertIcon from "@mui/icons-material/MoreVert";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import { LoadingButton } from "@mui/lab";
import { Box, Chip, IconButton, MenuItem, Typography } from "@mui/material";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import PropTypes from "prop-types";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ConfirmDialog from "../../../../components/confirm-dialog";
import Iconify from "../../../../components/iconify";
import MenuPopover from "../../../../components/menu-popover/MenuPopover";
import { archiveUser, deleteUser } from "../../../../redux/slices/user/userApi";
import {
  deactivatewarehouse
} from "../../../../redux/slices/warehouse/warehouseApi";
import { useDispatch } from "../../../../redux/store";

const Index = ({ row, isItemSelected, labelId, isLoading,fetchData }) => {
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

  const deleteProductHandler = async (id) => {
    try {
      const response = await dispatch(deleteUser(id));
      if (response?.payload?.success) {
       fetchData();
      }
    } catch (error) {
      console.error("Failed to deactivate:", error);
    } finally {
      handleClosePopover();
    }
  };

  const restoreHandler = async (id) => {
    try {
      const response = await dispatch(archiveUser(id));
      if (response?.payload?.success) {
        fetchData();
      }
    } catch (error) {
      console.error("Failed to deactivate:", error);
    } finally {
      handleClosePopover();
    }
  };

   function capitalizeName(name) {
    if (!name) return "";
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }

  return (
    <>
        <TableRow
        hover
        role="checkbox"
        aria-checked={isItemSelected}
        tabIndex={-1}
        key={row.id}
        selected={isItemSelected}
        sx={{ cursor: "pointer" }}
      >
        <TableCell>&nbsp;</TableCell>
        <TableCell
          sx={{
            cursor: "pointer",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
          onClick={() => navigate(`/user/view/${row?._id}`)}
        >
          {row?.employeeId || "-"}
        </TableCell>
        <TableCell
          component="th"
          id={labelId}
          scope="row"
          padding="none"
          sx={{
            cursor: "pointer",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
          onClick={() => navigate(`/user/view/${row?._id}`)}
        >
          {`${capitalizeName(row?.firstName)} ${capitalizeName(
            row?.lastName
          )}`.trim()}
        </TableCell>
        <TableCell
          sx={{
            cursor: "pointer",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
          onClick={() => navigate(`/user/view/${row?._id}`)}
        >
          {row?.email || "-"}
        </TableCell>
        <TableCell onClick={() => navigate(`/user/view/${row?._id}`)}>
          {row?.mobile || "-"}
        </TableCell>
        <TableCell onClick={() => navigate(`/user/view/${row?._id}`)}>
          {row?.role?.name || "-"}
        </TableCell>
        <TableCell onClick={() => navigate(`/user/view/${row?._id}`)}>
          {row?.role?.status ? (
            <Box display="flex" alignItems="center" gap={1}>
              <Chip
                label=""
                sx={{
                  backgroundColor:
                    row?.role?.status === "Active" ? "green" : "red",
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                }}
              />
              <Typography variant="body2">
                {row?.role?.status === "Active" ? "Access" : "No Access"}
              </Typography>
            </Box>
          ) : (
            "-"
          )}
        </TableCell>

        <TableCell>
          <IconButton
            color={openPopover ? "inherit" : "default"}
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
          width: "auto",
        }}
      >
        <Link to={`/user/view/${row?._id}`} state={{ ...row }}>
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
          sx={{ color: "success.main" }}
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
  );
};

Index.propTypes = {
  isItemSelected: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
  labelId: PropTypes.string.isRequired,
  row: PropTypes.object.isRequired,
  isLoading: PropTypes.bool,
  fetchData: PropTypes.func,
};

export default Index;
