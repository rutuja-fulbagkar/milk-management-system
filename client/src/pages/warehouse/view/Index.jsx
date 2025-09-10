import {
  Apartment as ApartmentIcon,
  CalendarToday as CalendarIcon,
  Code as CodeIcon,
  Email as EmailIcon,
  Home as HomeIcon,
  LocationOn as LocationIcon,
  Mail as MailIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  CheckCircle as StatusIcon,
  Person as SupervisorIcon,
  Update as UpdateIcon,
  Warehouse as WarehouseIcon,
} from "@mui/icons-material";
import BusinessIcon from "@mui/icons-material/Business";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import VillaIcon from "@mui/icons-material/Villa";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Typography
} from "@mui/material";
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import ResponsivePaperWrapper from "../../../components/table/ResponsivePaperWrapper";
import { getwarehousebyId } from "../../../redux/slices/warehouse/warehouseApi";
import { useDispatch } from "../../../redux/store";

const Index = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [warehouse, setWarehouse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      dispatch(getwarehousebyId(id)).then((response) => {
        if (response.payload && response.payload.success) {
          setWarehouse(response.payload.data);
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
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  const fallback = (val) => val || "N/A";
  const formatDate = (dateStr) => {
    return dateStr ? new Date(dateStr).toLocaleString() : "N/A";
  };

  const fields = [
    {
      icon: <WarehouseIcon color="primary" />,
      label: "Name",
      value: fallback(warehouse?.name),
    },
    {
      icon: <CodeIcon color="secondary" />,
      label: "Code",
      value: fallback(warehouse?.code),
    },
    {
      icon: <LocationIcon color="error" />,
      label: "Location",
      value: fallback(warehouse?.location),
    },
    {
      icon: <SupervisorIcon color="info" />,
      label: "Supervisor Name",
      value: fallback(
        `${warehouse?.supervisor?.firstName || ""} ${
          warehouse?.supervisor?.lastName || ""
        }`.trim()
      ),
    },
    {
      icon: <MailIcon color="info" />,
      label: "Supervisor Email",
      value: fallback(warehouse?.supervisor?.email),
    },
    {
      icon: (
        <StatusIcon
          color={warehouse?.status === "Active" ? "success" : "error"}
        />
      ),
      label: "Status",
      value: (
        <span
          className={`inline-flex items-center rounded-md ${
            warehouse?.status === "Active"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          } px-2 py-1 text-xs font-medium ring-1 ring-inset`}
        >
          {warehouse?.status}
        </span>
      ),
    },
    {
      icon: <CalendarIcon color="action" />,
      label: "Created At",
      value: formatDate(warehouse?.createdAt),
    },
    {
      icon: <UpdateIcon color="action" />,
      label: "Updated At",
      value: formatDate(warehouse?.updatedAt),
    },
  ];

  return (
    <>
      <Container maxWidth="2xl">
        <ResponsivePaperWrapper>
          <Box className="w-full py-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <Typography variant="h5" fontWeight="bold">
              Warehouse Details
            </Typography>
            <Button variant="outlined" onClick={() => navigate("/warehouse")}>
              Back to List
            </Button>
          </Box>
        </ResponsivePaperWrapper>

 
        <Card
          variant="outlined"
          sx={{
            borderRadius: 3,
            p: 2.5,
            mb: 3,
            bgcolor: "#fff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
          }}
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
                    {fallback(warehouse.name)}
                    </Typography>

                    <Typography
              variant="body2"
              sx={{
                mt: 1,
                background: "rgba(255,255,255,0.15)",
                px: 2,
                py: 0.5,
                borderRadius: 1,
                display: "inline-block",
                fontWeight: 500,
              }}
            >
              Warehouse Code: {fallback(warehouse.code)}
            </Typography>
                  </Box>
                  <WarehouseIcon sx={{ fontSize: 48, opacity: 0.9 }} />
                </Box>
              </ResponsivePaperWrapper>

              <Grid container spacing={2} mb={3}>
                <Grid item xs={12} md={6} sx={{ minWidth: "49%" }}>
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
                      Supervisor Name
                      </Typography>
                      <Box>
                        <Typography fontSize="1rem" color="text.primary">
                        {`${warehouse.supervisor?.firstName || ""} ${
                        warehouse.supervisor?.lastName || ""
                      }`.trim() || "N/A"}
                        </Typography>
                      </Box>
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
                      Supervisor Email


                      </Typography>
                      <Typography>{fallback(warehouse.supervisor?.email)}</Typography>
                    </Paper>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6} sx={{ minWidth: "49%" }}>
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
                       <ApartmentIcon sx={{ color: "#64748b", mr: 1 }} />
                    <Typography fontWeight="bold" mr={1}>
                      Location
                    </Typography>
                    <Typography>{fallback(warehouse.location)}</Typography>
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
                      <StatusIcon
                      sx={{
                        color:
                          warehouse.status === "Active" ? "#22c55e" : "#ef4444",
                        mr: 1,
                      }}
                    />
                    <Typography fontWeight="bold" mr={1}>
                      Status
                    </Typography>
                    <Typography>{fallback(warehouse.status)}</Typography>
                    </Paper>
                  </Card>
                </Grid>
              <Grid item xs={12} md={6}>
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: 3,
                    p: 2.5,
                    bgcolor: "#fff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                  }}
                >
                  <Box display="flex" alignItems="center" mb={2}>
                    <CalendarIcon sx={{ color: "#2563eb", mr: 1 }} />
                    <Typography variant="h6" fontWeight="bold">
                      Created At
                    </Typography>
                  </Box>
                  <Typography>{formatDate(warehouse.createdAt)}</Typography>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: 3,
                    p: 2.5,
                    bgcolor: "#fff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                  }}
                >
                  <Box display="flex" alignItems="center" mb={2}>
                    <UpdateIcon sx={{ color: "#6366f1", mr: 1 }} />
                    <Typography variant="h6" fontWeight="bold">
                      Updated At
                    </Typography>
                  </Box>
                  <Typography>{formatDate(warehouse.updatedAt)}</Typography>
                </Card>
              </Grid>
              </Grid>

            </Card>
      </Container>
    </>
  );
};

export default Index;


 