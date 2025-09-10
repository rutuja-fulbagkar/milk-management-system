import {
  Apartment as ApartmentIcon,
  ArrowBack as ArrowBackIcon,
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon,
  Inventory2 as InventoryIcon,
  ArrowUpward as InWardIcon,
  LocationOn as LocationIcon,
  ExpandMore as MinStockIcon,
  Numbers as NumbersIcon,
  ArrowDownward as OutWardIcon,
  CheckCircle as StatusIcon,
  Warehouse as WarehouseIcon
} from '@mui/icons-material';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material';
import { React, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ResponsivePaperWrapper from '../../../components/table/ResponsivePaperWrapper';
import { getInventorybyId } from '../../../redux/slices/inventory/inventoryApi';
import { useDispatch } from '../../../redux/store';


const COLORS = {
  primary: { main: '#0288d1', light: '#4fc3f7', hover: '#0277bd' },
  secondary: { main: '#00796b', light: '#4db6ac', hover: '#00695c' },
  background: { card: '#ffffff', paper: '#f7f9fc', paperHover: '#e8ecef', tableHeader: '#f1f5f9' },
  text: { primary: '#212121', secondary: '#616161' },
};
// Utility Functions
const fallback = (val) => (val === null || val === undefined || val === '' ? 'N/A' : val);

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  try {
    return new Date(dateStr).toLocaleString(undefined, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch {
    return 'N/A';
  }
};

const DetailCard = ({ title, icon: Icon, details, iconColor, iconHoverColor }) => (
  <Card
    variant="outlined"
    sx={{
      borderRadius: 3,
      p: 2.5,
      bgcolor: '#fafafa',
      boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
    }}
  >
    <Box display="flex" alignItems="center" mb={2}>
      <Icon sx={{ color: iconColor, mr: 1 }} />
      <Typography variant="h6" fontWeight="bold" color="#424242">
        {title}
      </Typography>
    </Box>
    <Grid container spacing={2}>
      {details.map((detail, index) => (
        <Grid item xs={12} key={index}>
          <Paper
            variant="outlined"
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: 1.5,
              bgcolor: '#f5f5f5',
              borderRadius: 2,
              boxShadow: 'none',
              '&:hover': { bgcolor: '#eeeeee' },
            }}
          >
            <Tooltip title={detail.tooltip}>
              <Box display="flex" alignItems="flex-start">
                <detail.icon
                  sx={{
                    color: detail.iconColor || iconColor,
                    mr: 1,
                    // mt: 0.5,
                    '&:hover': { color: iconHoverColor },
                  }}
                />
                <Box display="flex" flexDirection="column">
                  <Typography variant="subtitle1" fontWeight="bold" color="#424242">
                    {detail.title}
                  </Typography>
                  <Typography variant="body2" color="#616161">
                    {detail.value}
                  </Typography>
                </Box>
              </Box>

            </Tooltip>
          </Paper>
        </Grid>
      ))}
    </Grid>
  </Card>
);

const Index = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      setError(null);
      dispatch(getInventorybyId(id))
        .then((response) => {
          if (response.payload && response.payload.success) {
            setProduct(response.payload.data);
          } else {
            setError('Failed to fetch inventory data');
          }
          setLoading(false);
        })
        .catch(() => {
          setError('An error occurred while fetching data');
          setLoading(false);
        });
    }
  }, [dispatch, id]);

  // Loading State
  if (loading) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2, color: '#616161' }}>
          Loading inventory details...
        </Typography>
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography variant="h6" color="error">
          {error || 'No inventory data available'}
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 2, bgcolor: '#0288d1', '&:hover': { bgcolor: '#0277bd' } }}
          onClick={() => navigate('/inventory')}
        >
          Back to Inventory
        </Button>
      </Box>
    );
  }



  const inventoryDetails = [
    {
      title: 'Opening Stock',
      icon: NumbersIcon,
      value: fallback(product?.openingStock),
      tooltip: 'Initial stock quantity at the start of the period',
      iconColor: '#4db6ac',
    },
    {
      title: 'Closing Stock',
      icon: NumbersIcon,
      value: fallback(product?.closingStock),
      tooltip: 'Remaining stock quantity at the end of the period',
      iconColor: '#4db6ac',
    },
    {
      title: 'Inward Quantity',
      icon: InWardIcon,
      value: fallback(product?.inWardQty),
      tooltip: 'Quantity received into inventory',
      iconColor: '#4db6ac',
    },
    {
      title: 'Inward Qty Date',
      icon: CalendarIcon,
      value: formatDate(product?.inWardQtyDate),
      tooltip: 'Date of the last inward transaction',
      iconColor: '#4db6ac',
    },
    {
      title: 'Outward Quantity',
      icon: OutWardIcon,
      value: fallback(product?.outWardQty),
      tooltip: 'Quantity removed from inventory',
      iconColor: '#4db6ac',
    },
    {
      title: 'Outward Qty Date',
      icon: CalendarIcon,
      value: formatDate(product?.outWardQtyDate),
      tooltip: 'Date of the last outward transaction',
      iconColor: '#4db6ac',
    },
    {
      title: 'Minimum Stock',
      icon: MinStockIcon,
      value: fallback(product?.minStock),
      tooltip: 'Minimum stock level required',
      iconColor: '#4db6ac',
    },

  ];

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
              <TableCell sx={{ fontWeight: 'bold', color: COLORS.text.primary }}>Item Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: COLORS.text.primary }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: COLORS.text.primary }}>Unit Type</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: COLORS.text.primary }}>Item Code</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: COLORS.text.primary }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: COLORS.text.primary }}>Created At</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: COLORS.text.primary }}>Updated At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow
              sx={{
                bgcolor: product ? COLORS.background.paper : COLORS.background.card,
                transition: 'background-color 0.2s ease-in-out',
                '&:hover': { bgcolor: COLORS.background.paperHover },
              }}
            >
              <TableCell>{fallback(product?.itemName || '-')}</TableCell>
              <TableCell>{fallback(product?.category?.categoryName || '-')}</TableCell>
              <TableCell>{fallback(product?.unitType || '-')}</TableCell>
              <TableCell>{fallback(product?.itemCode || '-')}</TableCell>
              <TableCell>{fallback(product?.description) || '-'}</TableCell>
              <TableCell>
                {formatDate(product?.createdAt)}
              </TableCell>
              <TableCell>
                {formatDate(product?.updatedAt)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
    </Card>
  );

  return (
    <>
      <ResponsivePaperWrapper sx={{
        borderRadius: 3,
        boxShadow: 0,
        background: "rgba(241, 243, 243, 0.85)",
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
              {fallback(product?.itemName)}
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
              Item Id: {fallback(product?.newId)}
            </Typography>
          </Box>
          <InventoryIcon sx={{ fontSize: 48, opacity: 0.9 }} />
        </Box>
      </ResponsivePaperWrapper>
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: 0,
          background: "rgba(255,255,255,0.85)",
        }}
      >
        <Grid container spacing={3} className="my-6">
          <Grid item xs={12} md={4}>
            <DetailCard
              title="Inventory Overview"
              icon={InventoryIcon}
              details={inventoryDetails}
              iconColor="#00897b"
              iconHoverColor="#00796b"
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} mb={3} >
          <Grid item xs={12} md={6} sx={{ minWidth: { xs: '100%', md: '48%' } }}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: 3,
                p: 2.5,
                boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                bgcolor: "#f8fafc",
              }}
            >
              <Box display="flex" alignItems="center" mb={2}>
                <WarehouseIcon sx={{ color: "#22c55e", mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  Warehouse Information
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
                <WarehouseIcon sx={{ color: "#64748b", mr: 1 }} />
                <Typography fontWeight="bold" mr={1}>
                  Warehouse Name
                </Typography>
                <Typography>{fallback(product?.warehouseId?.name).trim() || "N/A"}</Typography>
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
                <NumbersIcon sx={{ color: "#64748b", mr: 1 }} />
                <Typography fontWeight="bold" mr={1}>
                  Warehouse Code
                </Typography>
                <Typography>{fallback(product?.warehouseId?.code)}</Typography>
              </Paper>
              <Paper
                variant="outlined"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 1.2,
                  mt: 2,
                  bgcolor: "#fff",
                  borderRadius: 2,
                  boxShadow: "none",
                }}
              >
                <DescriptionIcon sx={{ color: "#64748b", mr: 1 }} />
                <Typography fontWeight="bold" mr={1}>
                  Warehouse Description
                </Typography>
                <Typography>{fallback(product?.warehouseId?.description)}</Typography>
              </Paper>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} sx={{ minWidth: { xs: '100%', md: '49%' } }}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: 3,
                p: 2.5,
                boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
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
                <Typography>{fallback(product?.warehouseId?.location)}</Typography>
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
                    color: product.status === "Active" ? "#22c55e" : "#22c55e",
                    mr: 1,
                  }}
                />
                <Typography fontWeight="bold" mr={1}>
                  Status
                </Typography>
                <Typography>{fallback(product.status)}</Typography>
              </Paper>
            </Card>
          </Grid>
        </Grid>
        <DetailTable items={product?.items} />
      </Card>
    </>
  );
};

export default Index;