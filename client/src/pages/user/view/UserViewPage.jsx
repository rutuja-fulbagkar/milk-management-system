import {
  Box,
  Card,
  Container,
  Typography,
  Divider,
  CircularProgress,
  IconButton,
  Fade,
  Stack,
  Paper,
  Tabs,
  Tab,
  Grid,
  Chip,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  Apartment as ApartmentIcon,
  LocationOn as LocationIcon,
  Mail as MailIcon,
  Person as SupervisorIcon,
} from "@mui/icons-material";
import VillaIcon from "@mui/icons-material/Villa";
import HomeIcon from "@mui/icons-material/Home";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BusinessIcon from "@mui/icons-material/Business";
import { useParams, useNavigate } from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import PinIcon from "@mui/icons-material/Pin";
import { useDispatch } from "../../../redux/store";
import { getuserbyId } from "../../../redux/slices/user/userApi";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LocationPinIcon from "@mui/icons-material/LocationPin";
import LockIcon from "@mui/icons-material/Lock";
import PhoneIcon from "@mui/icons-material/Phone";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import UpdateIcon from "@mui/icons-material/Update";
import moment from "moment";
import TableNoData from "../../../components/table/TableNoData";
import EmptyContentSmall from "../../../components/empty-content/EmptyContentSmall";
import ResponsivePaperWrapper from "../../../components/table/ResponsivePaperWrapper";

function a11yProps(index) {
  return {
    id: `user-tab-${index}`,
    "aria-controls": `user-tabpanel-${index}`,
  };
}

const fieldIcons = [
  <PersonIcon color="primary" />,
  <LockIcon color="action" />,
  <EmailIcon color="secondary" />,
  <PhoneIcon color="success" />,
  <LocationPinIcon color="primary" />,
  <VerifiedUserIcon color="info" />,
  <LocationOnIcon color="disabled" />,
  <PinIcon color="action" />,
  <UpdateIcon color="error" />,
];

const backgroundColorfant = "#F7F7FB";
const backgroundColor = "#5E81F4";

const Index = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    if (id) {
      setLoading(true);
      dispatch(getuserbyId(id)).then((response) => {
        if (response.payload && response.payload.success) {
          setUser(response.payload.data);
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

  const fallback = (val) => val || "N/A";
  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleString() : "N/A";

  const fields = [
    { label: "Employee Code", value: fallback(user?.employeeId) },
    {
      label: "User Name",
      value: fallback(
        `${user?.firstName || ""} ${user?.lastName || ""}`.trim()
      ),
    },
    { label: "Email", value: fallback(user?.email) },
    { label: "Mobile", value: fallback(user?.mobile) },
    { label: "User Role", value: fallback(user?.role?.name) },
    { label: "Address", value: fallback(user?.address) },
    { label: "City", value: fallback(user?.city) },
    { label: "State", value: fallback(user?.state) },
    { label: "Pincode", value: fallback(user?.pinCode) },
  ];

  const activities = user?.userActivityDetail?.[0]?.activities || [];

  return (
    <Fade in>
      <Container maxWidth="2xl" sx={{ minHeight: "100vh" }}>
        <ResponsivePaperWrapper>
          <Box className="w-full py-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <Typography variant="h5" fontWeight="bold">
              Staff Details
            </Typography>
            <IconButton variant="outlined" onClick={() => navigate("/user")}>
              <ArrowBackIcon />
            </IconButton>
          </Box>
        </ResponsivePaperWrapper>
        <Paper
          elevation={6}
          className="px-2 sm:px-6 lg:px-8 py-8 max-w-9xl mx-auto"
        >
          <Tabs
            value={tab}
            onChange={(_, newValue) => setTab(newValue)}
            aria-label="User tabs"
            sx={{
              mb: 2,
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            <Tab label="Overview" {...a11yProps(0)} />
            <Tab label="Activity" {...a11yProps(1)} />
          </Tabs>

          {tab === 0 && (
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 0,
                background: "rgba(255,255,255,0.85)",
                p: { xs: 2, sm: 3 },
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
                      {fallback(user?.firstName)} {fallback(user?.lastName)}
                    </Typography>

                    <Typography variant="body2">
                      {fallback(user?.role?.name)}
                    </Typography>
                  </Box>
                  <BusinessIcon sx={{ fontSize: "40px", color: "white" }} />
                </Box>
              </ResponsivePaperWrapper>

              <Grid container spacing={2} mb={3}>
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
                          {fallback(user?.firstName)} {fallback(user?.lastName)}
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
                      <Typography>{fallback(user?.mobile)}</Typography>
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
                      <Typography>{fallback(user?.email)}</Typography>
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
                  {user?.state && (
                    <Chip label={user.state} variant="outlined" />
                  )}
                  {user?.pinCode && (
                    <Chip label={user.pinCode} variant="outlined" />
                  )}
                </Stack>
              </Card>
            </Card>
          )}

          {tab === 1 && (
            <Box>
              {activities.length === 0 ? (
                <EmptyContentSmall
                  title="No Data"
                  sx={{
                    "& span.MuiBox-root": { height: 80 },
                  }}
                />
              ) : (
                activities.map((row, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      background: backgroundColorfant,
                      padding: "10px",
                      marginY: "10px",
                      borderRadius: "8px",
                    }}
                  >
                    <Box sx={{ display: "flex", gap: "10px" }}>
                      <Box sx={{ marginTop: "2px" }}>
                        <Box
                          sx={{
                            fontSize: "12px",
                            color: "#0000006c",
                            textTransform: "capitalize",
                          }}
                        >
                          {row?.timestamp && moment(row.timestamp).isValid()
                            ? moment(row?.timestamp).format(
                                " DD/MM/YY hh:mm A "
                              )
                            : "N/A"}
                        </Box>
                        <Box
                          sx={{
                            fontSize: "15px",
                            color: "#0000006c",
                            textTransform: "capitalize",
                          }}
                        >
                          <Box
                            className="rounded-lg px-2 text-white"
                            sx={{
                              fontSize: "10px",
                              backgroundColor: backgroundColor,
                              width: "fit-content",
                              height: "fit-content",
                              gap: "2px",
                              margin:
                                row?.type === "contractor" ? "0 auto" : "unset",
                            }}
                          >
                            {row?.action}
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            fontSize: "12px",
                            marginTop: "4px",
                            color: "#0000006c",
                            textTransform: "capitalize",
                          }}
                        >
                          <Box
                            className="rounded-lg px-2 text-white"
                            style={{
                              fontSize: "10px",
                              backgroundColor: "gray",
                              width: "fit-content",
                              height: "fit-content",
                              gap: "2px",
                            }}
                          >
                            {row?.module}
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            fontSize: "15px",
                            color: "#686D76",
                            textTransform: "capitalize",
                          }}
                        >
                          {row?.message}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                ))
              )}
            </Box>
          )}
        </Paper>
      </Container>
    </Fade>
  );
};

export default Index;
