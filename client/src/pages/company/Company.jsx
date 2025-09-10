import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import {
  Button,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Switch,
  TableCell,
  TableHead,
  TableRow,
  Typography,
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
import * as React from "react";
import { Link as RouterLink } from "react-router-dom";
import { toast } from "react-toastify";
import Iconify from "../../components/iconify";
import LoadingContent from "../../components/table/empty-content/loadingContent";
import ResponsivePaperWrapper from "../../components/table/ResponsivePaperWrapper";
import TableNoData from "../../components/table/TableNoData";
import { findCompany } from "../../redux/slices/company/companyApi";
import { useDispatch, useSelector } from "../../redux/store";
import { api } from "../../utils/api";
import Index from "./TableRow/Index";
import { Helmet } from "react-helmet-async";

export default function Company() {
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [timeRange, setTimeRange] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const dispatch = useDispatch();
  const {
    data: users,
    totalRecords,
    isLoading,
  } = useSelector((state) => state.company);
  const isNotFound = !users?.length;

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

  const fetchData = React.useCallback(async () => {
    const payload = {
      page: page,
      limit: rowsPerPage,
      isArchived: false,
      search: searchQuery,
      status: status,
      timeRange: timeRange,
      startDate: startDate ? startDate.toISOString() : null,
      endDate: endDate ? endDate.toISOString() : null,
    };
    dispatch(findCompany(payload));
  }, [
    page,
    rowsPerPage,
    dispatch,
    searchQuery,
    timeRange,
    status,
    startDate,
    endDate,
  ]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleDeleteRow = async (id) => {
    try {
      const response = await api.delete(`/api/companies/${id}`);
      if (response.status === 200) {
        fetchData();
        handleCloseConfirm();
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

  const clearFilters = () => {
    setSearchQuery("");
    setTimeRange("");
    setStatus("");
    setStartDate(null);
    setEndDate(null);
    fetchData();
  };

  return (
    <>
      <Helmet>
        <title>Company Management</title>
      </Helmet>
      <Box className="w-full sm:px-6 lg:px-8 max-w-9xl mx-auto">
        <ResponsivePaperWrapper>
          <Box className="w-full py-3 flex flex-col md:flex-row items-center justify-between gap-4">
            <Typography
              variant="h5"
              fontWeight="bold"
              className="libre-baskerville-regular !text-[35px]"
            >
              Company Management
            </Typography>
            <Button
              component={RouterLink}
              to="/company/new"
              variant="outlined"
              startIcon={<Iconify icon="eva:plus-fill" />}
              className="text-nowrap Inter-regular !px-4 !py-2 !text-[#4b5563] !border-[#4b5563]"
            >
              New Company
            </Button>
          </Box>
        </ResponsivePaperWrapper>
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
                  marginBottom: "20px",
                }}
              >
                <DatePicker
                  label="Start Date"
                  format="dd/MM/yyyy"
                  className="!min-w-[145px]"
                  value={startDate}
                  onChange={(newValue) => handleDateChange(newValue, "start")}
                  disabled={timeRange === "currentYear"}
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
                  disabled={timeRange === "currentYear"}
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
                    className="Search_Input !min-w-[445px]"
                    placeholder="Search by Company Name or Contact Name...."
                    value={searchQuery}
                    sx={{ width: { xs: "90%", sm: "30%" } }}
                    onChange={handleSearchChange}
                    startAdornment={
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    }
                  />
                </Box>
                {(searchQuery ||
                  timeRange ||
                  startDate ||
                  endDate ||
                  status) && (
                  <IconButton sx={{ width: "5%" }} onClick={clearFilters}>
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
            </LocalizationProvider>

            <TableContainer className="overflow-x-auto">
              <Table
                sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"
                size={dense ? "small" : "medium"}
              >
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell>&nbsp;</TableCell>
                    <TableCell>Company Code</TableCell>
                    <TableCell>Company Name</TableCell>
                    <TableCell>Contact Name</TableCell>
                    <TableCell>Contact Number</TableCell>
                    <TableCell>City</TableCell>
                    <TableCell>Number of Sites</TableCell>
                    <TableCell>Created At</TableCell>
                    <TableCell>Updated At</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!isLoading ? (
                    users?.map((row, index) => {
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
