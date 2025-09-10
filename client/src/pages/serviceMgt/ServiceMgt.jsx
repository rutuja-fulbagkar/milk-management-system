import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import GroupIcon from "@mui/icons-material/Group";
import {
  Autocomplete,
  Button,
  Checkbox,
  Dialog,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
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
import { saveAs } from "file-saver";
import moment from "moment";
import * as React from "react";
import * as XLSX from "xlsx";
import * as Yup from "yup";
import Iconify from "../../components/iconify";
import LoadingContent from "../../components/table/empty-content/loadingContent";
import ResponsivePaperWrapper from "../../components/table/ResponsivePaperWrapper";
import TableNoData from "../../components/table/TableNoData";
import { findCompanyWithoutPagination } from "../../redux/slices/company/companyApi";
import { findservices } from "../../redux/slices/service/serviceApi";
import { findUserWithoutPagination } from "../../redux/slices/user/userApi";
import { editMultipleAssignWarranty } from "../../redux/slices/warranty/warrantyApi";
import { useDispatch, useSelector } from "../../redux/store";
import Index from "./TableRow.jsx/Index";
import { Helmet } from "react-helmet-async";

const validationSchema = Yup.object().shape({
  technician: Yup.object().required("Technician is required"),
  helper: Yup.object().required("Helper is required"),
});

const TABLE_HEAD = [
  {
    id: "serviceName",
    label: "Warranty Id",
    numeric: false,
    disablePadding: true,
  },
  {
    id: "serviceId",
    label: "Site",
    numeric: false,
    disablePadding: true,
  },
  {
    id: "modelNumber",
    label: "Warranty Expire Date",
    numeric: false,
    disablePadding: true,
  },
  {
    id: "qty",
    label: "Service Date",
    numeric: false,
    disablePadding: true,
  },
  {
    id: "qty",
    label: "Sales Order Quantity",
    numeric: false,
    disablePadding: true,
  },
  {
    id: "qty",
    label: "Service Sequence",
    numeric: false,
    disablePadding: true,
  },
  {
    id: "qty",
    label: "SERVICE BY",
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

export default function ServiceMgt() {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [roles, setRoles] = React.useState([]);
  const [company, setCompany] = React.useState([]);
  const [timeRange, setTimeRange] = React.useState("");
  const [startDate, setStartDate] = React.useState(null);
  const [selectedTechnician, setSelectedTechnician] = React.useState(null);
  const [selectedHelper, setSelectedHelper] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);
  const [errors, setErrors] = React.useState({ helper: "", technician: "" });
  const [selectedRole, setSelectedRole] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState("");
  const [selectedServiceIds, setSelectedServiceIds] = React.useState([]);
  const [openMultipleAssignModal, setOpenMultipleAssignModal] =
    React.useState(false);
  const capitalize = (str) =>
    str?.charAt(0)?.toUpperCase() + str?.slice(1)?.toLowerCase();

  const dispatch = useDispatch();
  const {
    data: users,
    totalRecords,
    isLoading,
  } = useSelector((state) => state.service);

  const isNotFound = !users?.data?.length;

  const fetchData = React.useCallback(async () => {
    const payload = {
      page: page,
      limit: rowsPerPage,
      isArchived: false,
      search: searchQuery,
      role: selectedRole || undefined,
      status: selectedStatus || undefined,
      timeRange: timeRange,
      startDate: startDate ? startDate.toISOString() : null,
      endDate: endDate ? endDate.toISOString() : null,
    };
    dispatch(findservices(payload));
  }, [
    page,
    rowsPerPage,
    dispatch,
    searchQuery,
    selectedRole,
    selectedStatus,
    timeRange,
    startDate,
    endDate,
  ]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchUserData = React.useCallback(async () => {
    try {
      const response = await dispatch(findUserWithoutPagination());
      if (Array.isArray(response?.payload)) {
        setRoles(response.payload);
      } else {
        console.error("Expected an array but got:", response?.payload);
        setRoles([]);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setRoles([]);
    }
  }, [dispatch]);

  React.useEffect(() => {
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchUserData]);

  const technicianOptions = roles
    ?.filter((user) => user?.role?.name === "Technician")
    ?.map((user) => ({
      _id: user?._id,
      title: `${user?.firstName} ${user?.lastName}`,
    }));

  const helperOptions = roles
    ?.filter((user) => user?.role?.name === "Helper")
    ?.map((user) => ({
      _id: user?._id,
      title: `${user?.firstName} ${user?.lastName}`,
    }));

  const handleChangeTechnician = (event, value) => {
    setSelectedTechnician(value);
  };
  const handleChangeHelper = (event, value) => {
    setSelectedHelper(value);
  };

  const handleCloseMultipleAssignModal = () => {
    setOpenMultipleAssignModal(false);
  };

  React.useEffect(() => {
    const getCompanys = async () => {
      try {
        const response = await dispatch(findCompanyWithoutPagination());
        if (Array.isArray(response?.payload)) {
          setCompany(response.payload);
        } else {
          console.error("Expected an array but got:", response?.payload);
          setCompany([]);
        }
      } catch (err) {
        console.error("Failed to fetch companies:", err);
        setCompany([]);
      }
    };
    getCompanys();
  }, [dispatch]);

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

  const handleSelectService = (serviceId) => {
    setSelectedServiceIds((prev) => {
      if (prev.includes(serviceId)) {
        return prev.filter((id) => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };

  const handleSelectAllServices = (event) => {
    if (event.target.checked) {
      const allServiceIds = users?.data?.map((service) => service?._id) || [];
      setSelectedServiceIds(allServiceIds);
    } else {
      setSelectedServiceIds([]);
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMultipleAssignStaff = async () => {
    try {
      await validationSchema.validate({
        technician: selectedTechnician,
        helper: selectedHelper,
      });
      setErrors({ technician: "", helper: "" });

      const payload = {
        userIds: [selectedTechnician?._id, selectedHelper?._id],
        serviceIds: selectedServiceIds,
      };

      const response = await dispatch(
        editMultipleAssignWarranty({ data: payload })
      );
      if (response?.payload?.success) {
        setSelectedTechnician(null);
        setSelectedHelper(null);
        handleCloseMultipleAssignModal();
        fetchData();
      }
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        setErrors({
          technician:
            error.errors[0] === "Technician is required" ? error.errors[0] : "",
          helper:
            error.errors[0] === "Helper is required" ? error.errors[0] : "",
        });
      } else {
        console.error(error);
      }
    }
  };

  const handleMultipleAssignSelectedStaff = () => {
    setOpenMultipleAssignModal(true);
  };

  const handleExport = () => {
    const exportData = users?.data?.map((user) => ({
      warrantyId: user?.warrantyId,
      site: user?.order_id?.siteId?.siteName,
      warrantyExpiryDate:
        user?.warrantyEndDate && moment(user?.warrantyEndDate).isValid(),
      serviceDate: user?.serviceDate && moment(user?.serviceDate).isValid(),
      salesOrderQuantity: user?.order_id?.numberOfCoolersPurchased,
      serviceSequence: user?.serviceSequence,
      serviceBy: user.serviceBy
        .map((person) => `${person?.firstName} ${person?.lastName}`)
        .join(", "),
      status: user?.serviceStatus,
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
    saveAs(data, "services.xlsx");
  };

  return (
    <>
      <Helmet>
        <title>Service Management</title>
      </Helmet>
      <Box className="w-full sm:px-6 lg:px-8 max-w-9xl mx-auto">
        <ResponsivePaperWrapper>
          <Box className="w-full py-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <Typography
              variant="h5"
              fontWeight="bold"
              className="libre-baskerville-regular !text-[35px]"
            >
              Service Management
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
        <Box>
          <Paper sx={{ mb: 2 }}>
            {selectedServiceIds.length === 0 && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: { xs: "wrap", md: "wrap" },
                  gap: 2,
                  py: 2,
                  px: { xs: 2, sm: 3 },
                  backgroundColor: "#f9f9f9",
                  borderRadius: "8px",
                  boxShadow: 1,
                  marginBottom: "20px",
                }}
              >
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Start Date"
                    format="dd/MM/yyyy"
                    value={startDate}
                    className="!min-w-[145px]"
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
                    value={endDate}
                    className="!min-w-[145px]"
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
                </LocalizationProvider>
                <FormControl
                  fullWidth
                  sx={{ width: { xs: "45%", sm: "10%" }, minWidth: "145px" }}
                  size="small"
                >
                  <InputLabel id="role-label">Technician</InputLabel>
                  <Select
                    labelId="role-label"
                    value={selectedRole}
                    label="Role"
                    onChange={(e) => {
                      setSelectedRole(e.target.value);
                      setPage(0);
                    }}
                  >
                    <MenuItem value="">All</MenuItem>
                    {technicianOptions.map((role) => (
                      <MenuItem key={role._id} value={role._id}>
                        {capitalize(role.title)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl
                  fullWidth
                  sx={{ width: { xs: "45%", sm: "10%" }, minWidth: "145px" }}
                  size="small"
                >
                  <InputLabel id="status-label">Company</InputLabel>
                  <Select
                    labelId="status-label"
                    value={selectedStatus}
                    label="Login"
                    onChange={(e) => {
                      setSelectedStatus(e.target.value);
                      setPage(0);
                    }}
                  >
                    <MenuItem value="">All</MenuItem>
                    {company.map((role) => (
                      <MenuItem key={role._id} value={role._id}>
                        {role.companyName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  placeholder="Search by Site Name ,Service Sequence..."
                  value={searchQuery}
                  className="!min-w-[145px]"
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(0);
                  }}
                  sx={{ width: { xs: "90%", sm: "40%" } }}
                  size="small"
                  variant="outlined"
                />
                {(selectedRole ||
                  selectedStatus ||
                  searchQuery ||
                  timeRange ||
                  startDate ||
                  endDate) && (
                  <IconButton
                    onClick={() => {
                      setSelectedRole("");
                      setSelectedStatus("");
                      setSearchQuery("");
                      setTimeRange("");
                      setStartDate(null);
                      setEndDate(null);
                      setPage(0);
                    }}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
            )}
            {selectedServiceIds.length !== 0 && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: { xs: "wrap", md: "nowrap" },
                  gap: 2,
                  py: 2,
                  px: { xs: 2, sm: 3 },
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleMultipleAssignSelectedStaff}
                  size="medium"
                  sx={{ borderRadius: 2, textTransform: "none" }}
                >
                  <GroupIcon />
                </Button>
              </Box>
            )}

            <TableContainer className="overflow-x-auto">
              <Table
                sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"
                size={dense ? "small" : "medium"}
              >
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell padding="checkbox">
                      <Tooltip title="Assign Staff For All">
                        <Checkbox
                          checked={
                            selectedServiceIds.length === users?.data?.length
                          }
                          onChange={handleSelectAllServices}
                        />
                      </Tooltip>
                    </TableCell>
                    <TableCell>Warranty Id</TableCell>
                    <TableCell>Site</TableCell>
                    <TableCell>Warranty Expire Date</TableCell>
                    <TableCell>Service Date</TableCell>
                    <TableCell>Sales Order Quantity</TableCell>
                    <TableCell>Service Sequence</TableCell>
                    <TableCell>SERVICE BY</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Created At</TableCell>
                    <TableCell>Updated At</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!isLoading ? (
                    users?.data?.map((row, index) => {
                      const isItemSelected = selectedServiceIds?.includes(
                        row?._id
                      );
                      const labelId = `enhanced-table-checkbox-${index}`;
                      return (
                        <Index
                          roles={roles}
                          isItemSelected={isItemSelected}
                          handleSelectService={handleSelectService}
                          labelId={labelId}
                          row={row}
                          key={row._id}
                          fetchData={fetchData}
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

            <Dialog
              fullWidth
              maxWidth="sm"
              open={openMultipleAssignModal}
              onClose={handleCloseMultipleAssignModal}
            >
              <DialogTitle>
                Multiple Assign Staff
                <IconButton
                  aria-label="close"
                  onClick={handleCloseMultipleAssignModal}
                  style={{ position: "absolute", right: "10px", top: "15px" }}
                >
                  <CloseIcon style={{ fontSize: "20px" }} />
                </IconButton>
              </DialogTitle>
              <div className="p-4">
                <Typography variant="body1">
                  Please Assign Staff for Managing Service for The Service
                  Orders.
                </Typography>

                <div className="flex justify-between mt-4">
                  <div style={{ flex: 1, marginRight: "10px" }}>
                    <Autocomplete
                      options={technicianOptions}
                      onChange={handleChangeTechnician}
                      selectOnFocus
                      clearOnBlur
                      handleHomeEndKeys
                      getOptionLabel={(option) => option.title}
                      renderOption={(props, option) => (
                        <li {...props}>{option.title}</li>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Technician"
                          error={!!errors.technician}
                          helperText={errors.technician}
                        />
                      )}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Autocomplete
                      options={helperOptions}
                      onChange={handleChangeHelper}
                      selectOnFocus
                      clearOnBlur
                      handleHomeEndKeys
                      getOptionLabel={(option) => option.title}
                      renderOption={(props, option) => (
                        <li {...props}>{option.title}</li>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Helper"
                          error={!!errors.helper}
                          helperText={errors.helper}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="outlined"
                    onClick={handleCloseMultipleAssignModal}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleMultipleAssignStaff}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </Dialog>
          </Paper>
        </Box>
      </Box>
    </>
  );
}
