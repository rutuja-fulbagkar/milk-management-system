import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close"
import { useDispatch } from "react-redux";
import { editSalesOrders } from "../../../redux/slices/salesOrder/salesOrderApi";



const SetServiceScheduleDialog = ({ open, onClose, row }) => {
  const [serviceDate, setServiceDate] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = () => {
    if (serviceDate) {
      const data = {
        paramsId: row,
        data: { serviceDate },
      };

      dispatch(editSalesOrders(data))
        .then((response) => {
          if (response?.payload?.success) {
            toast.success("Service date set successfully");
          } else {
            toast.error("Failed to set service date");
          }
        })
        .catch(() => {
          toast.error("Failed to set service date");
        });
      onClose();
    } else {
      toast.error("Please select a service date");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ m: 0, p: 2 }}>
        Set Service Schedule
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
            size="large"
          >
            <CloseIcon />
          </IconButton>
      </DialogTitle>
      <DialogContent>
        <p>
          Please enter the date for the first service of this order. The
          warranty period for the order will start from this date
        </p>
        <TextField
        sx={{marginTop:'10px'}}
          type="date"
          fullWidth
          value={serviceDate}
          onChange={(e) => setServiceDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// SetServiceScheduleDialog.propTypes = {
//   onClose: PropTypes.func.isRequired,
//   open: PropTypes.string.isRequired,
//   row: PropTypes.string.isRequired,
// };

export default SetServiceScheduleDialog;
