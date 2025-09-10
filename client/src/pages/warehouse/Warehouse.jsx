import {
  Box,
  Button,
  FormControlLabel,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow
} from "@mui/material";
import { saveAs } from "file-saver";
import moment from "moment";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import Iconify from "../../components/iconify";
import { getComparator } from "../../components/table/AscenDesc";
import CustumTableHead from "../../components/table/CustumTableHead";
import ResponsivePaperWrapper from "../../components/table/ResponsivePaperWrapper";
import TableNoData from "../../components/table/TableNoData";
import TablePaginationCustom from "../../components/table/TablePaginationCustom";
import TableToolbar from "../../components/table/TableToolbar";
import {
  archiveManyWarehouse,
  findwarehouse
} from "../../redux/slices/warehouse/warehouseApi";
import {
  setCurrentPage,
  setLimit,
  setSkip,
} from "../../redux/slices/warehouse/warehouseSlice";
import { useDispatch, useSelector } from "../../redux/store";
import Index from "./TableRow.jsx/Index";
import VendorToggleButton from "./archiveToggleBtn/ToggleButton";

const TABLE_HEAD = [
  { id: "name", label: "Name", numeric: false, disablePadding: true },
  {
    id: "warehouseMaintainer",
    label: "Maintainer",
    numeric: false,
    disablePadding: true,
  },
  { id: "location", label: "Location", numeric: false, disablePadding: true },
  { id: "status", label: "Status", numeric: false, disablePadding: true },
  {
    id: "createdAt",
    label: "Created At",
    numeric: false,
    disablePadding: true,
  },
  {
    id: "updatedAt",
    label: "Updated At",
    numeric: false,
    disablePadding: true,
  },
  { id: "action", label: "Action", numeric: false, disablePadding: true },
];

export default function Warehouse() {
  const navigate = useNavigate();
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("createdAt");
  const [selected, setSelected] = useState([]);
  const [dense, setDense] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const dispatch = useDispatch();
  const {
    data: warehouseData,
    limit,
    currentPage,
    totalEntries,
    isLoading,
  } = useSelector((state) => state.warehouse);

  const handlePageChange = useCallback((event, newPage) => {
    dispatch(setCurrentPage({ currentPage: newPage }));
    dispatch(setSkip({ skip: limit * newPage }));
    setSelected([]);
  }, [dispatch, limit]);

  const handleRowsPerPageChange = useCallback((event) => {
    const newLimit = parseInt(event.target.value, 10);
    dispatch(setLimit({ limit: newLimit }));
    dispatch(setCurrentPage({ currentPage: 0 }));
    dispatch(setSkip({ skip: 0 }));
    setSelected([]);
  }, [dispatch]);

  useEffect(() => {
    dispatch(findwarehouse({ limit, page: currentPage, search: searchQuery, isArchived: false }));
  }, [dispatch, limit, currentPage, searchQuery]);

  const handleRequestSort = useCallback((event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  }, [order, orderBy]);

  const handleSelectAllClick = useCallback((event) => {
    if (event.target.checked) {
      const newSelected = warehouseData.map((n) => n._id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  }, [warehouseData]);

  const handleClick = useCallback((event, id) => {
    setSelected((prevSelected) => {
      const selectedIndex = prevSelected.indexOf(id);
      if (selectedIndex === -1) {
        return [...prevSelected, id];
      } else {
        return prevSelected.filter((item) => item !== id);
      }
    });
  }, []);

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isNotFound = !warehouseData || warehouseData.length === 0;

  const visibleRows = useMemo(() => {
    return [...warehouseData].sort(getComparator(order, orderBy));
  }, [warehouseData, order, orderBy]);

  const handleExport = useCallback(() => {
    const exportData = warehouseData.map((user) => ({
      Name: user?.name,
      Maintainer:
        `${user?.supervisor?.firstName || ""} ${user?.supervisor?.lastName || ""
          }`.trim() || "-",
      Location: user?.location,
      Status: user?.status,
      CreatedAt: moment(user?.createdAt).isValid() ? moment(user?.createdAt).format('DD/MM/YY hh:mm A') : '-',
      UpdatedAt: moment(user?.updatedAt).isValid() ? moment(user?.updatedAt).format('DD/MM/YY hh:mm A') : '-',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Warehouse");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const dataBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(dataBlob, "Warehouse.xlsx");
  }, [warehouseData]);

  const view = 'warehouse';
  const handleChangeView = useCallback((event, newView) => {
    if (newView === 'warehouse') {
      navigate('/warehouse');
    }
    if (newView === 'archived') {
      navigate('/warehouse/archived');
    }
  }, [navigate]);

  // Archive
  const handleArchive = useCallback(async () => {
    if (selected.length > 0) {
      const payload = {
        warehouseArray: selected
      }
      const res = await dispatch(archiveManyWarehouse(payload));
      if (res?.payload?.success) {
        setSelected([]);
        await dispatch(findwarehouse({ isArchived: false }));
      }
    }
  }, [dispatch, selected]);

  return (
    <>
      <Helmet>
        <title>Warehouse</title>
      </Helmet>
      <Box className="w-full px-2 sm:px-6 lg:px-8">
        <ResponsivePaperWrapper>
          <Box className="w-full py-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <h1 className="text-md md:text-2xl text-gray-700 dark:text-gray-100 font-bold">
              Warehouse
            </h1>

            <div className="flex flex-col sm:flex-row items-center gap-2 mt-2 sm:mt-0">
              <Button
                variant="outlined"
                onClick={handleExport}
                startIcon={<Iconify icon="ic:baseline-download" />}
                className="text-nowrap"
              >
                Export
              </Button>
              <Button
                component={RouterLink}
                to="/warehouse/new"
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
                className="text-nowrap"
              >
                Add Warehouse
              </Button>
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
            onArchive={handleArchive} />
          <TableContainer className="overflow-x-auto">
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={dense ? "small" : "medium"}
            >
              <CustumTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={totalEntries}
                headCells={TABLE_HEAD}
              />
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {visibleRows.map((row, index) => {
                      const isItemSelected = selected.includes(row._id);
                      const labelId = `enhanced-table-checkbox-${index}`;
                      return (
                        <Index
                          isItemSelected={isItemSelected}
                          labelId={labelId}
                          row={row}
                          key={row._id}
                          handleClick={handleClick}
                          isLoading={isLoading}
                        />
                      );
                    })}

                    <TableNoData isNotFound={isNotFound} />
                  </>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePaginationCustom
            count={totalEntries}
            page={currentPage}
            rowsPerPage={limit}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            dense={dense}
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
