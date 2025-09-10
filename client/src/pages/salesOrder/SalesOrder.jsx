import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import { Helmet } from "react-helmet-async";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {
  Button,
  Card,
  Dialog,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Switch,
  Tab,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { saveAs } from "file-saver";
import * as React from "react";
import { CiTimer } from "react-icons/ci";
import { GrInProgress } from "react-icons/gr";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { MdOutlinePendingActions } from "react-icons/md";
import { Link as RouterLink } from "react-router-dom";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import ExcelToJsonConverterCM from "../../components/extra/ExcelToJsonConverterCM";
import Iconify from "../../components/iconify";
import CustumTableHead from "../../components/table/CustumTableHead";
import LoadingContent from "../../components/table/empty-content/loadingContent";
import ResponsivePaperWrapper from "../../components/table/ResponsivePaperWrapper";
import TableNoData from "../../components/table/TableNoData";
import {
  createSalesOrderbyexcel,
  findsalesOrders,
} from "../../redux/slices/salesOrder/salesOrderApi";
import { useDispatch, useSelector } from "../../redux/store";
import { api } from "../../utils/api";
import Index from "./TableRow.jsx/Index";

const TABLE_HEAD = [
  {
    id: "billNumber",
    label: "Sales Order Number",
    numeric: false,
    disablePadding: true,
  },
  {
    id: "companyName",
    label: "Company Name",
    numeric: false,
    disablePadding: true,
  },
  {
    id: "site",
    label: "Site",
    numeric: false,
    disablePadding: true,
  },
  {
    id: "numberOfCoolersPurchased",
    label: "Coolers / Services",
    numeric: false,
    disablePadding: true,
  },
  {
    id: "Purchase Date",
    label: "Purchase Date",
    numeric: false,
    disablePadding: true,
  },

  {
    id: "status",
    label: "Status",
    numeric: false,
    disablePadding: true,
  },
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

export default function SalesOrder() {
  const theme = useTheme();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [arrayData, setArrayData] = React.useState([]);
  const [jsonData, setJsonData] = React.useState(null);
  const [timeRange, setTimeRange] = React.useState("");
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);
  const [searchText, setSearchText] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState("");
  const [dense, setDense] = React.useState(false);
  const [openImportModale, setOpenImportModale] = React.useState(false);
  const [tabValue, setTabValue] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const dispatch = useDispatch();
  const {
    data: users,
    totalRecords,
    isLoading,
  } = useSelector((state) => state.salesOrders);
  const isNotFound = !users?.data?.length;

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    fetchData(newValue);
  };

  const tabLabels = [
    `All Orders (${
      (users?.pendingOrders || 0) +
      (users?.inProgressOrders || 0) +
      (users?.completedOrders || 0) +
      (users?.delayedOrders || 0)
    })`,
    `Pending Orders (${users?.pendingOrders})`,
    `InProgress Orders (${users?.inProgressOrders})`,
    `Completed Orders (${users?.completedOrders})`,
    `Delayed Orders (${users?.delayedOrders})`,
  ];

  const tabStatuses = ["", "Pending", "InProgress", "Completed", "Delayed"];
  const handleDateChange = (date, type) => {
    if (type === "start") {
      setStartDate(date);
    } else if (type === "end") {
      setEndDate(date);
    }
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const getStartAndEndOfCurrentYear = () => {
    const currentYear = new Date().getFullYear();
    const start = new Date(currentYear, 0, 1);
    const end = new Date(currentYear, 11, 31);
    return { start, end };
  };

  const getStartAndEndOfThisMonth = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { start, end };
  };

  const getStartAndEndOfLastMonth = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const end = new Date(now.getFullYear(), now.getMonth(), 0);
    return { start, end };
  };

  const getStartAndEndOfThisWeek = () => {
    const now = new Date();
    const firstDay = now.getDate() - now.getDay();
    const start = new Date(now.setDate(firstDay));
    const end = new Date(now.setDate(firstDay + 6));
    return { start, end };
  };

  const getStartAndEndOfLastWeek = () => {
    const now = new Date();
    const firstDay = now.getDate() - now.getDay() - 7;
    const start = new Date(now.setDate(firstDay));
    const end = new Date(now.setDate(firstDay + 6));
    return { start, end };
  };

  const handleTimeRangeChange = (event) => {
    const selectedTimeRange = event.target.value;
    setTimeRange(selectedTimeRange);

    let start = null;
    let end = null;

    switch (selectedTimeRange) {
      case "currentYear":
        const currentYearDates = getStartAndEndOfCurrentYear();
        start = currentYearDates.start;
        end = currentYearDates.end;
        break;
      case "thisMonth":
        const thisMonthDates = getStartAndEndOfThisMonth();
        start = thisMonthDates.start;
        end = thisMonthDates.end;
        break;
      case "lastMonth":
        const lastMonthDates = getStartAndEndOfLastMonth();
        start = lastMonthDates.start;
        end = lastMonthDates.end;
        break;
      case "thisWeek":
        const thisWeekDates = getStartAndEndOfThisWeek();
        start = thisWeekDates.start;
        end = thisWeekDates.end;
        break;
      case "lastWeek":
        const lastWeekDates = getStartAndEndOfLastWeek();
        start = lastWeekDates.start;
        end = lastWeekDates.end;
        break;
      default:
        break;
    }

    setStartDate(start);
    setEndDate(end);
  };

  const fetchData = React.useCallback(
    async (tabIndex = 0) => {
      const status = tabStatuses[tabIndex] || filterStatus;
      const payload = {
        page: page,
        limit: rowsPerPage,
        status: status,
        search: searchText,
        timeRange: timeRange,
        startDate: startDate ? startDate.toISOString() : null,
        endDate: endDate ? endDate.toISOString() : null,
      };
      dispatch(findsalesOrders(payload));
    },
    [
      page,
      rowsPerPage,
      dispatch,
      status,
      timeRange,
      searchText,
      startDate,
      filterStatus,
      endDate,
    ]
  );

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = users?.data?.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const clearFilters = () => {
    setSearchText("");
    setTimeRange("");
    fetchData();
    setStartDate(null);
    setEndDate(null);
  };

  const handleExport = () => {
    const exportData = users?.data?.map((user) => ({
      salesOrderNumber: user?.billNumber,
      companyId: user?.companyId?.companyName,
      siteId: user?.siteId?.siteName,
      numberOfCoolersPurchased: user?.numberOfCoolersPurchased,
      purchaseDate: user?.purchaseDate,
      status: user?.status,
      CreatedAt: user?.createdAt,
      UpdatedAt: user?.updatedAt,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(data, "salesOrder.xlsx");
  };

  const handleDeleteRow = async (id) => {
    try {
      const response = await api.delete(`/api/sales-orders/${id}`);
      if (response.status === 200) {
        fetchData();
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
    setSelected([]);
    if (page > 0) {
      if (dataInPage.length < 2) {
        setPage(page - 1);
      }
    }
  };

  const handleCloseImportModal = () => {
    setOpenImportModale(false);
  };

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

      arrayData.forEach((row, index) => {
        const key = camelCase(row[0]);
        if (row[i]) {
          obj[key] = row[i];
        }
      });

      if (Object.keys(obj).length > 0) {
        payload.push(obj);
      }
    }

    const response = await dispatch(createSalesOrderbyexcel(payload));
    if (response?.payload?.success) {
      handleCloseImportModal();
      fetchData();
    }
  };

  return (
    <>
      <Helmet>
        <title>Sales Order Management</title>
      </Helmet>

      <Box className="w-full sm:px-6 lg:px-8 max-w-9xl mx-auto">
        <ResponsivePaperWrapper>
          <Box className="w-full py-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <Typography
              variant="h5"
              fontWeight="bold"
              className="libre-baskerville-regular !text-[35px]"
            >
              Sales Order
            </Typography>
            <div className="flex items-center gap-2">
              <Button
                variant="outlined"
                startIcon={<UploadFileIcon />}
                onClick={() => setOpenImportModale(true)}
                className="text-nowrap Inter-regular !px-4 !py-2 !text-[#4b5563] !border-[#4b5563]"
              >
                Import
              </Button>
              <Button
                variant="outlined"
                onClick={handleExport}
                startIcon={<Iconify icon="ic:baseline-download" />}
                className="text-nowrap Inter-regular !px-4 !py-2 !text-[#4b5563] !border-[#4b5563]"
              >
                Export
              </Button>
              <Button
                component={RouterLink}
                to="/salesOrder/new"
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
                className="text-nowrap Inter-regular !px-4 !py-2 !text-[#fff] !border-[#4b5563]"
              >
                New Sales Order
              </Button>
            </div>
          </Box>
        </ResponsivePaperWrapper>
        <Box className="py-[12px] flex items-center flex-col lg:flex-row gap-[24px] mb-[12px]">
          <Box className="rounded-none w-full">
            <Card
              className="!bg-[#004f8362]"
              sx={{
                display: "flex",
                alignItems: "center",
                p: 3,
                cursor: "pointer",
              }}
              onClick={() => {
                setFilterStatus("");
                setTabValue(0);
                setPage(0);
                fetchData(0);
              }}
            >
              <Box sx={{ flexGrow: 1 }}>
                <Typography
                  variant="subtitle2"
                  className="!mb-[15px] !text-[18px] !tracking-[0.5px] !text-[#fff] Roboto-regular"
                >
                  Total Orders
                </Typography>
                <Typography className="font-mono !font-[500] !text-[#fff]">
                  {`${
                    (users?.pendingOrders || 0) +
                    (users?.inProgressOrders || 0) +
                    (users?.completedOrders || 0) +
                    (users?.delayedOrders || 0)
                  }`}
                </Typography>
              </Box>
              <Typography variant="subtitle2">
                <ConfirmationNumberIcon className="!text-[26px] !text-[#fff]" />
              </Typography>
            </Card>
          </Box>
          <Box className="rounded-none w-full">
            <Card
              style={{ background: theme.palette.background.default }}
              sx={{
                display: "flex",
                alignItems: "center",
                p: 3,
                cursor: "pointer",
              }}
              onClick={() => {
                setFilterStatus("Pending");
                setTabValue(1);
                setPage(0);
                fetchData(1);
              }}
            >
              <Box sx={{ flexGrow: 1 }}>
                <Typography
                  variant="subtitle2"
                  className="!mb-[15px] !text-[18px] !tracking-[0.5px] !text-[#000] Roboto-regular"
                >
                  Pending
                </Typography>
                <Typography className="font-mono !font-[500]">
                  {" "}
                  {users?.pendingOrders || 0}
                </Typography>
              </Box>
              <Typography variant="subtitle2">
                <CiTimer className="!text-[26px]" />
              </Typography>
            </Card>
          </Box>
          <Box className="rounded-none w-full">
            <Card
              className="!bg-[#004f8362]"
              style={{ background: theme.palette.background.default }}
              sx={{
                display: "flex",
                alignItems: "center",
                p: 3,
                cursor: "pointer",
              }}
              onClick={() => {
                setFilterStatus("InProgress");
                setTabValue(2);
                setPage(0);
                fetchData(2);
              }}
            >
              <Box sx={{ flexGrow: 1 }}>
                <Typography
                  variant="subtitle2"
                  className="!mb-[15px] !text-[18px] !tracking-[0.5px] !text-[#fff] Roboto-regular"
                >
                  In Progress
                </Typography>
                <Typography className="font-mono !font-[500] !text-[#fff]">
                  {users?.inProgressOrders || 0}
                </Typography>
              </Box>
              <Typography variant="subtitle2">
                <GrInProgress className="!text-[26px] !text-[#fff]" />
              </Typography>
            </Card>
          </Box>

          <Box className="rounded-none  w-full">
            <Card
              style={{ background: theme.palette.background.default }}
              sx={{
                display: "flex",
                alignItems: "center",
                p: 3,
                cursor: "pointer",
              }}
              onClick={() => {
                setFilterStatus("Completed");
                setTabValue(3);
                setPage(0);
                fetchData(3);
              }}
            >
              <Box sx={{ flexGrow: 1 }}>
                <Typography
                  variant="subtitle2"
                  className="!mb-[15px] !text-[18px] !tracking-[0.5px] !text-[#000] Roboto-regular"
                >
                  Completed
                </Typography>
                <Typography className="font-mono !font-[500]">
                  {" "}
                  {users?.completedOrders || 0}
                </Typography>
              </Box>
              <Typography variant="subtitle2">
                <IoCheckmarkDoneCircle className="!text-[26px]" />
              </Typography>
            </Card>
          </Box>
          <Box className="rounded-none w-full">
            <Card
              className="!bg-[#004f8362]"
              sx={{
                display: "flex",
                alignItems: "center",
                p: 3,
                cursor: "pointer",
              }}
              onClick={() => {
                setFilterStatus("Delayed");
                setTabValue(4);
                setPage(0);
                fetchData(4);
              }}
            >
              <Box sx={{ flexGrow: 1 }}>
                <Typography
                  variant="subtitle2"
                  className="!mb-[15px] !text-[18px] !tracking-[0.5px] !text-[#fff] Roboto-regular"
                >
                  Delayed
                </Typography>
                <Typography className="font-mono !font-[500] !text-[#fff]">
                  {users?.delayedOrders || 0}
                </Typography>
              </Box>
              <Typography variant="subtitle2">
                <MdOutlinePendingActions className="!text-[26px] !text-[#fff]" />
              </Typography>
            </Card>
          </Box>
        </Box>

        <Box>
          <Paper sx={{ mb: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: { xs: "wrap", md: "nowrap" },
                  gap: 2,
                  py: 2,
                  px: { xs: 2, sm: 3 },
                  borderRadius: "8px",
                  boxShadow: 1,
                }}
              >
                <DatePicker
                  label="Start Date"
                  format="dd/MM/yyyy"
                  className="!min-w-[145px]"
                  value={startDate}
                  onChange={(newValue) => handleDateChange(newValue, "start")}
                  disabled={timeRange}
                  slotProps={{
                    textField: {
                      size: "small",
                      sx: { width: { xs: "45%", sm: "10%" } },
                    },
                  }}
                />
                <DatePicker
                  label="End Date"
                  format="dd/MM/yyyy"
                  className="!min-w-[145px]"
                  value={endDate}
                  onChange={(newValue) => handleDateChange(newValue, "end")}
                  disabled={timeRange}
                  slotProps={{
                    textField: {
                      size: "small",
                      sx: { width: { xs: "45%", sm: "10%" } },
                    },
                  }}
                />

                <FormControl
                  size="small"
                  sx={{ width: { xs: "45%", sm: "10%" }, minWidth: "145px" }}
                >
                  <InputLabel id="status-label">Date Range</InputLabel>
                  <Select
                    labelId="status-label"
                    value={timeRange}
                    onChange={handleTimeRangeChange}
                    label="Time Range"
                  >
                    <MenuItem value="currentYear">Current Year</MenuItem>
                    <MenuItem value="lastMonth">Last Month</MenuItem>
                    <MenuItem value="thisMonth">This Month</MenuItem>
                    <MenuItem value="lastWeek">Last Week</MenuItem>
                    <MenuItem value="thisWeek">This Week</MenuItem>
                  </Select>
                </FormControl>

                <Box sx={{ flex: 1 }}>
                  <OutlinedInput
                    fullWidth
                    className="Search_Input !min-w-[345px]"
                    placeholder="Search by Sales Order No., Company Name, Site Name...."
                    value={searchText}
                    onChange={handleSearchChange}
                    startAdornment={
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    }
                  />
                </Box>
                {(searchText || timeRange || startDate || endDate) && (
                  <IconButton sx={{ width: "5%" }} onClick={clearFilters}>
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
            </LocalizationProvider>

            <Box sx={{ py: 1, width: "100%" }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="Sales Order Status Tabs"
                variant={isSmallScreen ? "scrollable" : "standard"}
                scrollButtons={isSmallScreen ? "auto" : false}
                allowScrollButtonsMobile
                TabIndicatorProps={{
                  style: {
                    height: 3,
                    borderRadius: 3,
                    backgroundColor: theme.palette.primary.main,
                  },
                }}
                sx={{
                  "& .MuiTab-root": {
                    minWidth: isSmallScreen ? 100 : 120,
                    fontWeight: 600,
                    textTransform: "none",
                    fontSize: 14,
                  },
                }}
              >
                {tabLabels.map((label, index) => (
                  <Tab key={index} label={label} />
                ))}
              </Tabs>
            </Box>

            <TableContainer className="overflow-x-auto">
              <Table
                sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"
                size={dense ? "small" : "medium"}
              >
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell>&nbsp;</TableCell>
                    <TableCell>Sales Order Number</TableCell>
                    <TableCell>Company Name</TableCell>
                    <TableCell>Site</TableCell>
                    <TableCell>Coolers / Services</TableCell>
                    <TableCell>Sales Order Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Created At</TableCell>
                    <TableCell>Updated At</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!isLoading ? (
                    users?.data?.map((row, index) => {
                      const isItemSelected = selected.includes(row.id);
                      const labelId = `enhanced-table-checkbox-${index}`;
                      return (
                        <Index
                          isItemSelected={isItemSelected}
                          isLoading={isLoading}
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
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <FormControlLabel
                control={
                  <Switch checked={dense} onChange={handleChangeDense} />
                }
                label="Dense padding"
                sx={{ ml: "20px" }}
              />
              <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={totalRecords || 5}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Box>
          </Paper>
        </Box>
      </Box>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={openImportModale}
        onClose={handleCloseImportModal}
      >
        <DialogTitle>
          Import Sales Order
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
