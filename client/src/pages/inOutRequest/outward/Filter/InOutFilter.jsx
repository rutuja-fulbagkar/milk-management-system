import React, { useState } from 'react';
import {
  Box,
  InputAdornment,
  OutlinedInput,
  Select,
  MenuItem,
  Button,
  Toolbar,
  Typography,
  Tooltip,
  IconButton,
  Tabs,
  Tab,
  Grid,
  InputLabel,
  FormControl,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Link as RouterLink } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { alpha } from '@mui/material/styles';
import Iconify from '../../../../components/iconify';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const InOutFilter = ({
  filter,
  setFilter,
  onFilterChange,
  numSelected,
  rejectedRequest,
  pendingRequest,
  approvedRequest,
  allItemsCount,
}) => {
  const [startDate, setStartDate] = useState(filter.startDate || null);
  const [endDate, setEndDate] = useState(filter.endDate || null);
  const [timeRange, setTimeRange] = useState(filter.timeRange || "");
  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));
  const fontSize = 14;
  
  const getStartAndEndOfCurrentYear = () => {
    const currentYear = new Date().getFullYear();
    return { start: new Date(currentYear, 0, 1), end: new Date(currentYear, 11, 31) };
  };
  const getStartAndEndOfThisMonth = () => {
    const now = new Date();
    return { start: new Date(now.getFullYear(), now.getMonth(), 1), end: new Date(now.getFullYear(), now.getMonth() + 1, 0) };
  };
  const getStartAndEndOfLastMonth = () => {
    const now = new Date();
    return { start: new Date(now.getFullYear(), now.getMonth() - 1, 1), end: new Date(now.getFullYear(), now.getMonth(), 0) };
  };
  const getStartAndEndOfThisWeek = () => {
    const now = new Date();
    const firstDay = now.getDate() - now.getDay();
    return { start: new Date(now.setDate(firstDay)), end: new Date(now.setDate(firstDay + 6)) };
  };
  const getStartAndEndOfLastWeek = () => {
    const now = new Date();
    const firstDay = now.getDate() - now.getDay() - 7;
    return { start: new Date(now.setDate(firstDay)), end: new Date(now.setDate(firstDay + 6)) };
  };

  const handleTimeRangeChange = (event) => {
    const selectedTimeRange = event.target.value;
    setTimeRange(selectedTimeRange);

    let start = null;
    let end = null;

    switch (selectedTimeRange) {
      case "currentYear":
        ({ start, end } = getStartAndEndOfCurrentYear());
        break;
      case "thisMonth":
        ({ start, end } = getStartAndEndOfThisMonth());
        break;
      case "lastMonth":
        ({ start, end } = getStartAndEndOfLastMonth());
        break;
      case "thisWeek":
        ({ start, end } = getStartAndEndOfThisWeek());
        break;
      case "lastWeek":
        ({ start, end } = getStartAndEndOfLastWeek());
        break;
      default:
        break;
    }

    setStartDate(start);
    setEndDate(end);

    const newFilter = {
      ...filter,
      timeRange: selectedTimeRange,
      startDate: start,
      endDate: end,
    };
    setFilter(newFilter);
    onFilterChange(newFilter);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;

    const newFilter = {
      ...filter,
      [name]: value,
      timeRange,
      startDate,
      endDate,
    };

    setFilter(newFilter);
    onFilterChange(newFilter);
  };

  const handleStartDateChange = (newValue) => {
    setStartDate(newValue);
    const newFilter = {
      ...filter,
      startDate: newValue,
      timeRange: "",
      endDate,
    };
    setTimeRange("");
    setFilter(newFilter);
    onFilterChange(newFilter);
  };

  const handleEndDateChange = (newValue) => {
    setEndDate(newValue);
    const newFilter = {
      ...filter,
      endDate: newValue,
      timeRange: "",
      startDate,
    };
    setTimeRange("");
    setFilter(newFilter);
    onFilterChange(newFilter);
  };

  const handleClearFilters = () => {
    const clearedFilter = {
      status: '',
      timeRange: '',
      search: '',
      startDate: null,
      endDate: null,
    };
    setStartDate(null);
    setEndDate(null);
    setTimeRange('');
    setFilter(clearedFilter);
    onFilterChange(clearedFilter);
  };

  const statusTabs = [
    { label: 'All Items', value: '', count: allItemsCount },
    { label: 'Pending', value: 'Pending', count: pendingRequest },
    { label: 'Approved', value: 'Approved', count: approvedRequest },
    { label: 'Rejected', value: 'Rejected', count: rejectedRequest },
  ];

  const getTabStyle = (value) => {
    switch (value) {
      case 'Pending': return { color: 'orange' };
      case 'Approved': return { color: 'green' };
      case 'Rejected': return { color: 'red' };
      default: return { color: '#333' };
    }
  };

  const dimension = 36;

  const isAnyFilterActive = () => {
    return (
      filter.status !== '' ||
      filter.search !== '' ||
      (filter.timeRange && filter.timeRange !== '') ||
      filter.startDate !== null ||
      filter.endDate !== null
    );
  };

  return (
    <Box sx={{ width: '100%' }}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Toolbar
          sx={{
            py: 1,
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1,
            minHeight: 0,
          }}
        >
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={12} sm="auto" md="auto">
            <Button
              component={RouterLink}
              to="/inward-outward-request/outward/new"
              variant="contained"
              color="success"
              startIcon={<Iconify icon="eva:plus-fill" />}
              fullWidth={isSmDown}
              size="small"
              sx={{
                height: dimension,
                minWidth: dimension * 2,
                fontSize,
                px: 1.5,
                py: 0.5,
              }}
            >
              Outward
            </Button>
            </Grid>
            <Grid item xs={12} sm="auto" md="auto">
              <DatePicker
                label="Start Date"
                value={startDate}
                disabled={timeRange === "currentYear"}
                onChange={handleStartDateChange}
                slotProps={{
                  textField: {
                    size: 'small',
                    sx: { minWidth: dimension * 3, maxWidth: 170, fontSize: 14 },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm="auto" md="auto">
              <DatePicker
                label="End Date"
                value={endDate}
                disabled={timeRange === "currentYear"}
                onChange={handleEndDateChange}
                slotProps={{
                  textField: {
                    size: 'small',
                    sx: { minWidth: dimension * 3, maxWidth: 170, fontSize: 14 },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm="auto" md="auto">
              <FormControl
                size="small"
                sx={{ width: { xs: "45%", sm: "10%" }, minWidth: "145px" }}
              >
                <InputLabel id="time-range-label">Date Range</InputLabel>
                <Select
                  labelId="time-range-label"
                  name="timeRange"
                  value={timeRange}
                  onChange={handleTimeRangeChange}
                  label="Time Range"
                >
                  <MenuItem value="currentYear">Current Year</MenuItem>
                  <MenuItem value="lastMonth">Last Month</MenuItem>
                  <MenuItem value="thisMonth">This Month</MenuItem>
                  <MenuItem value="lastWeek">Last Week</MenuItem>
                  <MenuItem value="thisWeek">This Week</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <OutlinedInput
                name="search"
                value={filter.search}
                onChange={handleFilterChange} 
                size="small"
                placeholder="Search..."
                startAdornment={
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                }
                sx={{
                  height: dimension,
                  fontSize: 14,
                  px: 1,
                  minWidth: dimension * 3,
                  maxWidth: '100%',
                  '& .MuiOutlinedInput-input': {
                    padding: '8px 12px',
                  },
                }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm="auto" md="auto">
              {isAnyFilterActive() && (
                <Button
                  variant="outlined"
                  onClick={handleClearFilters}
                  size="small"
                  sx={{
                    color: 'red',
                    borderColor: 'red',
                    minWidth: dimension * 2,
                    height: dimension,
                    fontSize: 14,
                    px: 1,
                    py: 0.5,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 0, 0, 0.1)',
                      borderColor: 'red',
                    },
                  }}
                >
                  Clear
                </Button>
              )}
            </Grid>
          </Grid>
        </Toolbar>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, p: 1 }}>
          <Tabs
            value={filter.status}
            onChange={(event, newValue) => {
              handleFilterChange({ target: { name: 'status', value: newValue } });
            }}
            textColor="primary"
            indicatorColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              minWidth: 120,
              '& .MuiTab-root': {
                minHeight: 28,
                minWidth: 70,
                px: 1.5,
                fontSize: 14,
              },
            }}
          >
            {statusTabs.map((tab) => (
              <Tab key={tab.value} label={`${tab.label} (${tab.count})`} value={tab.value} style={getTabStyle(tab.value)} />
            ))}
          </Tabs>
        </Box>
        <Toolbar
          sx={{
            py: 1,
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            minHeight: 0,
            ...(numSelected > 0 && {
              bgcolor: (theme) =>
                alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
            }),
          }}
        >
          {numSelected > 0 ? (
            <Typography
              sx={{ flex: '1 1 100%', marginLeft: 1, fontSize: 14 }}
              color="inherit"
              variant="subtitle2"
              component="div"
            >
              {numSelected} selected
            </Typography>
          ) : (
            <Typography sx={{ flex: '1 1 100%', marginLeft: 1 }} variant="h6" id="tableTitle" component="div"/>
          )}
          {numSelected > 0 && (
            <Tooltip title="Delete">
              <IconButton sx={{ height: dimension, width: dimension }}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Toolbar>
      </LocalizationProvider>
    </Box>
  );
};

export default InOutFilter;
