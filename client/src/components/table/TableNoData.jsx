import PropTypes from "prop-types";
import { TableRow, TableCell } from "@mui/material";
import EmptyContent from "../../components/table/empty-content/EmptyContent";

TableNoData.propTypes = {
  isNotFound: PropTypes.bool,
  height: PropTypes.number,
};

export default function TableNoData({ isNotFound, height }) {
  return (
    <TableRow className="!w-full">
      {isNotFound ? (
        <TableCell colSpan={50} className="!w-full">
          <EmptyContent
            title="No Data Found"
            sx={{
              "& span.MuiBox-root": { height: height || 160 },
            }}
          />
        </TableCell>
      ) : (
        <TableCell colSpan={12} sx={{ p: 0 }} />
      )}
    </TableRow>
  );
}
