import MoreVertIcon from "@mui/icons-material/MoreVert";
import { LoadingButton } from "@mui/lab";
import { Box, Chip, IconButton, MenuItem, Typography } from "@mui/material";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import moment from "moment";
import PropTypes from "prop-types";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ConfirmDialog from "../../../components/confirm-dialog";
import Iconify from "../../../components/iconify";
import MenuPopover from "../../../components/menu-popover/MenuPopover";

const Index = ({
  row,
  isItemSelected,
  labelId,
  onDeleteRow,
  isLoading,
}) => {
  const navigate = useNavigate();
  const [openPopover, setOpenPopover] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
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
        role="checkbox"
        aria-checked={isItemSelected}
        tabIndex={-1}
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
          {row?.newId || "-"}
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
          {moment(row?.createdAt).isValid()
            ? moment(row?.createdAt).format("DD/MM/YY hh:mm A")
            : "-"}
        </TableCell>
        <TableCell>
          {moment(row?.updatedAt).isValid()
            ? moment(row?.updatedAt).format("DD/MM/YY hh:mm A")
            : "-"}
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
        <Link to={`/user/edit/${row?._id}`} state={{ ...row }}>
          <MenuItem>
            <Iconify icon="eva:edit-fill" />
            Edit
          </MenuItem>
        </Link>

        <Link to={`/user/view/${row?._id}`} state={{ ...row }}>
          <MenuItem>
            <Iconify icon="eva:eye-outline" />
            View
          </MenuItem>
        </Link>
        {row?.role?.name !== "admin" && row?.role?.name !== "Admin" && (
          <MenuItem
            onClick={() => {
              handleOpenConfirm();
              handleClosePopover();
            }}
            sx={{ color: "error.main" }}
          >
            <Iconify icon="eva:trash-2-outline" />
            Archive
          </MenuItem>
        )}
      </MenuPopover>
      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content="Are you sure you want to Archive?"
        action={
          <LoadingButton
            type="submit"
            variant="contained"
            color="error"
            loading={isLoading}
            onClick={onDeleteRow}
          >
            Archive
          </LoadingButton>
        }
      />
    </>
  );
};

Index.propTypes = {
  isItemSelected: PropTypes.bool.isRequired,
  labelId: PropTypes.string.isRequired,
  row: PropTypes.object.isRequired,
  onDeleteRow: PropTypes.func,
  isLoading: PropTypes.bool,
};

export default Index;
