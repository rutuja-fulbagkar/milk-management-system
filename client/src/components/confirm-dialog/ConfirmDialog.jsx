import PropTypes from 'prop-types';
import { Dialog, Button, DialogTitle, DialogActions, DialogContent } from '@mui/material';

const ConfirmDialog = ({ title, content, action, open, onClose, ...other }) => (
  <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose} {...other}>
    <DialogTitle sx={{ pb: 2 }}>{title}</DialogTitle>

    {content && <DialogContent sx={{ typography: 'body2' }}> {content} </DialogContent>}

   <DialogActions style={{ padding: '20px' }}>
  <Button variant="outlined" color="inherit" onClick={onClose}>
    Cancel
  </Button>
  {action}
</DialogActions>

  </Dialog>
);

ConfirmDialog.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.node,
  action: PropTypes.node,
  content: PropTypes.node,
  onClose: PropTypes.func,
};

export default ConfirmDialog;
