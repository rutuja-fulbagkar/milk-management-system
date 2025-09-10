import Diversity3Icon from '@mui/icons-material/Diversity3';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { Button, Card } from '@mui/material';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ResponsivePaperWrapper from '../../../components/table/ResponsivePaperWrapper';
import History from '../history/History';
import Index from '../view/Index';

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

export default function ViewTab() {
  const location = useLocation();
  const navigate = useNavigate();
  const [tabIndex, setTabIndex] = useState(0);

  // Sync with query params
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tab = queryParams.get('tab');
    if (tab === 'history') setTabIndex(1);
    else if (tab === 'overview') setTabIndex(0);
  }, [location.search]);

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
    const tabName = newValue === 0 ? 'overview' : 'history';
    navigate(`?tab=${tabName}`, { replace: true });
  };

  return (
    <Box className="w-full px-2 sm:px-6 lg:px-8 ">
      <ResponsivePaperWrapper>
        <Box className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <h1 className="text-xl md:text-2xl text-gray-800 dark:text-gray-100 font-bold">
            Inventory Details
          </h1>
          <div className="flex gap-2">
            <Button variant="outlined" onClick={() => navigate('/inventory')}>Back to List</Button>
          </div>
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
        <Box sx={{ width: '100%' }}>
          <Tabs
            value={tabIndex}
            onChange={handleChange}
            aria-label="overview and history Tabs"
            sx={{
              mb: 2,
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            <Tab icon={<ReceiptIcon fontSize="small" />} label="Overview" {...a11yProps(0)} />
            <Tab icon={<Diversity3Icon fontSize="small" />} label="History" {...a11yProps(1)} />
          </Tabs>
          <TabPanel value={tabIndex} index={0}>
            <Index />
          </TabPanel>
          <TabPanel value={tabIndex} index={1}>
            <History />
          </TabPanel>
        </Box>
      </Card>
    </Box>
  );
}
