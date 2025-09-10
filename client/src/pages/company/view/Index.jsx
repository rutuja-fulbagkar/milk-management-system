import {
  Apartment as ApartmentIcon,
  LocationOn as LocationIcon,
  Mail as MailIcon,
  Person as SupervisorIcon,
} from "@mui/icons-material";
import BusinessIcon from "@mui/icons-material/Business";
import VillaIcon from "@mui/icons-material/Villa";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import HomeIcon from "@mui/icons-material/Home";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PhoneIcon from "@mui/icons-material/Phone";
import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { AiTwotoneSchedule } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Iconify from "../../../components/iconify";
import MenuPopover from "../../../components/menu-popover/MenuPopover";
import ResponsivePaperWrapper from "../../../components/table/ResponsivePaperWrapper";
import TableNoData from "../../../components/table/TableNoData";
import { getCompanybyId } from "../../../redux/slices/company/companyApi";
import { editSalesOrders } from "../../../redux/slices/salesOrder/salesOrderApi";
import { useDispatch } from "../../../redux/store";
import SetServiceScheduleDialog from "../create/SetServiceScheduleDialog";
import ViewPartsHistoryDialog from "../create/ViewPartsHistoryDialog";

const statusOptions = ["Pending", "InProgress", "Completed", "Delayed"];

const Index = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSite, setSelectedSite] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [menuOrderId, setMenuOrderId] = useState(null);
  const [orderStatuses, setOrderStatuses] = useState({});
  const [openPartsHistoryDialog, setOpenPartsHistoryDialog] = useState(false);
  const [openServiceScheduleDialog, setOpenServiceScheduleDialog] =
    useState(false);

  const handleMenuOpen = (event, orderId) => {
    setMenuAnchorEl(event.currentTarget);
    setMenuOrderId(orderId);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleMenuClick = (event, rowIndex) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(rowIndex);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleTabChange = (event, newValue) => {
    setSelectedSite(newValue);
  };

  useEffect(() => {
    if (id) {
      setLoading(true);
      dispatch(getCompanybyId(id)).then((response) => {
        if (response.payload && response.payload.success) {
          setUser(response.payload.data);
          const initialStatuses = {};
          response.payload.data.siteDetail.forEach((site) => {
            site.salesOrder.forEach((order) => {
              initialStatuses[order._id] = order.status;
            });
          });
          setOrderStatuses(initialStatuses);
        }
        setLoading(false);
      });
    }
  }, [dispatch, id]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress size={60} thickness={5} color="primary" />
      </Box>
    );
  }

  const handleStatusChange = async (event, orderId) => {
    const newStatus = event.target.value;

    if (newStatus !== orderStatuses[orderId]) {
      setOrderStatuses((prev) => ({ ...prev, [orderId]: newStatus }));

      const data = {
        paramsId: orderId,
        data: { status: newStatus },
      };

      try {
        const response = await dispatch(editSalesOrders(data));

        if (response?.payload?.success) {
          await dispatch(getCompanybyId(id));
        } else {
          toast.error(
            response?.payload?.error?.message || "Failed to update status"
          );
        }
      } catch (error) {
        toast.error("Failed to update status");
      }
    }
  };

  const fallback = (val) => val || "-";

  return (
    <>
      <Container maxWidth="2xl" sx={{ minHeight: "100vh" }}>
        <ResponsivePaperWrapper>
          <Box className="w-full py-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <Typography variant="h5" fontWeight="bold">
              View Company Details
            </Typography>
            {/* <IconButton
              variant="outlined"
              onClick={() => navigate(`/company/edit/${id}`)}
            >
              <EditIcon />
            </IconButton> */}
          </Box>
        </ResponsivePaperWrapper>
        <Paper
          elevation={6}
          className="px-2 sm:px-6 lg:px-8 py-8 max-w-9xl mx-auto"
        >
          <ResponsivePaperWrapper>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "linear-gradient(to right, #0963ac, #4c91f5)",
                borderRadius: "8px",
                padding: "16px",
                color: "white",
                width: "100%",
              }}
            >
              <Box>
                <Typography variant="h5" fontWeight="bold">
                  {fallback(user?.companyName)}
                </Typography>
                <Box display="flex" alignItems="center">
                  <Typography variant="body2">Company Code:</Typography>
                  {user?.companyCode && (
                    <Chip
                      label={user.companyCode}
                      variant="outlined"
                      sx={{ color: "#f0f7f2", marginLeft: "8px" }}
                    />
                  )}
                </Box>
              </Box>
              <BusinessIcon sx={{ fontSize: "40px", color: "white" }} />
            </Box>
          </ResponsivePaperWrapper>
          <Grid container spacing={3} mb={3}>
            <Grid sx={{ minWidth: "49%" }}>
              <Card
                variant="outlined"
                sx={{
                  borderRadius: 3,
                  p: 2.5,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                  minHeight: 180,
                  bgcolor: "#f8fafc",
                }}
              >
                <Box display="flex" alignItems="center" mb={2}>
                  <ContactMailIcon sx={{ color: "#22c55e", mr: 1 }} />
                  <Typography variant="h6" fontWeight="bold">
                    Contact Information
                  </Typography>
                </Box>
                <Paper
                  variant="outlined"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 1.2,
                    mb: 1.5,
                    bgcolor: "#fff",
                    borderRadius: 2,
                    boxShadow: "none",
                  }}
                >
                  <SupervisorIcon sx={{ color: "#64748b", mr: 1 }} />
                  <Typography fontWeight="bold" mr={1}>
                    Contact Person
                  </Typography>
                  <Box>
                    <Typography fontSize="1rem" color="text.primary">
                      {user?.contactName || "-"}
                    </Typography>
                  </Box>
                </Paper>
                <Paper
                  variant="outlined"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 1.2,
                    mb: 1.5,
                    bgcolor: "#fff",
                    borderRadius: 2,
                    boxShadow: "none",
                  }}
                >
                  <PhoneIcon sx={{ color: "#64748b", mr: 1 }} />
                  <Typography fontWeight="bold" mr={1}>
                    Phone Number
                  </Typography>
                  <Typography>{fallback(user?.contactNumber)}</Typography>
                </Paper>
                <Paper
                  variant="outlined"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 1.2,
                    bgcolor: "#fff",
                    borderRadius: 2,
                    boxShadow: "none",
                  }}
                >
                  <MailIcon sx={{ color: "#64748b", mr: 1 }} />
                  <Typography fontWeight="bold" mr={1}>
                    Email
                  </Typography>
                  <Typography>{fallback(user?.emailId)}</Typography>
                </Paper>
              </Card>
            </Grid>

            <Grid sx={{ minWidth: "49%" }}>
              <Card
                variant="outlined"
                sx={{
                  borderRadius: 3,
                  p: 2.5,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                  minHeight: 180,
                  bgcolor: "#f8fafc",
                }}
              >
                <Box display="flex" alignItems="center" mb={2}>
                  <LocationIcon sx={{ color: "#a855f7", mr: 1 }} />
                  <Typography variant="h6" fontWeight="bold">
                    Location Details
                  </Typography>
                </Box>
                <Paper
                  variant="outlined"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 1.2,
                    mb: 1.5,
                    bgcolor: "#fff",
                    borderRadius: 2,
                    boxShadow: "none",
                  }}
                >
                  <VillaIcon sx={{ color: "#64748b", mr: 1 }} />
                  <Typography fontWeight="bold" mr={1}>
                    Pincode
                  </Typography>
                  <Typography>{fallback(user?.pinCode)}</Typography>
                </Paper>

                <Paper
                  variant="outlined"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 1.2,
                    mb: 1.5,
                    bgcolor: "#fff",
                    borderRadius: 2,
                    boxShadow: "none",
                  }}
                >
                  <LocationIcon sx={{ color: "#64748b", mr: 1 }} />
                  <Typography fontWeight="bold" mr={1}>
                    State
                  </Typography>
                  <Typography>{fallback(user?.state)}</Typography>
                </Paper>
                <Paper
                  variant="outlined"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 1.2,
                    bgcolor: "#fff",
                    borderRadius: 2,
                    boxShadow: "none",
                  }}
                >
                  <ApartmentIcon sx={{ color: "#64748b", mr: 1 }} />
                  <Typography fontWeight="bold" mr={1}>
                    City
                  </Typography>
                  <Typography>{fallback(user?.city)}</Typography>
                </Paper>
              </Card>
            </Grid>
          </Grid>

          <Card
            variant="outlined"
            sx={{
              borderRadius: 3,
              p: 2.5,
              boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
              mb: 3,
              bgcolor: "#f8fafc",
            }}
          >
            <Box display="flex" alignItems="center" mb={2}>
              <HomeIcon sx={{ color: "#f59e42", mr: 1 }} />
              <Typography variant="h6" fontWeight="bold">
                Business Address
              </Typography>
            </Box>
            <Paper
              variant="outlined"
              sx={{
                display: "flex",
                alignItems: "center",
                p: 1.2,
                bgcolor: "#fff",
                borderRadius: 2,
                boxShadow: "none",
                mb: 1.5,
              }}
            >
              <LocationIcon sx={{ color: "#64748b", mr: 1 }} />
              <Typography>{fallback(user?.address)}</Typography>
            </Paper>
            <Stack direction="row" spacing={1}>
              {user?.city && <Chip label={user.city} variant="outlined" />}
              {user?.state && <Chip label={user.state} variant="outlined" />}
              {user?.pinCode && (
                <Chip label={user.pinCode} variant="outlined" />
              )}
            </Stack>
          </Card>
        </Paper>

        <Card
          sx={{
            marginTop: "20px",
            borderRadius: 3,
            boxShadow: 0,
            background: "rgba(255,255,255,0.85)",
            p: { xs: 2, sm: 3 },
          }}
        >
          <Box mt={4}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mt={3}
              mb={2}
            >
              <Typography variant="h6" fontWeight={600}>
                Company Sales Order Details
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  onClick={() =>
                    navigate("/salesOrder/new", {
                      state: { companyData: user },
                    })
                  }
                  variant="contained"
                  startIcon={<Iconify icon="eva:plus-fill" />}
                  className="text-nowrap"
                >
                  Add Sales Order
                </Button>
              </Box>
            </Box>
            <Box mt={3}>
              <Tabs
                value={selectedSite}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
              >
                {user?.siteDetail?.map((site, index) => (
                  <Tab key={site._id} label={site.siteName} />
                ))}
              </Tabs>

              <Box mt={3}>
                {user?.siteDetail?.[selectedSite]?.salesOrder?.length > 0 ? (
                  <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>SNo.</TableCell>
                          <TableCell>Sales Order Date</TableCell>
                          <TableCell>Sales Order No.</TableCell>
                          <TableCell>Sales Order Quantity</TableCell>
                          <TableCell>Contractor</TableCell>
                          <TableCell>Order Completion Date</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell align="center">Actions</TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {user.siteDetail[selectedSite].salesOrder.map(
                          (order, index) => (
                            <TableRow key={order._id}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>
                                {new Date(
                                  order.purchaseDate
                                ).toLocaleDateString()}
                              </TableCell>
                              <TableCell>{order.billNumber || "-"}</TableCell>
                              <TableCell>
                                {order.numberOfCoolersPurchased || "-"}
                              </TableCell>
                              <TableCell>
                                {user.siteDetail[selectedSite]?.contractorId
                                  ? `${user.siteDetail[selectedSite].contractorId.firstName} ${user.siteDetail[selectedSite].contractorId.lastName}`
                                  : "-"}
                              </TableCell>
                              <TableCell>
                                <Typography>
                                  {order?.orderCompletionDate
                                    ? moment(order.orderCompletionDate).format(
                                        "DD/MM/YYYY"
                                      )
                                    : "-"}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <FormControl fullWidth>
                                  <InputLabel>Status</InputLabel>
                                  <Select
                                    value={
                                      orderStatuses[order._id] || order.status
                                    }
                                    onChange={(event) =>
                                      handleStatusChange(event, order._id)
                                    }
                                    label="Status"
                                    disabled={
                                      orderStatuses[order._id] === "Completed"
                                    }
                                  >
                                    {statusOptions.map((status) => (
                                      <MenuItem key={status} value={status}>
                                        {status}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </TableCell>
                              <TableCell align="center">
                                <IconButton
                                  onClick={(e) => handleMenuOpen(e, order._id)}
                                >
                                  <MoreVertIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          )
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <TableNoData
                    isNotFound={
                      user?.siteDetail[selectedSite]?.salesOrder?.length === 0
                    }
                  />
                )}
              </Box>
            </Box>
          </Box>
        </Card>
      </Container>
      <MenuPopover
        open={menuAnchorEl}
        onClose={handleMenuClose}
        arrow="right-top"
        sx={{
          width: "auto",
        }}
      >
        <MenuItem
          onClick={() => {
            navigate(`/salesOrder/edit/${menuOrderId}`);
            handleMenuClose();
          }}
        >
          <Iconify icon="eva:edit-fill" />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            setOpenPartsHistoryDialog(true);
            handleMenuClose();
          }}
        >
          <Iconify icon="eva:eye-outline" />
          View Parts History
        </MenuItem>

        {user?.siteDetail[selectedSite]?.salesOrder?.find(
          (order) => order._id === menuOrderId
        )?.status === "Completed" && (
          <MenuItem
            onClick={() => {
              setOpenServiceScheduleDialog(true);
              handleMenuClose();
            }}
          >
            <AiTwotoneSchedule />
            Set Service Schedule
          </MenuItem>
        )}

        {user?.siteDetail[selectedSite]?.salesOrder?.find(
          (order) => order._id === menuOrderId
        )?.status === "Warranty Started" && (
          <MenuItem
            onClick={() => {
              navigate(`/serviceSchedule/view/${menuOrderId}`);
              handleMenuClose();
            }}
          >
            <AiTwotoneSchedule />
            View Service Schedule
          </MenuItem>
        )}
      </MenuPopover>
      <SetServiceScheduleDialog
        open={openServiceScheduleDialog}
        onClose={() => setOpenServiceScheduleDialog(false)}
        row={menuOrderId}
      />
      <ViewPartsHistoryDialog
        open={openPartsHistoryDialog}
        onClose={() => setOpenPartsHistoryDialog(false)}
        row={menuOrderId}
      />
    </>
  );
};

export default Index;
