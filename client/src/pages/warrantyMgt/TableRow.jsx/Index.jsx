import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Box, Checkbox, IconButton, MenuItem, Typography } from "@mui/material";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import moment from "moment";
import PropTypes from "prop-types";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Iconify from "../../../components/iconify";
import MenuPopover from "../../../components/menu-popover/MenuPopover";

const Index = ({ row, isItemSelected, labelId }) => {
  const navigate = useNavigate();
  const [openPopover, setOpenPopover] = useState(null);

  const handleOpenPopover = (event, _) => {
    setOpenPopover(event.currentTarget);
  };
  const handleClosePopover = () => {
    setOpenPopover(null);
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
          onClick={() => navigate(`/warrantyMgt/view/${row?._id}`)}
        >
          {row?.warrantyId}
        </TableCell>
        <TableCell
          onClick={() =>
            navigate(`/company/view/${row?.order_id?.companyId?._id}`)
          }
        >
          {row?.order_id?.companyId?.companyName || "-"}
        </TableCell>
        <TableCell onClick={() => navigate(`/warrantyMgt/view/${row?._id}`)}>
          {row?.order_id?.siteId?.siteName || "-"}
        </TableCell>
        <TableCell onClick={() => navigate(`/warrantyMgt/view/${row?._id}`)}>
          {row?.order_id?.billNumber || "-"}
        </TableCell>
        <TableCell onClick={() => navigate(`/warrantyMgt/view/${row?._id}`)}>
          {row?.warrantyStartDate
            ? `${moment(row.warrantyStartDate).format("DD/MM/YYYY")} | ${
                row?.warrantyEndDate
                  ? moment(row.warrantyEndDate).format("DD/MM/YYYY")
                  : "-"
              }`
            : "-"}
        </TableCell>
        <TableCell onClick={() => navigate(`/warrantyMgt/view/${row?._id}`)}>
          {row?.numberOfServices || "-"}
        </TableCell>
        <TableCell>
          <Box
            sx={{
              display: "flex", 
              alignItems: "center", 
            }}
          >
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                backgroundColor: (() => {
                  switch (row?.status) {
                    case "Warranty":
                      return "yellow";
                    case "Request For AMC":
                      return "orange";
                    case "AMC":
                      return "blue";
                    case "Renew AMC":
                      return "red";
                    default:
                      return "gray";
                  }
                })(),
                display: "inline-block",
                marginRight: 1,
              }}
            />
            <Typography variant="body2">{row?.status}</Typography>
          </Box>
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
        <Link to={`/warrantyMgt/view/${row?._id}`} state={{ ...row }}>
          <MenuItem>
            <Iconify icon="eva:eye-outline" />
            View
          </MenuItem>
        </Link>
      </MenuPopover>
    </>
  );
};

Index.propTypes = {
  isItemSelected: PropTypes.bool.isRequired,
  labelId: PropTypes.string.isRequired,
  row: PropTypes.object.isRequired,
};

export default Index;
