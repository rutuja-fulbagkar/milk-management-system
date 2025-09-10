import {
  Apartment as ApartmentIcon,
  LocationOn as LocationIcon,
  Person as SupervisorIcon,
} from "@mui/icons-material";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import CloseIcon from "@mui/icons-material/Close";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices";
import BusinessIcon from "@mui/icons-material/Business";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import HomeIcon from "@mui/icons-material/Home";
import NumbersIcon from "@mui/icons-material/Numbers";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VillaIcon from "@mui/icons-material/Villa";
import {
  Box,
  Card,
  Chip,
  CircularProgress,
  Container,
  Fade,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Modal,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ResponsivePaperWrapper from "../../../components/table/ResponsivePaperWrapper";
import { getServiceViewbyId } from "../../../redux/slices/service/serviceApi";
import { useDispatch } from "../../../redux/store";
import { API_BASE_URL } from "../../../utils/api";

const Index = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fileNames, setfileNames] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      dispatch(getServiceViewbyId(id)).then((response) => {
        if (response.payload && response.payload.success) {
          setService(response.payload.data);
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
  const InfoRow = ({ icon, label, value, tooltip }) => {
    const IconComponent = icon;

    return (
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid
          item
          xs={12}
          sm={5}
          md={5}
          lg={4}
          sx={{ display: "flex", alignItems: "center" }}
        >
          <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
            <IconComponent sx={{ fontSize: 32, mr: 1.5 }} />
            <Typography variant="subtitle1" fontWeight={600}>
              {label}:
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={7} md={7} lg={8}>
          {tooltip ? (
            <Tooltip title={tooltip} arrow placement="right">
              <Typography variant="body1" color="text.secondary">
                {value}
              </Typography>
            </Tooltip>
          ) : (
            <Typography variant="body1" color="text.secondary">
              {value}
            </Typography>
          )}
        </Grid>
      </Grid>
    );
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleOpeneModal = (file) => {
    setOpenModal(true);
    setfileNames(file);
  };

  const getFileType = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif"].includes(extension)) {
      return "image";
    } else if (extension === "pdf") {
      return "pdf";
    } else if (["mp4", "avi", "mov"].includes(extension)) {
      return "video";
    } else if (["xls", "xlsx", "csv"].includes(extension)) {
      return "excel";
    }
    return "unknown";
  };

  const renderLimitedList = (items) => {
    const visibleItems = items.slice(0, 2);
    const remainingCount = items.length - 2;

    return (
      <>
        <List>
          {visibleItems?.map((id, index) => (
            <ListItem key={index}>
              <Typography
                variant="body1"
                component="span"
                style={{ marginRight: "8px" }}
              >
                {index + 1}.
              </Typography>
              <ListItemText primary={id} />
            </ListItem>
          ))}
        </List>
        {remainingCount > 0 && (
          <Typography variant="caption" color="text.secondary">
            +{remainingCount} more
          </Typography>
        )}
      </>
    );
  };

  const renderTooltipList = (items) => (
    <List>
      {items.map((id, index) => (
        <ListItem key={index}>
          <Typography
            variant="body1"
            component="span"
            style={{ marginRight: "8px" }}
          >
            {index + 1}.
          </Typography>
          <ListItemText primary={id} />
        </ListItem>
      ))}
    </List>
  );

  return (
    <Fade in>
      <Container maxWidth="xl" sx={{ minHeight: "100vh" }}>
        <ResponsivePaperWrapper>
          <Box className="w-full py-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <Typography variant="h5" fontWeight="bold">
              Service Details
            </Typography>
            <IconButton
              variant="outlined"
              onClick={() => navigate("/serviceMgt")}
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
                  {fallback(service?.orderDetails?.companyId?.companyName)}
                </Typography>

                <Typography variant="body2" component="span">
                  {service?.orderDetails?.siteId?.siteName && (
                    <Chip
                      label={service?.orderDetails?.siteId?.siteName}
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
                  <HomeIcon sx={{ color: "#22c55e", mr: 1 }} />
                  <Typography variant="h6" fontWeight="bold">
                    Order Details
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
                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={1}>
                      <SupervisorIcon sx={{ color: "#64748b" }} />
                    </Grid>
                    <Grid item xs={3}>
                      <Typography fontWeight="bold">Bill Number</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography fontSize="1rem" color="text.primary">
                        {service?.orderDetails?.billNumber || "-"}
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
                        Number Of Coolers Purchased
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography>
                        {fallback(
                          service?.orderDetails?.numberOfCoolersPurchased
                        )}
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
                        label={service?.status || "Unknown"}
                        color="#0963ac"
                        variant="filled"
                        sx={{ fontWeight: 600 }}
                      />
                    </Grid>
                  </Grid>
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
                  <HomeIcon sx={{ color: "#f57b42", mr: 1 }} />
                  <Typography variant="h6" fontWeight="bold">
                    Order Details
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
                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={1}>
                      <VillaIcon sx={{ color: "#64748b" }} />
                    </Grid>
                    <Grid item xs={3}>
                      <Typography fontWeight="bold"> Warranty Id</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography fontSize="1rem" color="text.primary">
                        {fallback(service?.warrantyId)}
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
                      <CalendarMonthIcon sx={{ color: "#64748b" }} />
                    </Grid>
                    <Grid item xs={3}>
                      <Typography fontWeight="bold">
                        {" "}
                        Warranty Period
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography fontSize="1rem" color="text.primary">
                        {formatDate(service?.warrantyStartDate)} To{" "}
                        {formatDate(service?.warrantyEndDate)}
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
                      <ApartmentIcon sx={{ color: "#64748b" }} />
                    </Grid>
                    <Grid item xs={3}>
                      <Typography fontWeight="bold"> Contractor</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography fontSize="1rem" color="text.primary">
                        {fallback(
                          service?.orderDetails?.siteId?.contractorId?.firstName
                        )}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Card>
            </Grid>
            <Grid sx={{ width: "100%" }}>
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
                  <MiscellaneousServicesIcon sx={{ color: "#a855f7", mr: 1 }} />
                  <Typography variant="h6" fontWeight="bold">
                    Service Details
                  </Typography>
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                        <TableCell>Service ID</TableCell>
                        <TableCell>Service Date</TableCell>
                        <TableCell>Service Sequence</TableCell>
                        <TableCell>Service By</TableCell>
                        <TableCell>Service Completion Date</TableCell>
                        <TableCell>Remarks</TableCell>
                        <TableCell>Parts Used</TableCell>
                        <TableCell>Document Upload</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell
                          sx={{ cursor: "pointer" }}
                          onClick={() =>
                            navigate(`/serviceMgt/view/${service._id}`)
                          }
                        >
                          {service?.serviceDetails?._id}
                        </TableCell>
                        <TableCell>
                          {moment(service?.serviceDetails?.serviceDate).format(
                            "DD/MM/YYYY"
                          )}
                        </TableCell>
                        <TableCell>
                          {service?.serviceDetails?.serviceSequence}
                        </TableCell>
                        <TableCell>
                          <Typography>
                            {service?.serviceDetails?.serviceBy?.length > 0
                              ? service?.serviceDetails?.serviceBy
                                  .map(
                                    (person) =>
                                      `${person.firstName} ${person.lastName}`
                                  )
                                  .join(", ")
                              : "N/A"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {service?.serviceDetails?.serviceCompletionDate
                            ? moment(
                                service?.serviceDetails?.serviceCompletionDate
                              ).format("DD/MM/YYYY")
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          {service?.serviceDetails?.remarks || "N/A"}
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" alignItems="center">
                            <Tooltip
                              title={renderTooltipList(
                                service?.serviceDetails?.partsUsed?.map(
                                  (item) =>
                                    `${item?.itemId?.itemName || "-"} (${
                                      item?.quantity
                                    } ${item?.itemId?.unitType})`
                                ) || []
                              )}
                              arrow
                            >
                              <Typography variant="subtitle2" noWrap>
                                {renderLimitedList(
                                  service?.serviceDetails?.partsUsed?.map(
                                    (item) =>
                                      `${item?.itemId?.itemName || "-"} (${
                                        item?.quantity
                                      } ${item?.itemId?.unitType})`
                                  ) || []
                                )}
                              </Typography>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          {service?.serviceDetails?.photo === "" ? (
                            "Not Uploaded"
                          ) : (
                            <IconButton
                              onClick={() =>
                                handleOpeneModal(service?.serviceDetails?.photo)
                              }
                            >
                              <RemoveRedEyeIcon />
                            </IconButton>
                          )}
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              width: 16,
                              height: 16,
                              borderRadius: "50%",
                              backgroundColor: (() => {
                                switch (
                                  service?.serviceDetails?.serviceStatus
                                ) {
                                  case "Pending":
                                    return "yellow";
                                  case "Inprogress":
                                    return "orange";
                                  case "Completed":
                                    return "green";
                                  default:
                                    return "gray";
                                }
                              })(),
                              display: "inline-block",
                              marginRight: 1,
                            }}
                          />
                          {service?.serviceDetails?.serviceStatus}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </Grid>
          </Grid>
        </Paper>
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="file-modal"
          aria-describedby="file-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "98vw", sm: "80vw" },
              height: { xs: "90vh", sm: "80vh" },
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              borderRadius: 2,
              maxWidth: 900,
              maxHeight: "90vh",
            }}
          >
            <IconButton
              onClick={handleCloseModal}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                zIndex: 10,
              }}
            >
              <CloseIcon />
            </IconButton>

            {fileNames ? (
              (() => {
                const fileType = getFileType(fileNames);
                const file = fileNames.substring(
                  fileNames.lastIndexOf("/") + 1
                );
                const fileUrl = `${API_BASE_URL}/api/services/file/${encodeURIComponent(
                  file
                )}`;

                if (fileType === "image") {
                  return (
                    <Box
                      component="img"
                      src={fileUrl}
                      alt={file}
                      sx={{
                        maxWidth: "100%",
                        maxHeight: "70vh",
                        borderRadius: 2,
                        boxShadow: 2,
                        objectFit: "contain",
                      }}
                    />
                  );
                }

                if (fileType === "pdf") {
                  return (
                    <iframe
                      src={fileUrl}
                      width="100%"
                      height="600px"
                      title={`PDF Document ${file}`}
                      style={{
                        border: "none",
                        borderRadius: 8,
                        background: "#f3f3f3",
                        boxShadow: "0 2px 10px #0002",
                      }}
                    />
                  );
                }

                if (fileType === "video") {
                  return (
                    <video controls width="100%">
                      <source src={fileUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  );
                }

                if (fileType === "excel") {
                  return (
                    <Typography variant="body2" color="text.secondary">
                      Excel files cannot be previewed directly. You can download
                      it{" "}
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        here
                      </a>
                      .
                    </Typography>
                  );
                }

                return (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "60vh",
                      width: "100%",
                      gap: 2,
                    }}
                  >
                    <InsertDriveFileIcon
                      sx={{ fontSize: 80, color: "text.secondary" }}
                    />
                    <Typography variant="h6" noWrap>
                      {typeof fileNames === "string"
                        ? fileNames.substring(fileNames.lastIndexOf(".") + 1)
                        : ""}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      This file type cannot be previewed
                    </Typography>
                  </Box>
                );
              })()
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "60vh",
                  width: "100%",
                  gap: 2,
                }}
              >
                <InsertDriveFileIcon
                  sx={{ fontSize: 80, color: "text.secondary" }}
                />
                <Typography variant="h6">No file selected</Typography>
              </Box>
            )}
          </Box>
        </Modal>
      </Container>
    </Fade>
  );
};

export default Index;
