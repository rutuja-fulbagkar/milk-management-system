import MoreVertIcon from "@mui/icons-material/MoreVert";
import { LoadingButton } from "@mui/lab";
import { IconButton, MenuItem } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import PropTypes from "prop-types";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ConfirmDialog from "../../../components/confirm-dialog";
import Iconify from "../../../components/iconify";
import MenuPopover from "../../../components/menu-popover/MenuPopover";
import moment from "moment";

const Index = ({ row, isItemSelected, labelId, onDeleteRow, isLoading }) => {
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
          onClick={() => navigate(`/company/view/${row?._id}`)}
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
          onClick={() => navigate(`/company/view/${row?._id}`)}
        >
          {row?.companyName || "-"}
        </TableCell>
        <TableCell onClick={() => navigate(`/company/view/${row?._id}`)}>
          {row?.contactName || "-"}
        </TableCell>
        <TableCell onClick={() => navigate(`/company/view/${row?._id}`)}>
          {row?.contactNumber || "-"}
        </TableCell>
        <TableCell onClick={() => navigate(`/company/view/${row?._id}`)}>
          {row?.city || "-"}
        </TableCell>
        <TableCell onClick={() => navigate(`/company/view/${row?._id}`)}>
          {row?.siteCount || "-"}
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
        <Link to={`/company/edit/${row?._id}`} state={{ ...row }}>
          <MenuItem>
            <Iconify icon="eva:edit-fill" />
            Edit
          </MenuItem>
        </Link>

        <Link to={`/company/view/${row?._id}`} state={{ ...row }}>
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
  onDeleteRow: PropTypes.func,
  fetchData: PropTypes.func.isRequired,
  labelId: PropTypes.string.isRequired,
  row: PropTypes.object.isRequired,
  isLoading: PropTypes.bool,
};

export default Index;
