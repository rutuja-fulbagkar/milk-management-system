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
import ExcelToJsonConverterCM from "../../components/extra/ExcelToJsonConverterCM";
import { getComparator } from "../../components/table/AscenDesc";
import CustumTableHead from "../../components/table/CustumTableHead";
import ResponsivePaperWrapper from "../../components/table/ResponsivePaperWrapper";
import TableNoData from "../../components/table/TableNoData";
import TablePaginationCustom from "../../components/table/TablePaginationCustom";
import { findInquiry } from "../../redux/slices/contactInquiry/contactInquiryApi";
import {
  setCurrentPage,
  setLimit,
  setSkip,
} from "../../redux/slices/contactInquiry/contactInquirySlice";
import { useDispatch, useSelector } from "../../redux/store";
import Index from "./TableRow/Index";
import Filters from "./Filter/Index";
import Iconify from "../../components/iconify";

const TABLE_HEAD = [
  { id: "firstName", label: "First Name", numeric: false, disablePadding: true },
  { id: "lastName", label: "Last Name", numeric: false, disablePadding: true },
  { id: "email", label: "Email", numeric: false, disablePadding: true },
  { id: "mobile", label: "Mobile", numeric: false, disablePadding: true },
  { id: "remarks", label: "Remarks", numeric: false, disablePadding: true },
  { id: "createdAt", label: "Created At", numeric: false, disablePadding: true },
  { id: "updatedAt", label: "Updated At", numeric: false, disablePadding: true },
  // { id: "actions", label: "Actions", numeric: false, disablePadding: true },
];

const ContactInquiry = () => {
  const [order, setOrder] = React.useState("desc");
  const [orderBy, setOrderBy] = React.useState("createdAt");
  const [selected, setSelected] = React.useState([]);
  const [dense, setDense] = React.useState(false);
  const dispatch = useDispatch();
  const [openImportModale, setOpenImportModale] = React.useState(false);
  const [arrayData, setArrayData] = React.useState([]);
  const [jsonData, setJsonData] = React.useState(null);

  const {
    data: inquiryData,
    limit,
    currentPage,
    totalEntries,
    isLoading,
  } = useSelector((state) => state.inquiry);

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
    dispatch(findInquiry({ limit, page: currentPage }));
  }, [dispatch, limit, currentPage]);

  const handleRequestSort = React.useCallback((event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  }, [order, orderBy]);

  const handleSelectAllClick = React.useCallback((event) => {
    if (event.target.checked) {
      const newSelected = inquiryData.map((n) => n._id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  }, [inquiryData]);

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

  const isNotFound = !inquiryData?.length;

  const visibleRows = React.useMemo(() => {
    return [...inquiryData].sort(getComparator(order, orderBy));
  }, [inquiryData, order, orderBy]);

  const handleExport = React.useCallback(() => {
    const exportData = inquiryData.map((product) => ({
      "First Name": product.firstName || "-",
      "Last Name": product.lastName || "-",
      "Email": product.email || "-",
      "Mobile": product.mobile || "-",
      "Remarks": product.remarks || "-",
      "Created At": moment(product.createdAt).isValid()
        ? moment(product.createdAt).format('DD/MM/YY hh:mm A')
        : "-",
      "Updated At": moment(product.updatedAt).isValid()
        ? moment(product.updatedAt).format('DD/MM/YY hh:mm A')
        : "-"

    }));



    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Contact_Inquiries");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(data, "Contact_Inquiries.xlsx");
  }, [inquiryData]);

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
      await dispatch(findInquiry({ limit, page: currentPage }));
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
    dispatch(findInquiry({ limit, page: currentPage, filters: newFilters }));
  }, [dispatch, limit, currentPage]);

  React.useEffect(() => {
    dispatch(findInquiry({ limit, page: currentPage, filters: filter }));
  }, [dispatch, limit, currentPage, filter]);

  return (
    <>
     <Helmet>
        <title>Contact Inquiries</title>
      </Helmet>
      <Box className="w-full px-2 sm:px-6 lg:px-8">
        <ResponsivePaperWrapper>
          <Box className="w-full py-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <h1 className="text-md md:text-2xl text-gray-700 dark:text-gray-100 font-bold">Contact Inquiries</h1>
            <div className="flex flex-col sm:flex-row items-center gap-2 mt-2 sm:mt-0">
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
        </ResponsivePaperWrapper>
      </Box>
      {/* <div className="flex flex-col sm:flex-row items-center gap-2 mt-2 sm:mt-0">
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
            </div> */}
      <Box className="w-full px-2 sm:px-6 lg:px-8 py-8 max-w-9xl mx-auto">
        <Paper sx={{ mb: 2 }}>
          <Filters
            filter={filter}
            setFilter={setFilter}
            onFilterChange={handleFilterChange}
            numSelected={selected.length}
            totalEntries={totalEntries}
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
                rowCount={inquiryData.length}
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

export default React.memo(ContactInquiry);
