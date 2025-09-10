import MoreVertIcon from "@mui/icons-material/MoreVert";
import { LoadingButton } from "@mui/lab";
import { Box, Chip, IconButton, MenuItem, Typography } from "@mui/material";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import PropTypes from "prop-types";
import { useState } from "react";
import ConfirmDialog from "../../../components/confirm-dialog";
import Iconify from "../../../components/iconify";
import MenuPopover from "../../../components/menu-popover/MenuPopover";
import { toast } from "react-toastify";

const Index = ({
  row,
  isItemSelected,
  labelId,
  handleClick,
  onDeleteRow,
  setSelectedRole,
  isLoading,
  setRolesOpen,
}) => {
  const [openPopover, setOpenPopover] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleEditClick = () => {
    if( (row.name) === "admin" ) {
      toast.error("This role can't be edited.", {
        autoClose: 8000, 
      });
    } else {
      setSelectedRole(row);
      setRolesOpen(true);
    }
  };

  const handleOpenPopover = (event, _) => {
    setOpenPopover(event.currentTarget);
  };
  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  function capitalizeName(name) {
    if (!name) return "";
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }

  return (
    <>
      <TableRow
        hover
        onClick={(event) => handleClick(event, row?.id)}
        role="checkbox"
        aria-checked={isItemSelected}
        tabIndex={-1}
        key={row.id}
        selected={isItemSelected}
        sx={{ cursor: "pointer" }}
      >
        <TableCell>&nbsp;</TableCell>

        <TableCell
          component="th"
          id={labelId}
          scope="row"
          padding="none"
        >
          {row?.name}
        </TableCell>
        <TableCell>
          {row?.status ? (
            <Box display="flex" alignItems="center" gap={1}>
              <Chip
                label=""
                sx={{
                  backgroundColor: row?.status === "Active" ? "green" : "red",
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                }}
              />
              <Typography variant="body2">
                {row?.status === "Active" ? "Access" : "No Access"}
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
        
        <MenuItem onClick={handleEditClick}>
          <Iconify icon="eva:edit-fill" />
          Edit
        </MenuItem>
        {row?.name !== "admin" && row?.name !== "Admin" && (
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
            onClick={onDeleteRow}
          >
            Delete
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
  onDeleteRow: PropTypes.func,
  isLoading: PropTypes.bool,
  setSelectedRole: PropTypes.bool,
    setRolesOpen: PropTypes.func,
};

export default Index;
