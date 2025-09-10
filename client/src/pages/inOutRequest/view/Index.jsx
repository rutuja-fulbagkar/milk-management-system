import {
  CalendarToday as CalendarIcon,
  Place as LocationIcon,
  CheckCircle as StatusIcon,
  Update as UpdateIcon
} from '@mui/icons-material';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  Divider,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from '../../../redux/store';

const Index = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   if (id) {
  //     setLoading(true);
  //     dispatch(getProductbyId(id)).then((response) => {
  //       if (response.payload && response.payload.success) {
  //         setProduct(response.payload.data);
  //       }
  //       setLoading(false);
  //     });
  //   }
  // }, [dispatch, id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  const capitalizeFirstLetter = (str) =>
    typeof str === 'string' ? str.charAt(0).toUpperCase() + str.slice(1) : str;

  const fallback = (val) =>
    val === null || val === undefined || val === '' ? 'N/A' : capitalizeFirstLetter(val);

  const formatDate = (dateStr) => {
    return dateStr ? new Date(dateStr).toLocaleString() : 'N/A';
  };

  const fields = [
    { icon: <ProductionQuantityLimitsIcon color="primary" />, label: 'Product Name', value: fallback(product?.productName) },
    { icon: <ProductionQuantityLimitsIcon color="primary" />, label: 'Model Number', value: fallback(product?.modelNumber) },
    { icon: <ProductionQuantityLimitsIcon color="primary" />, label: 'Serial Number', value: fallback(product?.serialNumber) },
    { icon: <LocationIcon color="secondary" />, label: 'Site Name', value: fallback(product?.site?.siteName) },
    { icon: <SupervisorIcon color="info" />, label: 'Site Manager', value: fallback(`${product?.site?.siteManager?.name} (${product?.site?.siteManager?.email})`) },
    { icon: <LocationIcon color="error" />, label: 'Free Service', value: product?.freeService ? 'Yes' : 'No' },
    { icon: <SupervisorIcon color="info" />, label: 'Number of Services', value: fallback(product?.NumOfService) },
    { icon: <CalendarIcon color="primary" />, label: 'Frequency', value: fallback(product?.frequency) },
    { icon: <CalendarIcon color="primary" />, label: 'Installation Date', value: formatDate(product?.installationDate) },
    { icon: <UpdateIcon color="action" />, label: 'Expiry Date', value: formatDate(product?.expiryDate) },
    { icon: <StatusIcon color="success" />, label: 'Status', value: fallback(product?.site?.status) },
    { icon: <CalendarIcon color="action" />, label: 'Created At', value: formatDate(product?.createdAt) },
    { icon: <UpdateIcon color="disabled" />, label: 'Updated At', value: formatDate(product?.updatedAt) },
  ];

  return (
    <Container maxWidth="2xl" sx={{ minHeight: '100vh' }}>
      <Box className="w-full py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <Typography variant="h5" fontWeight="bold">Product Details</Typography>
        <Button variant="outlined" onClick={() => navigate('/products')}>Back to List</Button>
      </Box>

      <Card sx={{ p: 4, mt: 3 }}>
        {fields.map((field, index) => (
          <Box key={index}>
            <Box display="flex" alignItems="center" gap={1} py={1}>
              {field.icon}
              <Typography
                mr={1}
                sx={{
                  fontWeight: 600,
                  fontSize: {
                    xs: "0.95rem",
                    sm: "1rem",
                    md: "1rem",
                    lg: "1.05rem",
                  },
                }}
              >
                {field.label}:
              </Typography>
              <Typography>{field.value}</Typography>
            </Box>
            {index !== fields.length - 1 && <Divider />}
          </Box>
        ))}
      </Card>
    </Container>
  );
};

export default Index;
