import RecyclingIcon from '@mui/icons-material/Recycling';
import SegmentIcon from '@mui/icons-material/Segment';
import { ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import PropTypes from 'prop-types';

const VendorToggleButton = ({ value, onChange, bgColor, ...other }) => (
  <ToggleButtonGroup
    size="small"
    color="primary"
    style={{ backgroundColor:bgColor }}
    value={value}
    exclusive
    onChange={onChange}
    {...other}
  >
    <Tooltip title="Warehouse" arrow>
      <ToggleButton value="list">
        <SegmentIcon style={{ fontSize: '20px' }} />
      </ToggleButton>
    </Tooltip>
    <Tooltip title="Archived" arrow>
      <ToggleButton value="archived">
        <RecyclingIcon style={{ fontSize: '20px' }} />
      </ToggleButton>
    </Tooltip>
  </ToggleButtonGroup>
);

VendorToggleButton.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  bgColor: PropTypes.string,
};

export default VendorToggleButton;
