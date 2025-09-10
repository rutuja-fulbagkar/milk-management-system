import BlockIcon from '@mui/icons-material/Block';
import RecyclingIcon from '@mui/icons-material/Recycling';
import SegmentIcon from '@mui/icons-material/Segment';
import { ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import PropTypes from 'prop-types';

const ArchieveToggleButton = ({ value, onChange, bgColor, ...other }) => (
  <ToggleButtonGroup
    size="small"
    color="primary"
    value={value}
    exclusive
    onChange={onChange}
    {...other}
  >
    <Tooltip title="Staff" arrow>
      <ToggleButton
        value="list"
        sx={{
          backgroundColor: value === "list" ? 'blue' : 'transparent',
          color: value === "list" ? 'white' : 'inherit',
          '&:hover': {
            backgroundColor: value === "list" ? 'darkblue' : 'rgba(0, 0, 0, 0.08)',
          },
        }}
      >
        <SegmentIcon style={{ fontSize: '20px' }} />
      </ToggleButton>
    </Tooltip>

    <Tooltip title="Archived" arrow>
      <ToggleButton
        value="archived"
        sx={{
          backgroundColor: value === "archived" ? 'blue' : 'transparent',
          color: value === "archived" ? 'white' : 'inherit',
          '&:hover': {
            backgroundColor: value === "archived" ? 'darkblue' : 'rgba(0, 0, 0, 0.08)',
          },
        }}
      >
        <RecyclingIcon style={{ fontSize: '20px' }} />
      </ToggleButton>
    </Tooltip>
  </ToggleButtonGroup>
);

ArchieveToggleButton.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  bgColor: PropTypes.string,
};

export default ArchieveToggleButton;
