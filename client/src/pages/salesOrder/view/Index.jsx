import { Person as SupervisorIcon } from "@mui/icons-material";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BusinessIcon from "@mui/icons-material/Business";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import NumbersIcon from "@mui/icons-material/Numbers";
import UpdateIcon from "@mui/icons-material/Update";
import {
  Box,
  Card,
  Chip,
  CircularProgress,
  Container,
  Fade,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ResponsivePaperWrapper from "../../../components/table/ResponsivePaperWrapper";
import { getsalesOrdersbyId } from "../../../redux/slices/salesOrder/salesOrderApi";
import { useDispatch } from "../../../redux/store";

const Index = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [salesOrder, setSalesOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      dispatch(getsalesOrdersbyId(id)).then((response) => {
        if (response.payload && response.payload.success) {
          setSalesOrder(response.payload.data);
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
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return date.toLocaleDateString("en-GB", options);
  };

  const fallback = (val) => val || "N/A";

  return (
    <Fade in>
      <Container maxWidth="2xl" sx={{ minHeight: "100vh" }}>
        <ResponsivePaperWrapper>
          <Box className="w-full py-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <Typography variant="h5" fontWeight="bold">
              Sales Order Details
            </Typography>
            <IconButton
              variant="outlined"
              onClick={() => navigate("/salesOrder")}
            >
              <ArrowBackIcon />
            </IconButton>
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
                  {fallback(salesOrder?.companyId?.companyName)}
                </Typography>

                <Typography variant="body2" component="span">
                  {salesOrder?.siteId?.siteName && (
                    <Chip
                      label={salesOrder?.siteId?.siteName}
                      variant="outlined"
                      sx={{ color: "#f0f7f2" }}
                    />
                  )}
                </Typography>
              </Box>
              <BusinessIcon sx={{ fontSize: "40px", color: "white" }} />
            </Box>
          </ResponsivePaperWrapper>
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} sm={12} md={12} sx={{ minWidth: "100%" }}>
              <Card
                fullWidth
                variant="outlined"
                sx={{
                  borderRadius: 3,
                  p: 2.5,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                  minHeight: 180,
                  bgcolor: "#f8fafc",
                }}
              >
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
                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={1}>
                      <SupervisorIcon sx={{ color: "#64748b" }} />
                    </Grid>
                    <Grid item xs={3}>
                      <Typography fontWeight="bold">Bill Number</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography fontSize="1rem" color="text.primary">
                        {salesOrder?.billNumber || "-"}
                      </Typography>
                    </Grid>
                  </Grid>
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
                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={1}>
                      <NumbersIcon sx={{ color: "#64748b" }} />
                    </Grid>
                    <Grid item xs={3}>
                      <Typography fontWeight="bold">
                        {salesOrder?.numberOfCoolersPurchased > 0
                          ? "Number Of Coolers Purchased"
                          : salesOrder?.numberOfCoolersForService > 0
                          ? "Number Of Coolers For Service"
                          : "Number Of Coolers Purchased"}
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography>
                        {salesOrder?.numberOfCoolersPurchased > 0
                          ? salesOrder.numberOfCoolersPurchased
                          : salesOrder?.numberOfCoolersForService > 0
                          ? salesOrder.numberOfCoolersForService
                          : salesOrder?.numberOfCoolersPurchased}
                      </Typography>
                    </Grid>
                  </Grid>
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
                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={1}>
                      <CalendarTodayIcon sx={{ color: "#64748b" }} />
                    </Grid>
                    <Grid item xs={3}>
                      <Typography fontWeight="bold">Purchase Date</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography>
                        {formatDate(salesOrder?.purchaseDate)}
                      </Typography>
                    </Grid>
                  </Grid>
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
                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={1}>
                      <UpdateIcon sx={{ color: "#64748b" }} />
                    </Grid>
                    <Grid item xs={3}>
                      <Typography fontWeight="bold">
                        Order Completion Date
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography>
                        {formatDate(salesOrder?.orderCompletionDate)}
                      </Typography>
                    </Grid>
                  </Grid>
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
                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={1}>
                      <AcUnitIcon sx={{ color: "#64748b" }} />
                    </Grid>
                    <Grid item xs={3}>
                      <Typography fontWeight="bold">Status</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Chip
                        label={salesOrder?.status || "Unknown"}
                        color="#0963ac"
                        variant="filled"
                        sx={{ fontWeight: 600 }}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Card>
            </Grid>
          </Grid>
        </Paper>
        <Typography
          variant="h6"
          fontWeight={600}
          gutterBottom
          sx={{ mt: "10px" }}
        >
          Product Details
        </Typography>
        <Paper
          elevation={6}
          className="px-2 sm:px-6 lg:px-8 py-8 max-w-9xl mx-auto mt-[10px]"
        >
          {Array.isArray(salesOrder?.coolerDetails) &&
            salesOrder.coolerDetails.length > 0 && (
              <Box>
                <TableContainer component={Paper} sx={{ boxShadow: 0 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                        <TableCell>
                          <strong>S.No</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Serial Number</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Model Number</strong>
                        </TableCell>
                          <TableCell>
                          <strong>Make</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {salesOrder?.coolerDetails?.map((product, index) => (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            {product?.serialNumber || "N/A"}
                          </TableCell>
                          <TableCell>{product?.modelNumber || "N/A"}</TableCell>
                           <TableCell>{product?.make || "N/A"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
        </Paper>
      </Container>
    </Fade>
  );
};

export default Index;
