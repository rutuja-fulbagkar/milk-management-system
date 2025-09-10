import React, { useEffect, useState } from 'react';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import ReceiptIcon from '@mui/icons-material/Receipt';
import Box from '@mui/material/Box';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { Button } from '@mui/material';
import Iconify from '../../../components/iconify';
import InoutStock from '../inward/InoutStock';
import OutWardStock from '../outward/OutWardStock';
import ResponsivePaperWrapper from '../../../components/table/ResponsivePaperWrapper';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  };
}

export default function MainTab() {
  const location = useLocation();
  const navigate = useNavigate();
  const [tabIndex, setTabIndex] = useState(0);

  // Sync with query params
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tab = queryParams.get('tab');
    if (tab === 'outward') setTabIndex(1);
    else if (tab === 'inward') setTabIndex(0);
  }, [location.search]);

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
    const tabName = newValue === 0 ? 'inward' : 'outward';
    navigate(`?tab=${tabName}`, { replace: true });
  };

  return (
    <Box className="w-full px-2 sm:px-6 lg:px-8 ">
      <ResponsivePaperWrapper>
        <Box className="w-full py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 className="text-md md:text-2xl text-gray-700 dark:text-gray-100 font-bold"> Inward/Outward Request</h1>

          <div className="flex flex-col sm:flex-row items-center gap-2 mt-2 sm:mt-0">
            <Button
              component={RouterLink}
              to="/inward-outward-request/inward/new"
              variant="outlined"
              color="Grey"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              Add Inward
            </Button>
            <Button
              component={RouterLink}
              to="/inward-outward-request/outward/new"
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              Add Outward
            </Button>
          </div>
        </Box>
      </ResponsivePaperWrapper>

      <Box sx={{ width: '100%', bgcolor: 'background.paper', marginBottom: '15px' }}>
        <Tabs
          value={tabIndex}
          onChange={handleChange}
          aria-label="Inward and Outward Tabs"
          sx={{
            mb: 2,
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Tab icon={<ReceiptIcon fontSize="small" />} label="Inward Request" {...a11yProps(0)} />
          <Tab icon={<Diversity3Icon fontSize="small" />} label="Outward Request" {...a11yProps(1)} />
        </Tabs>
        <TabPanel value={tabIndex} index={0}>
          <InoutStock />
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          <OutWardStock />
        </TabPanel>
      </Box>
    </Box>
  );
}
