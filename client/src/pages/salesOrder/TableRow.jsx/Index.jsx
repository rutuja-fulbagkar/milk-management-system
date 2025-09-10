import MoreVertIcon from "@mui/icons-material/MoreVert";
import { LoadingButton } from "@mui/lab";
import {
  Badge,
  Box,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  styled,
  Typography,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import moment from "moment";
import PropTypes from "prop-types";
import { useState } from "react";
import { AiTwotoneSchedule } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import ConfirmDialog from "../../../components/confirm-dialog";
import Iconify from "../../../components/iconify";
import MenuPopover from "../../../components/menu-popover/MenuPopover";
import { useDispatch } from "react-redux";
import {
  editSalesOrders,
  findsalesOrders,
} from "../../../redux/slices/salesOrder/salesOrderApi";
import SetServiceScheduleDialog from "../create/SetServiceScheduleDialog";
import { toast } from "react-toastify";

const statusOptions = ["Pending", "InProgress", "Completed", "Delayed"];

const StyledBadge = styled(Badge)(({ theme, badgecolor }) => ({
  "& .MuiBadge-badge": {
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "4px 9px",
    fontSize: "0.8rem",
    fontWeight: "bold",
    height: "auto",
    minWidth: "auto",
    color: "#fff",
    backgroundColor: badgecolor,
  },
}));

const StatusCircle = styled("div")(({ color }) => ({
  width: "15px",
  height: "15px",
  borderRadius: "50%",
  backgroundColor: color,
  display: "inline-block",
  marginRight: "8px",
}));

const Index = ({ row, isItemSelected, onDeleteRow, isLoading }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openServiceScheduleDialog, setOpenServiceScheduleDialog] =
    useState(false);
  const [selectedStatus, setSelectedStatus] = useState(
    row?.status || "Pending"
  );
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

  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;

    if (newStatus !== selectedStatus) {
      setSelectedStatus(newStatus);

      const data = {
        paramsId: row?._id,
        data: { status: newStatus },
      };

      try {
        const response = await dispatch(editSalesOrders(data));

        if (response?.payload?.success) {
          await dispatch(findsalesOrders());
        }  
      } catch (error) {
        toast.error("Failed to update status");
      }
    }
  };

  let displayValue;
  let badgeContent;

  if (
    row?.numberOfCoolersPurchased === 0 ||
    row?.numberOfCoolersPurchased === null
  ) {
    displayValue = row?.numberOfCoolersForService || "-";
    badgeContent = "AdHoc";
  } else if (
    row?.numberOfCoolersForService === 0 ||
    row?.numberOfCoolersForService === null
  ) {
    displayValue = row?.numberOfCoolersPurchased || "-";
    badgeContent = "InHouse";
  } else {
    displayValue = row?.numberOfCoolersPurchased || "-";
    badgeContent = "InHouse";
  }

  let badgeColor = "primary";
  if (badgeContent === "InHouse") {
    badgeColor = "#0b70a8";
  } else if (badgeContent === "AdHoc") {
    badgeColor = "#83bd47";
  }

  const StyledSelect = styled(Select)(({ theme }) => ({
    height: "40px",
    fontSize: "14px",
    "& .MuiSelect-select": {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
  }));

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
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
          onClick={() => navigate(`/salesOrder/view/${row?._id}`)}
        >
          <Box>
            <Typography variant="body2">{row?.billNumber}</Typography>
            {row?.serviceScheduled && (
              <Chip
                label="Service Scheduled"
                size="small"
                sx={{
                  mt: 0.5,
                  padding: "2px 6px",
                  fontSize: "10px",
                  fontWeight: "bold",
                  height: "auto",
                  minWidth: "auto",
                  color: "#fff",
                  backgroundColor: "#223a4a",
                }}
              />
            )}
          </Box>
        </TableCell>

        <TableCell
          onClick={() => navigate(`/company/view/${row?.companyId?._id}`)}
        >
          {row?.companyId?.companyName || "-"}
        </TableCell>
        <TableCell onClick={() => navigate(`/salesOrder/view/${row?._id}`)}>
          {row?.siteId?.siteName || "-"}
        </TableCell>
        <TableCell onClick={() => navigate(`/salesOrder/view/${row?._id}`)}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Box sx={{ marginBottom: "10px" }}>{displayValue}</Box>
            {badgeContent && (
              <StyledBadge
                badgeContent={badgeContent}
                badgecolor={badgeColor}
              />
            )}
          </Box>
        </TableCell>
        <TableCell>
          {row?.purchaseDate
            ? moment(row.purchaseDate).format("DD/MM/YYYY")
            : "-"}
        </TableCell>

        <TableCell>
          <FormControl fullWidth>
            <StyledSelect
              value={selectedStatus}
              onChange={handleStatusChange}
              displayEmpty
              disabled={isLoading || row?.status === "Completed"}
              inputProps={{ "aria-label": "Without label" }}
            >
              {statusOptions.map((status) => (
                <MenuItem key={status} value={status}>
                  <Box display="flex" alignItems="center">
                    <StatusCircle
                      color={
                        status === "Pending"
                          ? "#FD7E14"
                          : status === "Completed"
                          ? "#198754"
                          : status === "InProgress"
                          ? "#0D6EFD"
                          : status === "Delayed"
                          ? "#DC3545"
                          : "transparent"
                      }
                    />
                    {status}
                  </Box>
                </MenuItem>
              ))}
            </StyledSelect>
          </FormControl>
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
      <SetServiceScheduleDialog
        open={openServiceScheduleDialog}
        onClose={() => setOpenServiceScheduleDialog(false)}
        row={row}
      />
      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{
          width: "auto",
        }}
      >
        {row?.status === "Pending" && (
          <Link to={`/salesOrder/edit/${row?._id}`} state={{ ...row }}>
            <MenuItem>
              <Iconify icon="eva:edit-fill" />
              Edit
            </MenuItem>
          </Link>
        )}
        <Link to={`/salesOrder/view/${row?._id}`} state={{ ...row }}>
          <MenuItem>
            <Iconify icon="eva:eye-outline" />
            View
          </MenuItem>
        </Link>
        {row?.status === "Completed" && row?.serviceScheduled === false && (
          <MenuItem
            onClick={() => {
              setOpenServiceScheduleDialog(true);
              handleClosePopover();
            }}
          >
            <AiTwotoneSchedule />
            Set Service Schedule
          </MenuItem>
        )}

        {row?.status === "Pending" && (
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
  row: PropTypes.object.isRequired,
  onDeleteRow: PropTypes.func,
  isLoading: PropTypes.bool,
};

export default Index;
