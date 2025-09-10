import {
  Button,
  IconButton,
  InputAdornment,
  OutlinedInput,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import * as React from "react";
import { toast } from "react-toastify";
import Iconify from "../../components/iconify";
import LoadingContent from "../../components/table/empty-content/loadingContent";
import ResponsivePaperWrapper from "../../components/table/ResponsivePaperWrapper";
import TableNoData from "../../components/table/TableNoData";
import { findRoles, getRoles } from "../../redux/slices/roles/rolesApi";
import { useDispatch, useSelector } from "../../redux/store";
import { api } from "../../utils/api";
import RolesAddDialog from "./create/RolesAddDialog";
import Index from "./TableRow.jsx/Index";

const TABLE_HEAD = [
  { id: "name", label: "Role Name", numeric: false, disablePadding: true },
  { id: "status", label: "Status", disablePadding: true },
  { id: "action", label: "Action", numeric: false, disablePadding: true },
];

export default function Role() {
  const [selected, setSelected] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rolesOpen, setRolesOpen] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState("");
  const dispatch = useDispatch();
  const {
    data: users,
    totalRecords,
    isLoading,
  } = useSelector((state) => state.roles);
  const isNotFound = !users?.length;

  const fetchData = React.useCallback(async () => {
    const payload = {
      page: page,
      limit: rowsPerPage,
      search: searchQuery,
    };
    dispatch(findRoles(payload));
  }, [page, rowsPerPage, dispatch, searchQuery]);

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

  const handleDeleteRow = async (id) => {
    try {
      const response = await api.delete(`/api/roles/${id}`);
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

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleClickOpenRoles = () => {
    setSelectedRole(null);
    setRolesOpen(true);
  };

  const clearFilters = () => {
    setSearchQuery("");
    fetchData();
  };

  return (
    <>
      <Box className="w-full sm:px-6 lg:px-8 max-w-9xl mx-auto">
        <ResponsivePaperWrapper>
          <Box className="w-full py-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <Typography
              variant="h5"
              fontWeight="bold"
              className="libre-baskerville-regular !text-[35px]"
            >
              Roles
            </Typography>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleClickOpenRoles}
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
                className="text-nowrap Inter-regular !px-4 !py-2 !text-[#fff] !border-[#4b5563]"
              >
                New Role
              </Button>
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
              <OutlinedInput
                fullWidth
                className="Search_Input !min-w-[445px]"
                placeholder="Search by Role Name..."
                value={searchQuery}
                sx={{ width: { xs: "90%", sm: "30%" } }}
                onChange={handleSearchChange}
                startAdornment={
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                }
              />
              {searchQuery && (
                <IconButton onClick={clearFilters}>
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
                    <TableCell>Role Name</TableCell>
                    <TableCell>Status</TableCell>
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
                          setSelectedRole={setSelectedRole}
                          labelId={labelId}
                          setRolesOpen={setRolesOpen}
                          fetchData={fetchData}
                          onDeleteRow={() => handleDeleteRow(row?._id)}
                          row={row}
                          key={row.id}
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
        </Box>
      </Box>
      <RolesAddDialog
        assetOpen={rolesOpen}
        setAssetOpen={setRolesOpen}
        assetTypesData={users}
        fetchAssetTypesData={fetchData}
        selectedRole={selectedRole}
      />
    </>
  );
}
