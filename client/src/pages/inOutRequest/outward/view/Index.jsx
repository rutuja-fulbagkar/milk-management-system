import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  Container,
  Grid,
  Typography,
  CircularProgress,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Tooltip,
  Avatar,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ReceiptIcon from '@mui/icons-material/Receipt';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { useDispatch } from '../../../../redux/store';
import { getInwardbyId } from '../../../../redux/slices/inward/inwardApi';
import ResponsivePaperWrapper from '../../../../components/table/ResponsivePaperWrapper';

// Color Constants
const COLORS = {
  primary: { main: '#0288d1', light: '#4fc3f7', hover: '#0277bd' },
  secondary: { main: '#00796b', light: '#4db6ac', hover: '#00695c' },
  background: { card: '#ffffff', paper: '#f7f9fc', paperHover: '#e8ecef', tableHeader: '#f1f5f9' },
  text: { primary: '#212121', secondary: '#616161' },
};

// Helper: Safely get user display name
const getUserName = (user) => {
  if (!user) return '-';
  if (typeof user === 'string') return user;
  if (user.firstName || user.lastName) return `${user.firstName || ''} ${user.lastName || ''}`.trim();
  return user.email || '-';
};

// Helper: Format date
const formatDate = (date) => {
  if (!date || !moment(date).isValid()) return '-';
  return moment(date).format('DD/MM/YYYY');
};

// Reusable Detail Card Component
const DetailCard = ({ title, details }) => (
  <Card
    variant="outlined"
    sx={{
      borderRadius: 3,
      p: 2.5,
      boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
      bgcolor: "#f8fafc",
    }}
  >
    <Typography variant="h6" fontWeight="bold" color={COLORS.text.primary} mb={2}>
      {title}
    </Typography>
    <Grid container spacing={2}>
      {details.map((detail, index) => (
        <Grid item xs={12} key={index}>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              bgcolor: '#fff',
              borderRadius: 2,
              boxShadow: 'none',

            }}
          >
            <Tooltip
              title={detail.tooltip}
              componentsProps={{
                tooltip: { sx: { bgcolor: COLORS.text.primary, color: '#fff', fontSize: '0.9rem' } },
              }}
            >
              <Box display="flex" flexDirection="column">
                <Box display="flex" alignItems="center">
                  <detail.icon
                    sx={{
                      color: detail.iconColor || COLORS.primary.light,
                      mr: 1,
                      fontSize: 20,
                      '&:hover': { color: COLORS.primary.hover },
                    }}
                  />
                  <Typography variant="subtitle2" fontWeight="bold" color={COLORS.text.primary}>
                    {detail.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color={COLORS.text.secondary} sx={{ mt: 0.5, ml: 3.5 }}>
                  {detail.component || detail.value}
                </Typography>
              </Box>
            </Tooltip>
          </Paper>
        </Grid>
      ))}
    </Grid>
  </Card>
);

// Reusable Item Table Component
const DetailTable = ({ items }) => (
  <Card
    variant="outlined"
    sx={{
      borderRadius: 3,
      p: 3,
      mb: 3,
      bgcolor: COLORS.background.card,
      boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
      transition: 'box-shadow 0.2s ease-in-out',
      '&:hover': { boxShadow: '0 6px 20px rgba(0,0,0,0.12)' },
    }}
  >
    <Typography
      variant="h6"
      fontWeight="bold"
      color={COLORS.text.primary}
      display="flex"
      alignItems="center"
      gap={1}
      mb={2}
    >
      <Inventory2Icon sx={{ color: COLORS.secondary.main }} />
      Item Details
    </Typography>
    <Box sx={{ overflowX: 'auto' }}>
      <Table>
        <TableHead sx={{ bgcolor: COLORS.background.tableHeader }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold', color: COLORS.text.primary }}>#</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: COLORS.text.primary }}>Item Name</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: COLORS.text.primary }}>Item Code</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: COLORS.text.primary }}>Category</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: COLORS.text.primary }}>Outward Qty</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items?.length ? (
            items.map((item, index) => (
              <TableRow
                key={item._id || index}
                sx={{
                  bgcolor: index % 2 === 0 ? COLORS.background.paper : COLORS.background.card,
                  transition: 'background-color 0.2s ease-in-out',
                  '&:hover': { bgcolor: COLORS.background.paperHover },
                }}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.itemId?.itemName || '-'}</TableCell>
                <TableCell>{item.itemCode || item.itemId?.itemCode || '-'}</TableCell>
                <TableCell>
                  {item.category?.categoryName ||
                    (typeof item.itemId?.category === 'string' ? item.itemId.category : '-') ||
                    '-'}
                </TableCell>
                <TableCell>
                  {typeof item.quantity === 'number' && item.unitType
                    ? `${item.quantity} ${item.unitType}`
                    : '-'}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} align="center">
                <Box display="flex" flexDirection="column" alignItems="center" py={4}>
                  <Inventory2Icon sx={{ fontSize: 48, color: COLORS.text.secondary, mb: 1 }} />
                  <Typography variant="body1" color={COLORS.text.secondary}>
                    No items found.
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  </Card>
);

const Index = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [inward, setInward] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      setError(null);
      dispatch(getInwardbyId(id))
        .then((res) => {
          if (res.payload && res.payload.success) {
            setInward(res.payload.data);
          } else {
            setError('Failed to fetch outward request data');
          }
          setLoading(false);
        })
        .catch(() => {
          setError('An error occurred while fetching data');
          setLoading(false);
        });
    }
  }, [id, dispatch]);

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress sx={{ color: COLORS.primary.main }} />
        <Typography variant="body1" sx={{ mt: 2, color: COLORS.text.secondary }}>
          Loading outward request details...
        </Typography>
      </Box>
    );
  }

  if (error || !inward) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <Inventory2Icon sx={{ fontSize: 48, color: COLORS.text.secondary, mb: 2 }} />
        <Typography variant="h6" color="error">
          {error || 'No outward request data available'}
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          sx={{
            mt: 2,
            bgcolor: COLORS.primary.main,
            '&:hover': { bgcolor: COLORS.primary.hover },
          }}
          onClick={() => navigate('/inward-outward-request?tab=outward')}
        >
          Back to List
        </Button>
      </Box>
    );
  }

  const requestDetails = [
    {
      title: 'Request ID',
      icon: AssignmentIcon,
      value: inward?.newId ? inward?.newId : inward?.requestId || '-',
      tooltip: 'Unique identifier for the outward request',
      iconColor: COLORS.primary.light,
    },
    {
      title: 'Request Date',
      icon: CalendarTodayIcon,
      value: formatDate(inward?.requestedDate),
      tooltip: 'Date the outward request was made',
      iconColor: COLORS.primary.light,
    },
    {
      title: 'Requested By',
      icon: PersonIcon,
      value: getUserName(inward?.requestedBy),
      tooltip: 'Person who initiated the request',
      iconColor: COLORS.primary.light,
    },
    {
      title: 'Usage Location',
      icon: LocationOnIcon,
      value: inward?.siteId?.siteName || '-',
      tooltip: 'Location where the items will be used',
      iconColor: COLORS.primary.light,
    },
    {
      title: 'Order No.',
      icon: ConfirmationNumberIcon,
      value: inward?.billNumber || '-',
      tooltip: 'Order number associated with the request',
      iconColor: COLORS.primary.light,
    },
  ];

  const approvalDetails = [
    {
      title: 'Approval Status',
      icon: VerifiedUserIcon,
      component: (
        <Chip
          label={inward?.status || '-'}
          color={
            inward?.status === 'Approved'
              ? 'success'
              : inward?.status === 'Rejected'
                ? 'error'
                : 'warning'
          }
          variant="outlined"
          size="small"
          sx={{ fontWeight: 'medium' }}
        />
      ),
      tooltip: 'Current approval status of the request',
      iconColor: COLORS.primary.light,
    },
    {
      title: 'Approval Status By',
      icon: PersonIcon,
      value: getUserName(inward?.approvedBy),
      tooltip: 'Person who approved the request',
      iconColor: COLORS.primary.light,
    },
    {
      title: 'Rejected Status By',
      icon: PersonIcon,
      value: getUserName(inward?.rejectedBy),
      tooltip: 'Person who rejected the request',
      iconColor: COLORS.primary.light,
    },
  ];

  const additionalDetails = [
    {
      title: 'Created At',
      icon: CalendarTodayIcon,
      value: formatDate(inward?.createdAt),
      tooltip: 'Date the request was created',
      iconColor: COLORS.primary.light,
    },
    {
      title: 'Updated At',
      icon: CalendarTodayIcon,
      value: formatDate(inward?.updatedAt),
      tooltip: 'Date the request was last updated',
      iconColor: COLORS.primary.light,
    },
    {
      title: 'Approved Date',
      icon: CalendarTodayIcon,
      value: formatDate(inward?.approvedDate),
      tooltip: 'Date the request was approved',
      iconColor: COLORS.primary.light,
    },
    {
      title: 'Rejection Date',
      icon: CalendarTodayIcon,
      value: formatDate(inward?.rejectionDate),
      tooltip: 'Date the request was rejected',
      iconColor: COLORS.primary.light,
    },
  ];

  return (
    <Container maxWidth="2xl" >
      <ResponsivePaperWrapper>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" fontWeight="bold" display="flex" alignItems="center" gap={1}>
            <Inventory2Icon color="primary" />
            Outward Request Details
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/inward-outward-request?tab=outward')}
          >
            Back to List
          </Button>
        </Box>
      </ResponsivePaperWrapper>

      <ResponsivePaperWrapper sx={{
        borderRadius: 3,
        mt: 3,
        mb: 4,
        boxShadow: 0,
        background: "rgba(255,255,255,0.85)",
        p: { xs: 2, sm: 2 },
      }}>
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
              Outward Request Details
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
              Request ID:  {inward?.newId ? inward?.newId : inward?.requestId || '-'}
            </Typography>
          </Box>
          <Inventory2Icon sx={{ fontSize: 48, opacity: 0.9 }} />
        </Box>
      </ResponsivePaperWrapper>
      <Card
        sx={{
          borderRadius: 3,
          mt: 3,
          mb: 4,
          boxShadow: 0,
          background: "rgba(255,255,255,0.85)",
          p: { xs: 2, sm: 2 },
        }}
      >
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={4}>
            <DetailCard title="Request Information" details={requestDetails} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <DetailCard title="Approval Information" details={approvalDetails} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <DetailCard title="Additional Details" details={additionalDetails} />
          </Grid>
        </Grid>

        <DetailTable items={inward?.items} />
      </Card>
    </Container>
  );
};

export default Index;