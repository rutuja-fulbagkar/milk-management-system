import Diversity3Icon from '@mui/icons-material/Diversity3';
import EscalatorIcon from '@mui/icons-material/Escalator';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PasswordIcon from '@mui/icons-material/Password';
import CategoryIcon from '@mui/icons-material/Category';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import Warehouse from '../../warehouse/Warehouse';
import ResponsivePaperWrapper from '../../../components/table/ResponsivePaperWrapper';
import ItemIdForm from './ItemIdForm';
import Categories from '../../categories/Categories';
 

function InventoryTabList(settings) {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  return (
    <>
     <ResponsivePaperWrapper> 
      {/* <Box sx={{ borderBottom: 1, borderColor: 'divider' }}> */}
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab
            icon={<IntegrationInstructionsIcon className="ms-2" style={{ fontSize: '20px' }} />}
            label="Inventory ID Generator"
            {...a11yProps(0)}
          />
           <Tab
            icon={<CategoryIcon className="ms-2" style={{ fontSize: '20px' }} />}
            label="Categories"
            {...a11yProps(1)}
          />
         
        </Tabs>
      {/* </Box> */}
      </ResponsivePaperWrapper>
      
       <Box>{value === 0 && <ItemIdForm />}</Box>
       <Box>{value === 1 && <Categories/>}</Box>

    </>
  );
}

InventoryTabList.propTypes = {
  settings: PropTypes.array,
};

export default InventoryTabList;
