import {
  Box,
  FormControlLabel,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingContent from "../../../components/table/empty-content/loadingContent";
import ResponsivePaperWrapper from "../../../components/table/ResponsivePaperWrapper";
import TableNoData from "../../../components/table/TableNoData";
import TableToolbar from "../../../components/table/TableToolbar";
import { finduser } from "../../../redux/slices/user/userApi";
import { useDispatch, useSelector } from "../../../redux/store";
import VendorToggleButton from "../archiveToggleBtn/ToggleButton";
import Index from "./TableRow.jsx/Index";

export default function UserArchive() {
  const location = useLocation();
  const view = location.pathname.includes("list") ? "list" : "archived";
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);
  const [dense, setDense] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const dispatch = useDispatch();
  const {
    data: warehouseData,
    totalRecords,
    isLoading,
  } = useSelector((state) => state.users);

  const fetchData = React.useCallback(async () => {
    const payload = {
      page: page,
      limit: rowsPerPage,
      isArchived: true,
      search: searchQuery,
    };
    dispatch(finduser(payload));
  }, [page, rowsPerPage, dispatch, searchQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isNotFound = !warehouseData || warehouseData.length === 0;

  const handleChangeView = (event, newView) => {
    if (newView === "staff") {
      navigate("/user");
    }
    if (newView === "archived") {
      navigate("/user");
    } else {
      navigate("/user");
    }
  };
  return (
    <>
      <Box className="w-full px-2 sm:px-6 lg:px-8  ">
        <ResponsivePaperWrapper>
          <Box className="w-full py-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <Typography
              variant="h5"
              fontWeight="bold"
              className="libre-baskerville-regular !text-[35px]"
            >
              Staff Archeive
            </Typography>

            <div className="flex flex-col sm:flex-row items-center gap-2 mt-2 sm:mt-0">
              <VendorToggleButton value={view} onChange={handleChangeView} />
            </div>
          </Box>
        </ResponsivePaperWrapper>
      </Box>
      <Box className="w-full px-2 sm:px-6 lg:px-8 py-8 max-w-9xl mx-auto">
        <Paper sx={{ mb: 2 }}>
          <TableToolbar
            numSelected={selected.length}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          <TableContainer className="overflow-x-auto">
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={dense ? "small" : "medium"}
            >
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell>&nbsp;</TableCell>
                  <TableCell>Employee Code</TableCell>
                  <TableCell>Staff Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Contact Number</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Login</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!isLoading ? (
                  warehouseData?.map((row, index) => {
                    const isItemSelected = selected.includes(row.id);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <Index
                        isLoading={isLoading}
                        isItemSelected={isItemSelected}
                        labelId={labelId}
                        fetchData={fetchData}
                        onDeleteRow={() => handleDeleteRow(row?._id)}
                        row={row}
                        key={row._id}
                      />
                    );
                  })
                ) : (
                  <LoadingContent />
                )}
                {!isLoading && <TableNoData isNotFound={isNotFound} />}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={totalRecords || 5}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        <FormControlLabel
          control={<Switch checked={dense} onChange={handleChangeDense} />}
          label="Dense padding"
        />
      </Box>
    </>
  );
}
