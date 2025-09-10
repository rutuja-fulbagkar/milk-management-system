import CloseIcon from "@mui/icons-material/Close";
import { Button, Dialog, DialogTitle, IconButton } from "@mui/material";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Paper from "@mui/material/Paper";
import Switch from "@mui/material/Switch";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import { saveAs } from "file-saver";
import moment from "moment";
import * as React from "react";
import { Helmet } from "react-helmet-async";
import * as XLSX from "xlsx";
import ExcelToJsonConverterCM from "../../../components/extra/ExcelToJsonConverterCM";
import Iconify from "../../../components/iconify";
import { getComparator } from "../../../components/table/AscenDesc";
import CustumTableHead from "../../../components/table/CustumTableHead";
import TableNoData from "../../../components/table/TableNoData";
import TablePaginationCustom from "../../../components/table/TablePaginationCustom";
import { findInward } from "../../../redux/slices/inward/inwardApi";
import {
  setCurrentPage,
  setLimit,
  setSkip,
} from "../../../redux/slices/inward/inwardSlice";
import { useDispatch, useSelector } from "../../../redux/store";
import Index from "../inward/TableRow.jsx/Index";
import InOutFilter from "./Filter/InOutFilter";

const TABLE_HEAD = [
  { id: "requestId", label: "Request Id", numeric: false, disablePadding: true },
  { id: "requestDate", label: "Request Date", numeric: false, disablePadding: true },
  { id: "itemName", label: "Item Name / (Inward Qty)", numeric: false, disablePadding: true },
  { id: "requestType", label: "Request Type", numeric: false, disablePadding: true },
  { id: "storageLocation", label: "Storage Location", numeric: false, disablePadding: true },
  { id: "approvalStatus", label: "Approval Status", numeric: false, disablePadding: true },
  { id: "approvalStatusBy", label: "Approval By", numeric: false, disablePadding: true },
  { id: "approvedDate", label: "Approved Date", numeric: false, disablePadding: true },
  { id: "rejectedBy", label: "Rejected By", numeric: false, disablePadding: true },
  { id: "rejectionDate", label: "Rejected Date", numeric: false, disablePadding: true },
  { id: "createdAt", label: "Created At", numeric: false, disablePadding: true },
  { id: "updatedAt", label: "Updated At", numeric: false, disablePadding: true },
  { id: "actions", label: "Actions", numeric: false, disablePadding: true },
];

const InoutStock = () => {
  const [order, setOrder] = React.useState("desc");
  const [orderBy, setOrderBy] = React.useState("createdAt");
  const [selected, setSelected] = React.useState([]);
  const [dense, setDense] = React.useState(false);
  const dispatch = useDispatch();
  const [openImportModale, setOpenImportModale] = React.useState(false);
  const [arrayData, setArrayData] = React.useState([]);
  const [jsonData, setJsonData] = React.useState(null);

  const {
    data: inwardData,
    limit,
    currentPage,
    totalEntries,
    rejectedRequest,
    pendingRequest,
    approvedRequest,
    allItemsCount,
    isLoading,
  } = useSelector((state) => state.inward);

  const handlePageChange = React.useCallback((event, newPage) => {
    dispatch(setCurrentPage({ currentPage: newPage }));
    dispatch(setSkip({ skip: limit * newPage }));
    setSelected([]);
  }, [dispatch, limit]);

  const handleRowsPerPageChange = React.useCallback((event) => {
    const newLimit = parseInt(event.target.value, 10);
    dispatch(setLimit({ limit: newLimit }));
    dispatch(setCurrentPage({ currentPage: 0 }));
    dispatch(setSkip({ skip: 0 }));
    setSelected([]);
  }, [dispatch]);

  React.useEffect(() => {
    dispatch(findInward({ limit, page: currentPage }));
  }, [dispatch, limit, currentPage]);

  const handleRequestSort = React.useCallback((event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  }, [order, orderBy]);

  const handleSelectAllClick = React.useCallback((event) => {
    if (event.target.checked) {
      const newSelected = inwardData.map((n) => n._id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  }, [inwardData]);

  const handleClick = React.useCallback((event, id) => {
    setSelected((prevSelected) => {
      const selectedIndex = prevSelected.indexOf(id);
      let newSelected = [];

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(prevSelected, id);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(prevSelected.slice(1));
      } else if (selectedIndex === prevSelected.length - 1) {
        newSelected = newSelected.concat(prevSelected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          prevSelected.slice(0, selectedIndex),
          prevSelected.slice(selectedIndex + 1)
        );
      }
      return newSelected;
    });
  }, []);

  const handleChangeDense = React.useCallback((event) => {
    setDense(event.target.checked);
  }, []);

  const isNotFound = !inwardData?.length;

  const visibleRows = React.useMemo(() => {
    return [...inwardData].sort(getComparator(order, orderBy));
  }, [inwardData, order, orderBy]);

  const handleExport = React.useCallback(() => {
    const exportData = inwardData.map((product) => ({
      "Request Id": product.requestId || "-",
      "Request Date": moment(product.requestedDate).isValid()
        ? moment(product.requestedDate).format("DD/MM/YYYY")
        : "-",
      "Request Type": product.requestType || "-",
      "Item Name(s)": product.items
        ?.map((item) => item.itemId?.itemName || "-")
        .join(", ") || "-",
      "Item Code(s)": product.items?.map((item) => item.itemCode).join(", ") || "-",
      "Category(s)": product.items?.map((item) => item?.category?.categoryName).join(", ") || "-",
      "Inward Qty(s)": product.items
        ?.map((item) => `${item.quantity} ${item.unitType}`)
        .join(", ") || "-",
      "Storage Location": product.warehouseId?.location || "-",
      "Approval Status": product.status || "-",
      "Approved By": product.approvedBy
        ? `${product.approvedBy.firstName} ${product.approvedBy.lastName}`
        : "-" || "-",
      "Approved Date": moment(product.approvedDate).isValid()
        ? moment(product.approvedDate).format('DD/MM/YY hh:mm A')
        : "-",
      "Rejected By": product.rejectedBy
        ? `${product.rejectedBy.firstName} ${product.rejectedBy.lastName}`
        : "-" || "-",
      "Rejected Date": moment(product.rejectionDate).isValid()
        ? moment(product.rejectionDate).format('DD/MM/YY hh:mm A')
        : "-",
      "Created At": moment(product.createdAt).isValid() ? moment(product.createdAt).format('DD/MM/YY hh:mm A') : '-',
      "Updated At": moment(product.updatedAt).isValid() ? moment(product.updatedAt).format('DD/MM/YY hh:mm A') : '-',

    }));



    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inward");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(data, "Inward.xlsx");
  }, [inwardData]);

  const IMPORT_HEAD_DATA = React.useMemo(() =>
    TABLE_HEAD.filter((item) => item.label !== "Action").map((item) => item.label), []
  );

  const camelCase = (str) =>
    str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
        index === 0 ? word.toLowerCase() : word.toUpperCase()
      )
      .replace(/\s+/g, "");

  const handleSubmit = React.useCallback(async () => {
    const payload = [];
    for (let i = 1; i < arrayData[0].length; i += 1) {
      const obj = {};

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
            obj[key] = parsedDate.isValid()
              ? parsedDate.format("YYYY-MM-DD")
              : row[i];
          } else {
            obj[key] = row[i];
          }
        }
      });

      if (Object.keys(obj).length > 0) {
        payload.push(obj);
      }
    }

    const response = await dispatch(createInventorybyImportExl(payload));
    if (response?.payload?.success) {
      handleCloseImportModal();
      await dispatch(findInward({ limit, page: currentPage }));
    }
  }, [arrayData, dispatch, currentPage, limit]);

  const handleCloseImportModal = React.useCallback(() => {
    setOpenImportModale(false);
  }, []);

  const [filter, setFilter] = React.useState({
    status: "",
    timeRange: "monthly",
    search: "",
    startDate: null,
    endDate: null,
  });

  const handleFilterChange = React.useCallback((newFilters) => {
    dispatch(findInward({ limit, page: currentPage, filters: newFilters }));
  }, [dispatch, limit, currentPage]);

  React.useEffect(() => {
    dispatch(findInward({ limit, page: currentPage, filters: filter }));
  }, [dispatch, limit, currentPage, filter]);

  return (
    <>
      <Helmet>
        <title> Inward/Outward Request</title>
      </Helmet>
      <Box className="flex items-center justify-between mb-4">
        <h1 className="text-md md:text-2xl text-gray-700 dark:text-gray-100 font-bold">
          Inward Request
        </h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outlined"
            onClick={handleExport}
            startIcon={<Iconify icon="ic:baseline-download" />}
            className="text-nowrap"
          >
            Export
          </Button>
        </div>
      </Box>

      <Box>
        <Paper sx={{ mb: 2 }}>
          <InOutFilter
            filter={filter}
            setFilter={setFilter}
            onFilterChange={handleFilterChange}
            numSelected={selected.length}
            rejectedRequest={rejectedRequest}
            pendingRequest={pendingRequest}
            approvedRequest={approvedRequest}
            totalEntries={totalEntries}
            allItemsCount={allItemsCount}
          />

          <TableContainer className="overflow-x-auto">
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={dense ? "small" : "medium"}
            >
              <CustumTableHead
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={inwardData.length}
                headCells={TABLE_HEAD}
              />
              <TableBody>
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
          Import Inventory
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
};

export default React.memo(InoutStock);
