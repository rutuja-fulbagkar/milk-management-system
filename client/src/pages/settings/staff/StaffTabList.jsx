import ReceiptIcon from '@mui/icons-material/Receipt';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import PropTypes from 'prop-types';
import { useState } from 'react';
import ResponsivePaperWrapper from '../../../components/table/ResponsivePaperWrapper';
import ItemIdForm from './ItemIdForm';
 

function StaffTabList(settings) {
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
            icon={<ReceiptIcon className="ms-2" style={{ fontSize: '20px' }} />}
            label="Staff ID Generator"
            {...a11yProps(0)}
          />
         
         
        </Tabs>
      {/* </Box> */}
      </ResponsivePaperWrapper>
      
       <Box>{value === 0 && <ItemIdForm />}</Box>

    </>
  );
}

StaffTabList.propTypes = {
  settings: PropTypes.array,
};

export default StaffTabList;
