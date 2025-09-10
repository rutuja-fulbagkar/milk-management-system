import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import SearchIcon from "@mui/icons-material/Search";
import {
  Button,
  Card,
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
import moment from "moment";
import * as React from "react";
import { CiTimer } from "react-icons/ci";
import { GrInProgress } from "react-icons/gr";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { MdOutlinePendingActions } from "react-icons/md";
import * as XLSX from "xlsx";
import Iconify from "../../components/iconify";
import CustumTableHead from "../../components/table/CustumTableHead";
import ResponsivePaperWrapper from "../../components/table/ResponsivePaperWrapper";
import TableNoData from "../../components/table/TableNoData";
import LoadingContent from "../../components/table/empty-content/loadingContent";
import { findwarranty } from "../../redux/slices/warranty/warrantyApi";
import { useDispatch, useSelector } from "../../redux/store";
import Index from "./TableRow.jsx/Index";
import { Helmet } from "react-helmet-async";

const TABLE_HEAD = [
  {
    id: "Warranty id",
    label: "Warranty id",
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
    label: "Sales Order Number",
    numeric: false,
    disablePadding: true,
  },
  {
    id: "Purchase Date",
    label: "Warranty Time Period From Date | To Date",
    numeric: false,
    disablePadding: true,
  },
  {
    id: "Purchase Date",
    label: "Number of Services",
    numeric: false,
    disablePadding: true,
  },
  {
    id: "status",
    label: "Status",
    numeric: false,
    disablePadding: true,
  },
  { id: "action", label: "Action", numeric: false, disablePadding: true },
];

export default function WarrantyMgt() {
  const theme = useTheme();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [dense, setDense] = React.useState(false);
  const [tabValue, setTabValue] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [timeRange, setTimeRange] = React.useState("");
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);
  const [filterStatus, setFilterStatus] = React.useState("");
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const {
    data: users,
    totalRecords,
    isLoading,
  } = useSelector((state) => state.warranty);
  const isNotFound = !users?.data?.length;

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    fetchData(newValue);
  };

  const tabLabels = [
    `All (${
      (users?.warrantyCount || 0) +
      (users?.amcRequestCount || 0) +
      (users?.amcCount || 0) +
      (users?.renewAmcCount || 0)
    })`,
    `Warranty (${users?.warrantyCount})`,
    `Request For AMC (${users?.amcRequestCount})`,
    `AMC (${users?.amcCount})`,
    `Renew AMC (${users?.renewAmcCount})`,
  ];

  const tabStatuses = ["", "Warranty", "Request For AMC", "AMC", "Renew AMC"];

  const handleDateChange = (date, type) => {
    if (type === "start") {
      setStartDate(date);
    } else if (type === "end") {
      setEndDate(date);
    }
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
        isArchived: false,
        status: status,
        search: searchQuery,
        timeRange: timeRange,
        startDate: startDate ? startDate.toISOString() : null,
        endDate: endDate ? endDate.toISOString() : null,
      };
      dispatch(findwarranty(payload));
    },
    [
      page,
      rowsPerPage,
      dispatch,
      status,
      searchQuery,
      timeRange,
      startDate,
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

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleExport = () => {
    const exportData = users?.data?.map((user) => ({
      warrantyId: user?.warrantyId,
      companyId: user?.order_id?.companyId?.companyName,
      siteId: user?.order_id?.siteId?.siteName,
      numberOfCoolersPurchased: user?.order_id?.billNumber,
      warrantyTime: `${moment(user.warrantyStartDate).format("DD/MM/YYYY")} | ${
        user?.warrantyEndDate
          ? moment(user.warrantyEndDate).format("DD/MM/YYYY")
          : "-"
      }`,
      numberOfService: user?.numberOfServices,
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
    saveAs(data, "warranty.xlsx");
  };

  const clearFilters = () => {
    setSearchQuery("");
    setTimeRange("");
    fetchData();
    setStartDate(null);
    setEndDate(null);
  };

  return (
    <>
      <Helmet>
        <title>Warranty Management</title>
      </Helmet>
      <Box className="w-full sm:px-6 lg:px-8 max-w-9xl mx-auto">
        <ResponsivePaperWrapper>
          <Box className="w-full py-3 flex flex-col md:flex-row items-center justify-between gap-4">
            <Typography
              variant="h5"
              fontWeight="bold"
              className="libre-baskerville-regular !text-[35px]"
            >
              Warranty Management
            </Typography>
            <div className="flex items-center gap-2">
              <Button
                variant="outlined"
                onClick={handleExport}
                startIcon={<Iconify icon="ic:baseline-download" />}
                className="text-nowrap Inter-regular !px-4 !py-2 !text-[#4b5563] !border-[#4b5563]"
              >
                Export
              </Button>
            </div>
          </Box>
        </ResponsivePaperWrapper>
        <Box className="py-[12px] flex items-center flex-col lg:flex-row gap-[24px] mb-[12px]">
          <Box className="rounded-none  w-full">
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
                  Total Warranty
                </Typography>
                <Typography className="font-mono !font-[500] !text-[#fff]">
                  {`${
                    (users?.warrantyCount || 0) +
                    (users?.amcRequestCount || 0) +
                    (users?.amcCount || 0) +
                    (users?.renewAmcCount || 0)
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
                setFilterStatus("Warranty");
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
                 Warranty
                </Typography>
                <Typography className="font-mono !font-[500]">
                  {" "}
                  {users?.warrantyCount || 0}
                </Typography>
              </Box>
              <Typography variant="subtitle2">
                <CiTimer className="!text-[26px]" />
              </Typography>
            </Card>
          </Box>
          <Box className="rounded-none  w-full">
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
                setFilterStatus("Request For AMC");
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
                   Request For AMC
                </Typography>
                <Typography className="font-mono !font-[500] !text-[#fff]">
                   {users?.amcRequestCount || 0}
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
                setFilterStatus("AMC");
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
                   AMC
                </Typography>
                <Typography className="font-mono !font-[500]">
                  {" "}
                  {users?.amcCount || 0}
                </Typography>
              </Box>
              <Typography variant="subtitle2">
                <IoCheckmarkDoneCircle className="!text-[26px]" />
              </Typography>
            </Card>
          </Box>
          <Box className="rounded-none  w-full">
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
                setFilterStatus("Renew AMC");
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
                Renew AMC
                </Typography>
                <Typography className="font-mono !font-[500] !text-[#fff]">
                  {users?.renewAmcCount || 0}
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
                      sx: {
                        width: { xs: "45%", sm: "10%" },
                        borderRadius: "4px",
                        "&:hover": {
                          borderColor: "#007bff",
                        },
                      },
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
                      sx: {
                        width: { xs: "45%", sm: "10%" },
                        borderRadius: "4px",
                        "&:hover": {
                          borderColor: "#007bff",
                        },
                      },
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
                    sx={{
                      borderRadius: "4px",
                      "&:hover": {
                        borderColor: "#007bff",
                      },
                    }}
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
                    className="Search_Input !min-w-[145px]"
                    placeholder="Search by Sales Order No., Company Name, Site Name...."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    startAdornment={
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    }
                    sx={{
                      borderRadius: "4px",
                      "&:hover": {
                        borderColor: "#007bff",
                      },
                    }}
                  />
                </Box>

                {(searchQuery || timeRange || startDate || endDate) && (
                  <IconButton onClick={clearFilters}>
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
                    <TableCell>Warranty Id</TableCell>
                    <TableCell>Company Name</TableCell>
                    <TableCell>Site</TableCell>
                    <TableCell>Sales Order Number</TableCell>
                    <TableCell>
                      Warranty Time Period From Date | To Date
                    </TableCell>
                    <TableCell>Number of Services</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!isLoading ? (
                    users?.data?.map((row, index) => {
                      const isItemSelected = selected.includes(row._id);
                      const labelId = `enhanced-table-checkbox-${index}`;
                      return (
                        <Index
                          isItemSelected={isItemSelected}
                          labelId={labelId}
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
    </>
  );
}
