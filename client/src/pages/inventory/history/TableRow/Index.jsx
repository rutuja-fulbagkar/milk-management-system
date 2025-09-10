import {
  MenuItem,
  Select
} from "@mui/material";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import moment from "moment";
import PropTypes from "prop-types";
import * as React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Iconify from "../../../../components/iconify";
import MenuPopover from "../../../../components/menu-popover/MenuPopover";
import { deleteInward, editInwardStatus, findInward } from "../../../../redux/slices/inward/inwardApi";
import { useDispatch } from "../../../../redux/store";
const Index = ({ row}) => {
  const dispatch = useDispatch();
  const [openPopover, setOpenPopover] = useState(null);


  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const deleteProductHandler = async (id) => {
    try {
      const response = await dispatch(deleteInward(id));
      if (response?.payload?.success) {
        await dispatch(findInward());
      }
    } catch (error) {
      console.error("Failed to deactivate:", error);
    } finally {
      handleClosePopover();
    }
  };

  const handleChangeStatus = async (newStatus) => {
    const payload = {
      paramsId: row._id,
      data: {
        status: newStatus,
      },
    };

    try {
      const response = await dispatch(editInwardStatus(payload));
      if (response?.payload?.success) {
        await dispatch(findInward());
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };



  return (
    <>
      <TableRow
        hover
        sx={{ cursor: "pointer" }}
      >
        <TableCell padding="checkbox" />
        <TableCell>
          {row?.inWardQty || 0}
        </TableCell>
        <TableCell> {moment(row?.inWardQtyDate).isValid()
          ? moment(row.inWardQtyDate).format("DD/MM/YY")
          : "-"}
        </TableCell>
        <TableCell>
          {row?.outWardQty || 0}
        </TableCell>
        <TableCell>
          {moment(row?.outWardQtyDate).isValid() ? moment(row?.outWardQtyDate).format('DD/MM/YY hh:mm A') : '-'}
        </TableCell>
        <TableCell>
          {row?.closingStock || 0}
        </TableCell>
        <TableCell>
          <Select
            size="small"
            value={row?.status}
            onChange={(e) => handleChangeStatus(e.target.value)}
            disabled={row?.status === "In Stock"}
            displayEmpty
            fullWidth
          >
            <MenuItem value="In Stock">
              <span className="status-badge status-approved"></span>
              In Stock
            </MenuItem>
            <MenuItem value="Out of Stock">
              <span className="status-badge status-pending"></span>
              Out of Stock
            </MenuItem>
            <MenuItem value="Low Stock">
              <span className="status-badge status-rejected"></span>
              Low Stock
            </MenuItem>
          </Select>
        </TableCell>
        <TableCell>
          {row?.userId ? `${row?.userId?.firstName} ${row?.userId?.lastName}` : '-'}
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
        <Link
          to={`/inward-outward-request/inward/view/${row?._id}`}
          state={{ ...row }}
        >
          <MenuItem>
            <Iconify icon="eva:eye-outline" />
            View
          </MenuItem>
        </Link>
        {(row?.status === "Pending") && (
          <Link to={`/inward-outward-request/inward/edit/${row?._id}`} state={{ ...row }}>
            <MenuItem>
              <Iconify icon="eva:edit-fill" />
              Edit
            </MenuItem>
          </Link>
        )}

        <MenuItem
          onClick={() => {
            deleteProductHandler(row?._id);
            handleClosePopover();
          }}
          sx={{ color: "error.main" }}
        >
          <Iconify icon="eva:trash-2-outline" />
          Delete
        </MenuItem>
      </MenuPopover>

    </>
  );
};

Index.propTypes = {
  row: PropTypes.object.isRequired,
};

export default Index;
