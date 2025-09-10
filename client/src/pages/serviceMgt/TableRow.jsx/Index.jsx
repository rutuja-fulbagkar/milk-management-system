import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import GroupIcon from "@mui/icons-material/Group";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import moment from "moment";
import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import Iconify from "../../../components/iconify";
import MenuPopover from "../../../components/menu-popover/MenuPopover";
import { findAllInventory } from "../../../redux/slices/inventory/inventoryApi";
import { setDateServices } from "../../../redux/slices/salesOrder/salesOrderApi";
import { findUserWithoutPagination } from "../../../redux/slices/user/userApi";
import {
  editCompleteWarranty,
  editMultipleAssignWarranty,
  editWarranty,
} from "../../../redux/slices/warranty/warrantyApi";
import { useDispatch } from "../../../redux/store";

const validationSchema = Yup.object().shape({
  technician: Yup.object().required("Technician is required"),
  helper: Yup.object().required("Helper is required"),
});

const Index = ({
  row,
  isItemSelected,
  roles,
  labelId,
  selectedServiceIds,
  handleSelectService,
  fetchData,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openCompleteModal, setOpenCompleteModal] = useState(false);
  const [openAssignModal, setOpenAssignModal] = useState(false);
  const [openPopover, setOpenPopover] = useState(null);
  const [serviceDate, setServiceDate] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [openChangeDateDialog, setOpenChangeDateDialog] = useState(false);
  const [selectedItemIds, setSelectedItemIds] = useState([]);
  const [errors, setErrors] = useState({ helper: "", technician: "" });
  const [itemList, setItemList] = useState([]);
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [selectedHelper, setSelectedHelper] = useState(null);

  const methods = useForm({
    mode: "onTouched",
  });

  const { control, register, setValue, watch } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const technicianOptions = roles
    .filter((user) => user.role?.name === "Technician")
    .map((user) => ({
      _id: user._id,
      title: `${user.firstName} ${user.lastName}`,
    }));

  const helperOptions = roles
    .filter((user) => user.role?.name === "Helper")
    .map((user) => ({
      _id: user._id,
      title: `${user.firstName} ${user.lastName}`,
    }));

  const handleOpenPopover = (event, service) => {
    if (service.serviceStatus === "Completed") {
      toast.error(
        "This service is already marked as complete. You can't change it."
      );
      return;
    }
    setOpenPopover(event.currentTarget);
    setSelectedService(service);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  useEffect(() => {
    const fetchAllInventory = async () => {
      try {
        const response = await dispatch(findAllInventory());
        setItemList(response.payload.data || []);
      } catch (error) {
        console.error("Failed to fetch storage stock locations:", error);
      }
    };

    fetchAllInventory();
  }, []);

  const handleAssignStaff = async () => {
    try {
      await validationSchema.validate({
        technician: selectedTechnician,
        helper: selectedHelper,
      });
      setErrors({ technician: "", helper: "" });
      const payload = {
        userIds: [selectedTechnician?._id, selectedHelper?._id],
        warrantyId: row?.warranty_id,
      };
      const response = await dispatch(
        editWarranty({ paramsId: row?._id, data: payload })
      );
      if (response?.payload?.success) {
        setSelectedTechnician(null);
        setSelectedHelper(null);
        fetchData();
        handleCloseAssignModal();
        await dispatch(getwarrantybyId(id));
      }
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        setErrors({
          technician:
            error.errors[0] === "Technician is required" ? error.errors[0] : "",
          helper:
            error.errors[0] === "Helper is required" ? error.errors[0] : "",
        });
      } else {
        console.error(error);
      }
    }
  };

  const handleCloseAssignModal = () => {
    setOpenAssignModal(false);
  };

  const handleItemChange = (index, selectedItemId) => {
    const updatedSelectedItemIds = [...selectedItemIds];
    if (selectedItemId) {
      updatedSelectedItemIds[index] = selectedItemId;
    } else {
      updatedSelectedItemIds[index] = null;
    }
    setSelectedItemIds(updatedSelectedItemIds);
  };

  const handleChangeDate = async () => {
    try {
      const payload = {
        paramsId: row?.order_id?._id,
        data: {
          serviceDate: serviceDate,
          sequence: selectedService?.serviceSequence,
        },
      };
      const response = await dispatch(setDateServices(payload));
      if (response?.payload?.success) {
        setOpenChangeDateDialog(false);
        fetchData();
      }
    } catch (error) {
      toast.error(error?.response?.payload?.message);
    }
  };

  const handleComplete = async () => {
    try {
      const formData = new FormData();
      const completionDate = watch("completionDate");
      const partsUsed = watch("partsUsed");
      const remarks = watch("remarks");
      const items = watch("items");
      formData.append("serviceStatus", "Completed");
      formData.append("serviceCompletionDate", completionDate);
      formData.append("remarks", remarks);
      formData.append("partsUsed", partsUsed === "Yes" ? true : false);
      formData.append("warrantyId", row?.warranty_id);
      items.forEach((item, index) => {
        formData.append(`items[${index}][itemId]`, item?.itemId || "-");
        formData.append(`items[${index}][quantity]`, item?.quantity || "-");
      });
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput.files.length > 0) {
        formData.append("photo", fileInput.files[0]);
      }
      const response = await dispatch(
        editCompleteWarranty({ paramsId: selectedService?._id, data: formData })
      );
      if (response?.payload?.success) {
        setOpenCompleteModal(false);
        fetchData();
        await dispatch(getwarrantybyId(row?.warranty_id));
      } else {
        console.error("Failed to mark as complete:", response.payload.message);
      }
    } catch (error) {
      console.error("Error while marking as complete:", error);
    }
  };

  const handleMarkAsComplete = () => {
    if (selectedService.serviceBy.length === 0) {
      toast.error("Please assign staff before marking as complete.");
      return;
    }
    setOpenCompleteModal(true);
    handleClosePopover();
  };

  return (
    <>
      <TableRow
        hover
        // onClick={(event) => handleClick(event, row?.id)}
        role="checkbox"
        aria-checked={isItemSelected}
        tabIndex={-1}
        key={row.id}
        selected={isItemSelected}
        sx={{ cursor: "pointer" }}
      >
        <TableCell padding="checkbox">
          <Checkbox
            checked={isItemSelected}
            onChange={() => handleSelectService(row._id)}
          />
        </TableCell>
        <TableCell
          sx={{
            cursor: "pointer",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
          onClick={() => navigate(`/serviceMgt/view/${row?._id}`)}
        >
          {row?.warrantyId || "-"}
        </TableCell>
        <TableCell
          component="th"
          id={labelId}
          scope="row"
          padding="none"
          sx={{
            cursor: "pointer",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
          onClick={() => navigate(`/serviceMgt/view/${row?._id}`)}
        >
          {row?.order_id?.siteId?.siteName || "-"}
        </TableCell>
        <TableCell
          sx={{
            cursor: "pointer",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
          onClick={() => navigate(`/serviceMgt/view/${row?._id}`)}
        >
          {row?.warrantyEndDate && moment(row?.warrantyEndDate).isValid()
            ? moment(row?.warrantyEndDate).format("DD/MM/YYYY")
            : "-"}
        </TableCell>
        <TableCell onClick={() => navigate(`/serviceMgt/view/${row?._id}`)}>
          {row?.serviceDate && moment(row?.serviceDate).isValid()
            ? moment(row?.serviceDate).format("DD/MM/YYYY")
            : "-"}
        </TableCell>
        <TableCell onClick={() => navigate(`/serviceMgt/view/${row?._id}`)}>
          {row?.order_id?.numberOfCoolersPurchased || "-"}
        </TableCell>
        <TableCell onClick={() => navigate(`/serviceMgt/view/${row?._id}`)}>
          {row?.serviceSequence || "-"}
        </TableCell>
        <TableCell>
          <Typography>
            {row.serviceBy?.length > 0
              ? row.serviceBy
                  .map((person) => `${person?.firstName} ${person?.lastName}`)
                  .join(", ")
              : "N/A"}
          </Typography>
        </TableCell>

        <TableCell onClick={() => navigate(`/user/view/${row?._id}`)}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                backgroundColor: (() => {
                  switch (row?.serviceStatus) {
                    case "Pending":
                      return "yellow";
                    case "Inprogress":
                      return "orange";
                    case "Completed":
                      return "green";
                    default:
                      return "gray";
                  }
                })(),
                display: "inline-block",
                marginRight: 1,
              }}
            />
            <Typography variant="body2">{row?.serviceStatus}</Typography>
          </Box>
        </TableCell>
        <TableCell>
          {moment(row?.createdAt).isValid()
            ? moment(row?.createdAt).format("DD/MM/YY hh:mm A")
            : "-"}
        </TableCell>
        <TableCell>
          {moment(row?.updatedAt).isValid()
            ? moment(row?.updatedAt).format("DD/MM/YY hh:mm A")
            : "-"}
        </TableCell>

        <TableCell>
          <IconButton
            color={openPopover ? "inherit" : "default"}
            onClick={(event) => handleOpenPopover(event, row)}
          >
            <MoreVertIcon />
          </IconButton>
        </TableCell>
      </TableRow>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{
          width: "auto",
        }}
      >
        <Link to={`/serviceMgt/view/${row?._id}`} state={{ ...row }}>
          <MenuItem>
            <Iconify icon="eva:eye-outline" />
            View
          </MenuItem>
        </Link>
        <MenuItem
          onClick={() => {
            if (selectedService.serviceStatus === "Completed") {
              toast.error("This service is already marked as complete.");
            } else {
              handleMarkAsComplete();
            }
          }}
        >
          <CheckCircleOutlineIcon />
          Mark As Complete
        </MenuItem>
        <MenuItem
          onClick={() => {
            setOpenChangeDateDialog(true);
            handleClosePopover();
          }}
        >
          <CalendarMonthIcon />
          Change Date
        </MenuItem>
        <MenuItem
          onClick={() => {
            setOpenAssignModal(true);
            handleClosePopover();
          }}
        >
          <GroupIcon />
          Assign Staff
        </MenuItem>
      </MenuPopover>

      <Dialog
        fullWidth
        maxWidth="sm"
        open={openAssignModal}
        onClose={handleCloseAssignModal}
      >
        <DialogTitle>
          Assign Staff
          <IconButton
            aria-label="close"
            onClick={handleCloseAssignModal}
            style={{ position: "absolute", right: "10px", top: "15px" }}
          >
            <CloseIcon style={{ fontSize: "20px" }} />
          </IconButton>
        </DialogTitle>
        <div className="p-4">
          <Typography variant="body1">
            Please Assign Staff for Managing Service for The Service Orders.
          </Typography>

          <div className="flex justify-between mt-4">
            <div style={{ flex: 1, marginRight: "10px" }}>
              <Autocomplete
                options={technicianOptions}
                value={selectedTechnician}
                onChange={(event, value) => {
                  setSelectedTechnician(value);
                  if (!value) {
                    setErrors((prev) => ({
                      ...prev,
                      technician: "Technician is required",
                    }));
                  } else {
                    setErrors((prev) => ({ ...prev, technician: "" }));
                  }
                }}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                getOptionLabel={(option) => option.title}
                renderOption={(props, option) => (
                  <li {...props}>{option.title}</li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Technician"
                    error={!!errors.technician}
                    helperText={errors.technician}
                  />
                )}
              />
            </div>
            <div style={{ flex: 1 }}>
              <Autocomplete
                options={helperOptions}
                value={selectedHelper}
                onChange={(event, value) => {
                  setSelectedHelper(value);
                  if (!value) {
                    setErrors((prev) => ({
                      ...prev,
                      helper: "Helper is required",
                    }));
                  } else {
                    setErrors((prev) => ({ ...prev, helper: "" }));
                  }
                }}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                getOptionLabel={(option) => option.title}
                renderOption={(props, option) => (
                  <li {...props}>{option.title}</li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Helper"
                    error={!!errors.helper}
                    helperText={errors.helper}
                  />
                )}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outlined" onClick={handleCloseAssignModal}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAssignStaff}
            >
              Save
            </Button>
          </div>
        </div>
      </Dialog>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={openCompleteModal}
        onClose={() => {
          setOpenCompleteModal(false);
          setSelectedService(null);
        }}
      >
        <DialogTitle>
          <Typography
            sx={{
              flex: 1,
              fontSize: "22px",
              fontWeight: "bold",
              color: "#1976d2",
            }}
          >
            Mark As Complete
          </Typography>
          <IconButton
            aria-label="close"
            onClick={() => setOpenCompleteModal(false)}
            style={{ position: "absolute", right: "10px", top: "15px" }}
          >
            <CloseIcon style={{ fontSize: "20px" }} />
          </IconButton>
        </DialogTitle>

        <div className="p-4">
          <Typography
            sx={{ fontSize: "18px", fontWeight: "bold", marginBottom: 2 }}
          >
            Please enter Site Completion Details
          </Typography>

          <Box display="flex" justifyContent="space-between" mt={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                fullWidth
                label="Completion Date"
                {...register("completionDate")}
                onChange={(date) => setValue("completionDate", date)}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Box>

          <Box display="flex" alignItems="center" gap="10px" mt={2}>
            <Typography sx={{ fontSize: "15px", fontWeight: "bold" }}>
              Is there any Parts Used?
            </Typography>
            <RadioGroup
              row
              aria-labelledby="parts-used-label"
              name="partsUsed"
              {...register("partsUsed")}
              onChange={(e) => setValue("partsUsed", e.target.value)}
            >
              <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="No" control={<Radio />} label="No" />
            </RadioGroup>
          </Box>
          {watch("partsUsed") === "Yes" && (
            <>
              <Typography variant="h6" sx={{ mt: 4 }}>
                Item Details
              </Typography>
              {fields.map((item, index) => (
                <Box
                  key={item.id}
                  sx={{
                    display: "flex",
                    gap: 2,
                    mt: 2,
                    flexDirection: { xs: "column", sm: "row" },
                  }}
                >
                  <Controller
                    name={`items.${index}.itemId`}
                    control={control}
                    render={({ field }) => (
                      <FormControl
                        fullWidth
                        error={!!errors.items?.[index]?.itemId}
                      >
                        <InputLabel id="item-name-label" shrink>
                          Item Name
                        </InputLabel>
                        <Select
                          {...field}
                          labelId="item-name-label"
                          label="Item Name"
                          displayEmpty
                          onChange={(e) => {
                            const selectedItemId = e.target.value;
                            handleItemChange(index, selectedItemId);
                            const selectedItem = itemList.find(
                              (item) => item._id === selectedItemId
                            );
                            field.onChange(e);
                          }}
                        >
                          <MenuItem value="">
                            <em>Select Item</em>
                          </MenuItem>
                          {itemList
                            .filter(
                              (item) =>
                                !selectedItemIds.includes(item._id) ||
                                item._id === field.value
                            )
                            .map((item) => (
                              <MenuItem key={item._id} value={item._id}>
                                {item.itemName}
                              </MenuItem>
                            ))}
                        </Select>
                        {errors.items?.[index]?.itemId && (
                          <Typography
                            variant="caption"
                            color="error"
                            sx={{ mt: 0.5, ml: 1.5 }}
                          >
                            {errors.items[index].itemId.message}
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  />

                  <Controller
                    name={`items.${index}.quantity`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Qty"
                        type="number"
                        error={!!errors.items?.[index]?.quantity}
                        helperText={errors.items?.[index]?.quantity?.message}
                        fullWidth
                      />
                    )}
                  />
                  <Tooltip title="Remove this item" arrow>
                    <Button
                      color="error"
                      onClick={() => remove(index)}
                      disabled={index === 0}
                    >
                      <Iconify icon="eva:trash-2-outline" />
                    </Button>
                  </Tooltip>
                </Box>
              ))}

              <Box pt={2}>
                <Tooltip title="Add another item" arrow>
                  <IconButton
                    onClick={() =>
                      append({
                        itemId: "",
                        quantity: 1,
                      })
                    }
                  >
                    <Iconify icon="eva:plus-fill" />
                  </IconButton>
                </Tooltip>
              </Box>
            </>
          )}
          <TextField
            fullWidth
            margin="normal"
            label="Remarks if Any (optional)"
            multiline
            rows={4}
            {...register("remarks")}
          />
          <TextField
            fullWidth
            margin="normal"
            type="file"
            label="Document/Photos (optional)"
            InputLabelProps={{
              shrink: true,
            }}
          />

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outlined"
              onClick={() => setOpenCompleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleComplete}
            >
              Save
            </Button>
          </div>
        </div>
      </Dialog>
      <Dialog
        open={openChangeDateDialog}
        onClose={() => setOpenChangeDateDialog(false)}
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          Set Service Schedule
          <IconButton
            aria-label="close"
            onClick={() => setOpenChangeDateDialog(false)}
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
            warranty period for the order will start from this date.
          </p>
          <Box sx={{ width: "100%", marginTop: "20px" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                fullWidth
                label="New Service Date"
                value={serviceDate}
                onChange={(date) => setServiceDate(date)}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenChangeDateDialog(false)}>Cancel</Button>
          <Button onClick={handleChangeDate} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

Index.propTypes = {
  isItemSelected: PropTypes.bool.isRequired,
  labelId: PropTypes.string.isRequired,
  row: PropTypes.object.isRequired,
  handleSelectService: PropTypes.func.isRequired,
  selectedServiceIds: PropTypes.object.isRequired,
  fetchData: PropTypes.func.isRequired,
  roles: PropTypes.arrayOf(PropTypes.object),
};

export default Index;
