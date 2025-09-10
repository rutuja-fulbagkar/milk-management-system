import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Toolbar,
  Tooltip,
  Typography
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import React, { useState } from 'react';

const InOutFilter = ({
  filter,
  setFilter,
  onFilterChange,
  numSelected,
}) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
    onFilterChange({ ...filter, [name]: value });
  };

  const handleClearFilters = () => {
    setFilter({
      status: '',
      timeRange: 'monthly',
      search: '',
      startDate: null,
      endDate: null,
    });
    setStartDate(null);
    setEndDate(null);
    onFilterChange({
      status: '',
      timeRange: 'monthly',
      search: '',
      startDate: null,
      endDate: null,
    });
  };

  const dimension = 36;

  const isAnyFilterActive = () => {
    return (
      filter.status !== '' ||
      filter.search !== '' ||
      filter.timeRange !== 'monthly' ||
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
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue) => {
                  setStartDate(newValue);
                  handleFilterChange({ target: { name: 'startDate', value: newValue } });
                }}
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
                onChange={(newValue) => {
                  setEndDate(newValue);
                  handleFilterChange({ target: { name: 'endDate', value: newValue } });
                }}
                slotProps={{
                  textField: {
                    size: 'small',
                    sx: { minWidth: dimension * 3, maxWidth: 170, fontSize: 14 },
                  },
                }}
              />
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
