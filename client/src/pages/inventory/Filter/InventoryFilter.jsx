import React from "react";
import {
  Box,
  InputAdornment,
  OutlinedInput,
  Button,
  Toolbar,
  Typography,
  Tooltip,
  IconButton,
  Tabs,
  Tab,
  Stack,
  useTheme,
  useMediaQuery,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Link as RouterLink } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { alpha } from "@mui/material/styles";
import Iconify from "../../../components/iconify";

const InventoryFilter = ({
  filter,
  setFilter,
  onFilterChange,
  numSelected,
  outOfStockCount,
  inStockCount,
  allItemsCount,
  lowStockCount,
}) => {
  const theme = useTheme();

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
    onFilterChange({ ...filter, [name]: value });
  };

  const handleClearFilters = () => {
    setFilter({
      stockStatus: "all",
      timeFrame: "monthly",
      searchTerm: "",
    });
    onFilterChange({
      stockStatus: "all",
      timeFrame: "monthly",
      searchTerm: "",
    });
  };

  const statusTabs = [
    { label: "All Items", value: "all", count: allItemsCount },
    { label: "In Stock", value: "In Stock", count: inStockCount },
    { label: "Low Stock", value: "Low Stock", count: lowStockCount },
    { label: "Out of Stock", value: "Out of Stock", count: outOfStockCount },
  ];
  const getChipColor = (value) => {
    switch (value) {
      case "In Stock": return "success";
      case "Low Stock": return "warning";
      case "Out of Stock": return "error";
      default: return "default";
    }
  };
  
  return (
    <Paper
      elevation={2}
      sx={{
        borderRadius: 3,
        mb: 2,
        p: { xs: 1, sm: 1.5 },
        bgcolor: alpha(theme.palette.background.paper, 0.9),
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          py: 1,
          px: { xs: 1, sm: 2 },
          gap: { xs: 1.5, sm: 0 },
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          sx={{ width: "100%", flex: 1 }}
        >
          <Stack
            direction="row"
            spacing={1}
            sx={{
              minWidth: { xs: "100%", sm: 160 },
              flex: { xs: "none", sm: "0 0 auto" },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            <Button
              component={RouterLink}
              to="/inward-outward-request/inward/new"
              variant="contained"
              color="secondary"
              startIcon={<Iconify icon="eva:plus-fill" />}
              size="small"
              sx={{
                minWidth: 80,
                fontSize: 14,
                py: 0.2,
              }}
            >
              Inward
            </Button>
            <Button
              component={RouterLink}
              to="/inward-outward-request/outward/new"
              variant="contained"
              color="success"
              startIcon={<Iconify icon="eva:plus-fill" />}
              size="small"
              sx={{
                minWidth: 80,
                fontSize: 14,
                py: 0.2,
              }}
            >
              Outward
            </Button>
          </Stack>
          <OutlinedInput
            name="searchTerm"
            value={filter.searchTerm}
            onChange={handleFilterChange}
            placeholder="Search by item name..."

            startAdornment={
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            }
            aria-label="Search inventory"
            size="small"
            sx={{
              flex: 2,
              minWidth: { xs: "100%", sm: 140, md: 180 },
              maxWidth: { xs: "100%", sm: 200, md: 250, lg: 300 },
              bgcolor: "#fff",
              borderRadius: 2,
              fontSize: 14,
              py: 0.2,
            }}
          />
          <Button
            variant="outlined"
            onClick={handleClearFilters}
            sx={{
              color: "red",
              borderColor: "red",
              minWidth: 80,
              fontSize: 14,
              py: 0.2,
              "&:hover": {
                backgroundColor: "rgba(255, 0, 0, 0.1)",
                borderColor: "red",
              },
            }}
            size="small"
          >
            Clear
          </Button>
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ mt: { xs: 1.5, sm: 0 }, ml: { sm: 1.5 } }}
        >
          {numSelected > 0 && (
            <>
              <Typography
                color="inherit"
                variant="subtitle2"
                component="div"
                sx={{ minWidth: 60, fontSize: 14 }}
              >
                {numSelected} selected
              </Typography>
              <Tooltip title="Delete">
                <IconButton color="error" aria-label="Delete selected" size="small">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Stack>
      </Toolbar>

      <Box sx={{ width: "100%", mt: 0.5 }}>
        <Tabs
          value={filter.stockStatus}
          onChange={(event, newValue) => {
            handleFilterChange({
              target: { name: "stockStatus", value: newValue },
            });
          }}
          textColor="primary"
          indicatorColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="Stock Status Tabs"
          sx={{
            minHeight: 36,
            "& .MuiTab-root": {
              minHeight: 28,
              minWidth: 70,
              px: 1.5,
              fontSize: 14,
            },
          }}
        >
          {statusTabs.map((tab) => (
            <Tab
              key={tab.value}
              label={
                <span>
                  {tab.label}{" "}
                  <Typography
                    component="span"
                    color={getChipColor(tab.value)}
                    fontWeight="bold"
                    fontSize={14}
                  >
                    ({tab.count})
                  </Typography>
                </span>
              }
              value={tab.value}
            />
          ))}
        </Tabs>
      </Box>
    </Paper>
  );
};

export default InventoryFilter;
