import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Dialog,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow
} from "@mui/material";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ExcelToJsonConverterCM from "../../../components/extra/ExcelToJsonConverterCM";
import { getComparator } from "../../../components/table/AscenDesc";
import CustumTableHead from "../../../components/table/CustumTableHead";
import ResponsivePaperWrapper from "../../../components/table/ResponsivePaperWrapper";
import TableNoData from "../../../components/table/TableNoData";
import TablePaginationCustom from "../../../components/table/TablePaginationCustom";
import TableToolbar from "../../../components/table/TableToolbar";
import {
  archiveManyWarehouse,
  createWarehousebyImportExl,
  findwarehouse,
} from "../../../redux/slices/warehouse/warehouseApi";
import {
  setCurrentPage,
  setLimit,
  setSkip,
} from "../../../redux/slices/warehouse/warehouseSlice";
import { useDispatch, useSelector } from "../../../redux/store";
import VendorToggleButton from "../archiveToggleBtn/ToggleButton";
import Index from "./TableRow.jsx/Index";

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

export default function WarehouseArchive() {
  const navigate = useNavigate();
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("createdAt");
  const [selected, setSelected] = useState([]);
  const [dense, setDense] = useState(false);
  const [openImportModale, setOpenImportModale] = useState(false);
  const [arrayData, setArrayData] = useState([]);
  const [jsonData, setJsonData] = useState(null);
  const [searchQuery, setSearchQuery] = React.useState("");

  const dispatch = useDispatch();
  const {
    data: warehouseData,
    limit,
    currentPage,
    totalEntries,
    isLoading,
  } = useSelector((state) => state.warehouse);

  const companyId = {
    _id: "6835bec49c154a43b7eb4fab",
    companyName: "Yash World products Pvt Ltd..",
    contactName: "Rajesh Kumar",
    emailId: "rajesh@techsolutions.com",
  };

  const handlePageChange = (event, newPage) => {
    dispatch(setCurrentPage({ currentPage: newPage }));
    dispatch(setSkip({ skip: limit * newPage }));
    setSelected([]);
  };

  const handleRowsPerPageChange = (event) => {
    const newLimit = parseInt(event.target.value, 10);
    dispatch(setLimit({ limit: newLimit }));
    dispatch(setCurrentPage({ currentPage: 0 }));
    dispatch(setSkip({ skip: 0 }));
    setSelected([]);
  };

  useEffect(() => {
    dispatch(findwarehouse({ limit, page: currentPage, search: searchQuery, isArchived: true }));
  }, [dispatch, limit, currentPage, searchQuery]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = warehouseData.map((n) => n._id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isNotFound = !warehouseData || warehouseData.length === 0;

  const visibleRows = useMemo(() => {
    return [...warehouseData].sort(getComparator(order, orderBy));
  }, [warehouseData, order, orderBy]);

  const IMPORT_HEAD_DATA = TABLE_HEAD.filter(
    (item) => item.label !== "Action"
  ).map((item) => item.label);

  const camelCase = (str) =>
    str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
        index === 0 ? word.toLowerCase() : word.toUpperCase()
      )
      .replace(/\s+/g, "");

  const handleSubmit = async () => {
    const payload = [];
    for (let i = 1; i < arrayData[0].length; i += 1) {
      const obj = {};
      const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
      arrayData.forEach((row) => {
        const key = camelCase(row[0]);
        if (row[i]) {
          if (key === "createdAt" || key === "updatedAt") {
            const parsedDate = moment(row[i], [
              "DD/MM/YY",
              "DD/MM/YYYY",
              "YYYY-MM-DD",
              moment.ISO_8601,
            ]);
            obj[key] = currentDate;
          } else {
            obj[key] = row[i];
          }
        }
      });

      obj.companyId = companyId;

      if (Object.keys(obj).length > 0) {
        payload.push(obj);
      }
    }

    const response = await dispatch(createWarehousebyImportExl(payload));
    if (response?.payload?.success) {
      handleCloseImportModal();
      await dispatch(findwarehouse());
    }
  };

  const handleCloseImportModal = () => {
    setOpenImportModale(false);
  };

  const view = 'warehouse';
  const handleChangeView = (event, newView) => {
    if (newView === 'warehouse') {
      navigate('/warehouse');
    }
    if (newView === 'archived') {
      navigate('/warehouse');
    } else {
      navigate('/warehouse');
    }
  };


  const handleArchive = async () => {
    if (selected.length > 0) {
      const payload = {
        warehouseArray: selected
      }
      const res = await dispatch(archiveManyWarehouse(payload))
      if (res?.payload?.success) {
        setSelected([]);
        await dispatch(findwarehouse({ isArchived: true }));
      }
    }
  }


  return (
    <>
      <Box className="w-full px-2 sm:px-6 lg:px-8  ">
        <ResponsivePaperWrapper>
          <Box className="w-full py-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <h1 className="text-md md:text-2xl text-gray-700 dark:text-gray-100 font-bold">
              Warehouse Archive
            </h1>

            <div className="flex flex-col sm:flex-row items-center gap-2 mt-2 sm:mt-0">

              <VendorToggleButton value={view} onChange={handleChangeView} />
            </div>
          </Box>
        </ResponsivePaperWrapper>
      </Box>
      <Box className="w-full px-2 sm:px-6 lg:px-8 py-8 max-w-9xl mx-auto">
        <Paper sx={{ mb: 2 }}>
          <TableToolbar numSelected={selected.length}
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
      <Dialog
        fullWidth
        maxWidth="sm"
        open={openImportModale}
        onClose={handleCloseImportModal}
      >
        <DialogTitle>
          Import Warehouse
          <IconButton
            aria-label="close"
            onClick={handleCloseImportModal}
            style={{ position: "absolute", right: "10px", top: "15px" }}
          >
            <CloseIcon style={{ fontSize: "20px" }} />
          </IconButton>
        </DialogTitle>

        <ExcelToJsonConverterCM
          headingData={IMPORT_HEAD_DATA}
          handleSubmit={handleSubmit}
          arrayData={arrayData}
          setArrayData={setArrayData}
          jsonData={jsonData}
          setJsonData={setJsonData}
        />
      </Dialog>
    </>
  );
}
