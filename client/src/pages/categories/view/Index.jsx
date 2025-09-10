import {
  CalendarToday as CalendarIcon,
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
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ResponsivePaperWrapper from '../../../components/table/ResponsivePaperWrapper';
import { getcategoriesbyId } from '../../../redux/slices/categories/categoriesApi';
import { useDispatch } from '../../../redux/store';

const Index = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      dispatch(getcategoriesbyId(id)).then((response) => {
        if (response.payload && response.payload.success) {
          setProduct(response.payload.data);
        }
        setLoading(false);
      });
    }
  }, [dispatch, id]);

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
    { icon: <CalendarIcon color="action" />, label: 'Created At', value: formatDate(product?.createdAt) },
    { icon: <UpdateIcon color="disabled" />, label: 'Updated At', value: formatDate(product?.updatedAt) },
  ];

  return (
    <Container maxWidth="2xl" sx={{ minHeight: '100vh' }}>
      <ResponsivePaperWrapper>
        <Box className="w-full py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <Typography variant="h5" fontWeight="bold">Categories Details</Typography>
          <Button variant="outlined" onClick={() => navigate('/categories')}>Back to List</Button>
        </Box>
      </ResponsivePaperWrapper>

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
              {fallback(product?.categoryName)}
            </Typography>

          </Box>
          <ProductionQuantityLimitsIcon sx={{ fontSize: 48, opacity: 0.9 }} />
        </Box>
      </ResponsivePaperWrapper>
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
