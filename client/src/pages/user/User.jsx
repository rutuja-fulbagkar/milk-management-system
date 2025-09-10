import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {
  Button,
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
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import { saveAs } from "file-saver";
import * as React from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import ExcelToJsonConverterCM from "../../components/extra/ExcelToJsonConverterCM";
import Iconify from "../../components/iconify";
import LoadingContent from "../../components/table/empty-content/loadingContent";
import TableNoData from "../../components/table/TableNoData";
import { getRoles } from "../../redux/slices/roles/rolesApi";
import {
  createUserbyexcel,
  deleteuserMultiple,
  finduser,
} from "../../redux/slices/user/userApi";
import { useDispatch, useSelector } from "../../redux/store";
import { api } from "../../utils/api";
import Index from "./TableRow.jsx/Index";
import ResponsivePaperWrapper from "../../components/table/ResponsivePaperWrapper";
import ConfirmDialog from "../../components/confirm-dialog";
import { LoadingButton } from "@mui/lab";
import ArchieveToggleButton from "./archiveToggleBtn/ToggleButton";
import { Helmet } from "react-helmet-async";

const TABLE_HEAD = [
  {
    id: "employeeId",
    label: "Employee Code",
    numeric: false,
    disablePadding: true,
  },
  { id: "name", label: "Staff Name", numeric: false, disablePadding: true },
  { id: "email", label: "Email", disablePadding: true },
  {
    id: "mobile",
    label: "Contact Number",
    numeric: false,
    disablePadding: true,
  },
  {
    id: "role",
    label: "Role",
    numeric: false,
    disablePadding: true,
  },
  {
    id: "login",
    label: "Login",
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

export default function User() {
  const location = useLocation();
  const view = location.pathname.includes("archived") ? "archived" : "list";
  const navigate = useNavigate();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [arrayData, setArrayData] = React.useState([]);
  const [jsonData, setJsonData] = React.useState(null);
  const [roles, setRoles] = React.useState([]);
  const [selectedRole, setSelectedRole] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState("");
  const [openImportModale, setOpenImportModale] = React.useState(false);
  const [openConfirmMultiDelete, setOpenConfirmMultiDelete] =
    React.useState(false);
  const dispatch = useDispatch();
  const {
    data: users,
    totalRecords,
    isLoading,
  } = useSelector((state) => state.users);
  const isNotFound = !users?.length;

  const fetchData = React.useCallback(async () => {
    const payload = {
      page: page,
      limit: rowsPerPage,
      isArchived: false,
      search: searchQuery,
      role: selectedRole || undefined,
      status: selectedStatus
        ? selectedStatus === "Active"
          ? "Active"
          : "Inactive"
        : undefined,
    };
    dispatch(finduser(payload));
  }, [page, rowsPerPage, dispatch, searchQuery, selectedRole, selectedStatus]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

React.useEffect(() => {
  const getRole = async () => {
    try {
      const response = await dispatch(getRoles());
      if (Array.isArray(response?.payload)) { 
        setRoles(response.payload);
      } else {
        console.error("Expected an array but got:", response?.payload);
        setRoles([]); 
      }
    } catch (err) {
      console.error("Failed to fetch roles:", err);
      setRoles([]);
    }
  };
  getRole();
}, [dispatch]);


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCloseImportModal = () => {
    setOpenImportModale(false);
  };

  const handleExport = () => {
    const exportData = users?.map((user) => ({
      employeeId: user?.employeeId,
      name: `${user?.firstName} ${user?.lastName}`,
      email: user?.email,
      mobile: user?.mobile,
      role: user?.role?.name,
      status: user?.role?.status === "Active" ? "Access" : "No Access",
      createdAt: user?.createdAt,
      updatedAt: user?.updatedAt,
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
    saveAs(data, "staff.xlsx");
  };

  const handleDeleteRow = async (id) => {
    try {
      const response = await api.put(`/api/users/archive/${id}`);
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

  const handleDeleteMultiple = async () => {
    if (selected.length === 0) return;

    await dispatch(deleteuserMultiple(selected));
    setSelected([]);
    fetchData();
    setOpenConfirmMultiDelete(false);
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

    const response = await dispatch(createUserbyexcel(payload));
    if (response?.payload?.success) {
      handleCloseImportModal();
      fetchData();
    }
  };

  const handleChangeView = (event, newView) => {
    if (newView === "staff") {
      navigate("/user");
    }
    if (newView === "archived") {
      navigate("/user/archived");
    }
  };

  return (
    <>
      <Helmet>
        <title>Staff Management</title>
      </Helmet>
      <Box className="w-full sm:px-6 lg:px-8 max-w-9xl mx-auto">
        <ResponsivePaperWrapper>
          <Box className="w-full py-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <Typography
              variant="h5"
              fontWeight="bold"
              className="libre-baskerville-regular !text-[35px]"
            >
              Staff Management
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
                to="/user/new"
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
                className="text-nowrap Inter-regular !px-4 !py-2 !text-[#fff] !border-[#4b5563]"
              >
                New Staff
              </Button>
              <ArchieveToggleButton value={view} onChange={handleChangeView} />
            </div>
          </Box>
        </ResponsivePaperWrapper>
        <Box>
          <Paper sx={{ mb: 2 }}>
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
              <FormControl
                fullWidth
                sx={{ width: { xs: "45%", sm: "10%" }, minWidth: "145px" }}
                size="small"
              >
                <InputLabel id="role-label">Role</InputLabel>
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
                  {roles?.map ((role) => (
                    <MenuItem key={role?._id} value={role?._id}>
                      {role?.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl
                fullWidth
                sx={{ width: { xs: "45%", sm: "10%" }, minWidth: "145px" }}
                size="small"
              >
                <InputLabel id="status-label">Login</InputLabel>
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
                  <MenuItem value="Active">Access</MenuItem>
                  <MenuItem value="No Access">No Access</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                className="!min-w-[145px]"
                placeholder="Search by Staff Name..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(0);
                }}
                sx={{ width: { xs: "90%", sm: "30%" } }}
                size="small"
                variant="outlined"
              />
              {(searchQuery || selectedRole || selectedStatus) && (
                <IconButton
                  onClick={() => {
                    setSelectedRole("");
                    setSelectedStatus("");
                    setSearchQuery("");
                    setPage(0);
                  }}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              )}
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
                    <TableCell>Employee Code</TableCell>
                    <TableCell>Staff Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Contact Number</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Login</TableCell>
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
                sx={{ ml: '20px' }}

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
          Import Staff
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
      <ConfirmDialog
        open={openConfirmMultiDelete}
        onClose={() => setOpenConfirmMultiDelete(false)}
        title="Delete Selected Users"
        content="Are you sure you want to delete the selected users?"
        action={
          <LoadingButton
            variant="contained"
            color="error"
            onClick={handleDeleteMultiple}
          >
            Delete
          </LoadingButton>
        }
      />
    </>
  );
}
