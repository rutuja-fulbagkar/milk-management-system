import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  findsalesOrders,
  setDateServices,
} from "../../../redux/slices/salesOrder/salesOrderApi";

const SetServiceScheduleDialog = ({ open, onClose, row }) => {
  const [serviceDate, setServiceDate] = useState(null);
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    if (serviceDate) {
      const formattedDate = new Date(
        serviceDate.getTime() - serviceDate.getTimezoneOffset() * 60000
      ).toISOString();
      const data = {
        paramsId: row._id,
        data: { serviceDate: formattedDate },
      };
      try {
        const response = await dispatch(setDateServices(data));
        if (response?.payload?.success) {
          await dispatch(findsalesOrders());
        }
      } catch (error) {
        console.error("Failed to set service date");
      }
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
        <p style={{ marginBottom: "10px" }}>
          Please enter the date for the first service of this order. The
          warranty period for the order will start from this date.
        </p>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Select Service Date"
            value={serviceDate}
            onChange={(newValue) => setServiceDate(newValue)}
            disablePast
            format="dd/MM/yyyy"
            slotProps={{
              textField: {
                fullWidth: true,
                sx: { marginTop: "10px" },
              },
            }}
          />
        </LocalizationProvider>
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

export default SetServiceScheduleDialog;
