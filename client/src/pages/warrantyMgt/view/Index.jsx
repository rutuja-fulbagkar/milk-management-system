import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import GroupIcon from "@mui/icons-material/Group";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Modal,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import html2canvas from "html2canvas";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ResponsivePaperWrapper from "../../../components/table/ResponsivePaperWrapper";
import { findUserWithoutPagination } from "../../../redux/slices/user/userApi";
import {
  editCompleteWarranty,
  editMultipleAssignWarranty,
  editWarranty,
  getwarrantybyId,
} from "../../../redux/slices/warranty/warrantyApi";
import { useDispatch } from "../../../redux/store";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as Yup from "yup";
import warranty from "../../../assets/img/warranty.jpg";
import Iconify from "../../../components/iconify";
import TableNoData from "../../../components/table/TableNoData";
import { findAllInventory } from "../../../redux/slices/inventory/inventoryApi";
import { setDateServices } from "../../../redux/slices/salesOrder/salesOrderApi";
import { API_BASE_URL } from "../../../utils/api";

const validationSchema = Yup.object().shape({
  technician: Yup.object().required("Technician is required"),
  helper: Yup.object().required("Helper is required"),
});

const Index = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [salesOrder, setSalesOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [getUserData, setgetUserData] = useState([]);
  const [newServiceDate, setNewServiceDate] = useState(null);
  const [openAssignModal, setOpenAssignModal] = useState(false);
  const [openMultipleAssignModal, setOpenMultipleAssignModal] = useState(false);
  const [openCompleteModal, setOpenCompleteModal] = useState(false);
  const [openChangeDateDialog, setOpenChangeDateDialog] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [selectedHelper, setSelectedHelper] = useState(null);
  const [itemList, setItemList] = useState([]);
  const [selectedItemIds, setSelectedItemIds] = useState([]);
  const [fileNames, setfileNames] = useState(null);
  const [errors, setErrors] = useState({ helper: "", technician: "" });
  const [openModal, setOpenModal] = useState(false);
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);

  const handleMultipleAssignSelectedStaff = () => {
    setOpenMultipleAssignModal(true);
  };

  const methods = useForm({
    mode: "onTouched",
  });

  const { control, register, setValue, watch } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

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

  const fetchData = useCallback(async () => {
    setLoading(true);
    const response = await dispatch(getwarrantybyId(id));
    if (response.payload && response.payload.success) {
      setSalesOrder(response.payload.data);
    }
    setLoading(false);
  }, [dispatch, id]);

  const fetchUserData = async () => {
    const response = await dispatch(findUserWithoutPagination());
    if (response?.payload) {
      setgetUserData(response?.payload);
    }
  };

  useEffect(() => {
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const technicianOptions = getUserData
    .filter((user) => user.role?.name === "Technician")
    .map((user) => ({
      _id: user._id,
      title: `${user.firstName} ${user.lastName}`,
    }));

  const helperOptions = getUserData
    .filter((user) => user.role?.name === "Helper")
    .map((user) => ({
      _id: user._id,
      title: `${user.firstName} ${user.lastName}`,
    }));

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    if (id) {
      setLoading(true);
      dispatch(getwarrantybyId(id)).then((response) => {
        if (response.payload && response.payload.success) {
          setSalesOrder(response.payload.data);
        }
        setLoading(false);
      });
    }
  }, [dispatch, id]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress size={60} thickness={5} color="primary" />
      </Box>
    );
  }

  const handleAssignStaff = async () => {
    try {
      await validationSchema.validate({
        technician: selectedTechnician,
        helper: selectedHelper,
      });
      setErrors({ technician: "", helper: "" });
      const payload = {
        userIds: [selectedTechnician?._id, selectedHelper?._id],
        warrantyId: id,
      };
      const response = await dispatch(
        editWarranty({ paramsId: selectedService?._id, data: payload })
      );
      if (response?.payload?.success) {
        setSelectedTechnician(null);
        setSelectedHelper(null);
        handleCloseAssignModal();
        fetchData();
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

  const handleMarkAsComplete = () => {
    if (selectedService.serviceBy.length === 0) {
      toast.error("Please assign staff before marking as complete.", {
        autoClose: 5000,
      });
      return;
    }
    setOpenCompleteModal(true);
    handleMenuClose();
  };

  const handleSelectService = (serviceId) => {
    setSelectedServiceIds((prev) => {
      if (prev.includes(serviceId)) {
        return prev.filter((id) => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };

  const handleMultipleAssignStaff = async () => {
    try {
      await validationSchema.validate({
        technician: selectedTechnician,
        helper: selectedHelper,
      });
      setErrors({ technician: "", helper: "" });

      const payload = {
        userIds: [selectedTechnician?._id, selectedHelper?._id],
        serviceIds: selectedServiceIds,
      };

      const response = await dispatch(
        editMultipleAssignWarranty({ data: payload })
      );
      if (response?.payload?.success) {
        setSelectedTechnician(null);
        setSelectedHelper(null);
        handleCloseMultipleAssignModal();
        fetchData();
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

  const handleOpeneModal = (file) => {
    setOpenModal(true);
    setfileNames(file);
  };

  const getFileType = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif"].includes(extension)) {
      return "image";
    } else if (extension === "pdf") {
      return "pdf";
    } else if (["mp4", "avi", "mov"].includes(extension)) {
      return "video";
    } else if (["xls", "xlsx", "csv"].includes(extension)) {
      return "excel";
    }
    return "unknown";
  };

  const downloadCard = () => {
    const element = document.getElementById("warranty-card");
    html2canvas(element).then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "warranty_certificate.png";
      link.click();
    });
  };
  const handleChangeDate = async () => {
    try {
      const payload = {
        paramsId: salesOrder?.order_id?._id,
        data: { serviceDate: newServiceDate },
      };
      const response = await dispatch(setDateServices(payload));
      if (response?.payload?.success) {
        fetchData();
        setOpenChangeDateDialog(false);
      }
    } catch (error) {
      toast.error(error?.response?.payload?.message);
    }
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleChangeTechnician = (event, value) => {
    setSelectedTechnician(value);
  };

  const handleChangeHelper = (event, value) => {
    setSelectedHelper(value);
  };

  const handleCloseAssignModal = () => {
    setOpenAssignModal(false);
  };

  const handleCloseMultipleAssignModal = () => {
    setOpenMultipleAssignModal(false);
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
      formData.append("warrantyId", id);
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
        fetchData();
        setOpenCompleteModal(false);
      }
    } catch (error) {
      console.error("Error while marking as complete:", error);
    }
  };

  const handleMenuClick = (event, service) => {
    if (service.serviceStatus === "Completed") {
      toast.error(
        "This service is already marked as complete. You can't change it.",
        {
          autoClose: 5000,
        }
      );
      return;
    }

    setAnchorEl(event.currentTarget);
    setSelectedService(service);
  };

  const renderLimitedList = (items) => {
    const visibleItems = items.slice(0, 2);
    const remainingCount = items.length - 2;

    return (
      <>
        <List>
          {visibleItems?.map((id, index) => (
            <ListItem key={index}>
              <Typography
                variant="body1"
                component="span"
                style={{ marginRight: "8px" }}
              >
                {index + 1}.
              </Typography>
              <ListItemText primary={id} />
            </ListItem>
          ))}
        </List>
        {remainingCount > 0 && (
          <Typography variant="caption" color="text.secondary">
            +{remainingCount} more
          </Typography>
        )}
      </>
    );
  };

  const renderTooltipList = (items) => (
    <List>
      {items.map((id, index) => (
        <ListItem key={index}>
          <Typography
            variant="body1"
            component="span"
            style={{ marginRight: "8px" }}
          >
            {index + 1}.
          </Typography>
          <ListItemText primary={id} />
        </ListItem>
      ))}
    </List>
  );

  return (
    <Fade in>
      <Container maxWidth="2xl" sx={{ minHeight: "100vh" }}>
        <ResponsivePaperWrapper>
          <Box className="w-full py-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <Typography variant="h5" fontWeight="bold">
              Warranty Details
            </Typography>
            <IconButton
              variant="outlined"
              onClick={() => navigate("/salesOrder")}
            >
              <ArrowBackIcon />
            </IconButton>
          </Box>
        </ResponsivePaperWrapper>
        <Paper
          elevation={6}
          className="px-2 sm:px-6 lg:px-8 py-8 max-w-9xl mx-auto"
        >
          <IconButton
            variant="contained"
            color="primary"
            onClick={downloadCard}
          >
            <DownloadIcon />
          </IconButton>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 4,
              flexWrap: "wrap",
            }}
          >
            <div id="warranty-card" onClick={downloadCard}>
              <Box>
                <div className="w-[380px] h-[250px] bg-gradient-to-br from-white via-gray-50 to-gray-100 shadow-xl rounded-xl p-5 flex flex-col justify-between border border-gray-300 transition-transform transform hover:scale-105 hover:shadow-2xl duration-300">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h1 className="text-lg font-extrabold text-gray-800 uppercase tracking-wide">
                        Warranty Certificate
                      </h1>
                      <p className="text-[10px] text-gray-500">
                        Valid Warranty Information
                      </p>
                    </div>
                    <img
                      src={warranty}
                      alt="Warranty Icon"
                      className="w-20 h-16 object-contain"
                    />
                  </div>

                  <div className="text-[11px] text-gray-800 space-y-[3px] leading-snug">
                    <p>
                      <span className="font-semibold">Company:</span>{" "}
                      <span className="font-medium text-gray-700">
                        {salesOrder?.order_id?.companyId?.companyName || "-"}
                      </span>
                    </p>
                    <p>
                      <span className="font-semibold">Site:</span>{" "}
                      <span className="font-medium text-gray-700">
                        {salesOrder?.order_id?.siteId?.siteName || "-"}
                      </span>
                    </p>
                    <p>
                      <span className="font-semibold">Order No:</span>{" "}
                      <span className="font-medium text-gray-700">
                        {salesOrder?.order_id?.billNumber || "-"}
                      </span>
                    </p>
                    <p>
                      <span className="font-semibold">Warranty ID:</span>{" "}
                      <span className="font-medium text-gray-700">
                        {salesOrder?.warrantyId || "-"}
                      </span>
                    </p>
                    <p>
                      <span className="font-semibold">Period:</span>{" "}
                      <span className="font-medium text-gray-700">
                        {salesOrder?.warrantyStartDate
                          ? `${moment(salesOrder?.warrantyStartDate).format(
                              "DD/MM/YYYY"
                            )} → ${
                              salesOrder?.warrantyEndDate
                                ? moment(salesOrder?.warrantyEndDate).format(
                                    "DD/MM/YYYY"
                                  )
                                : "-"
                            }`
                          : "-"}
                      </span>
                    </p>
                  </div>

                  <div className="text-[9px] text-gray-600 border-t border-gray-200 pt-2 mt-1">
                    <span className="block">
                      ⚠️ This warranty is valid only for the mentioned duration.
                      After expiration, this certificate is void.
                    </span>
                  </div>
                </div>
              </Box>
            </div>
            <div id="warranty-card" onClick={downloadCard}>
              <Box>
                <div className="w-[380px] h-[250px] bg-white border-2 border-[#004e83] rounded-xl p-5 shadow-md relative overflow-hidden transition-transform hover:scale-[1.03] duration-300">
                  <div className="absolute top-0 left-0 bg-[#004e83] text-white text-[10px] px-3 py-[2px] rounded-br-md font-semibold shadow-sm">
                    OFFICIAL
                  </div>

                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h1 className="text-xl font-bold text-[#004e83] uppercase">
                        Warranty
                      </h1>
                      <p className="text-xs text-gray-500 tracking-wide">
                        Certificate of Coverage
                      </p>
                    </div>
                    <img
                      src={warranty}
                      alt="Warranty Icon"
                      className="w-20 h-16 object-contain"
                    />
                  </div>

                  <div className="text-[10.5px] text-gray-700 space-y-1">
                    <p>
                      <span className="font-semibold text-[#004e83]">
                        Company:
                      </span>{" "}
                      {salesOrder?.order_id?.companyId?.companyName || "-"}
                    </p>
                    <p>
                      <span className="font-semibold text-[#004e83]">
                        Site:
                      </span>{" "}
                      {salesOrder?.order_id?.siteId?.siteName || "-"}
                    </p>
                    <p>
                      <span className="font-semibold text-[#004e83]">
                        Sales Order #:
                      </span>{" "}
                      {salesOrder?.order_id?.billNumber || "-"}
                    </p>
                    <p>
                      <span className="font-semibold text-[#004e83]">
                        Warranty ID:
                      </span>{" "}
                      {salesOrder?.warrantyId || "-"}
                    </p>
                    <p>
                      <span className="font-semibold text-[#004e83]">
                        Period:
                      </span>{" "}
                      {salesOrder?.warrantyStartDate
                        ? `${moment(salesOrder?.warrantyStartDate).format(
                            "DD/MM/YYYY"
                          )} → ${
                            salesOrder?.warrantyEndDate
                              ? moment(salesOrder?.warrantyEndDate).format(
                                  "DD/MM/YYYY"
                                )
                              : "-"
                          }`
                        : "-"}
                    </p>
                  </div>

                  <div className="absolute bottom-0 left-0 w-full text-[9px] text-gray-500 border-t border-gray-200 mt-2 pt-2 px-5 pb-3 bg-gray-50">
                    <span className="block italic">
                      This certificate is only valid during the specified
                      warranty period. After expiration, it is no longer valid.
                    </span>
                  </div>
                </div>
              </Box>
            </div>
            <div className="w-[380px] h-[400px]">
              <div
                className="flex justify-center items-center bg-white"
                onClick={downloadCard}
              >
                <div className="bg-[#6b4f3b] p-6 shadow-md">
                  <div className="bg-[#fdf8f6] rounded-[15px] px-6 py-5 space-y-5">
                    <div className="flex justify-between items-center">
                      <h1 className="text-2xl font-semibold text-[#2e2e2e]">
                        Warranty Certificate
                      </h1>
                      <img
                        src={warranty}
                        alt="Quality Assurance"
                        className="w-25 h-20 object-contain"
                      />
                    </div>

                    <div className="text-[15px] text-[#2e2e2e] space-y-2">
                      <p>
                        <span className="font-bold text-[15px]">Company :</span>{" "}
                        <span className="ml-2 text-[13px]">
                          {" "}
                          {salesOrder?.order_id?.companyId?.companyName || "-"}
                        </span>
                      </p>
                      <p>
                        <span className="font-bold text-[15px]">Site :</span>{" "}
                        <span className="ml-2 text-[13px]">
                          {" "}
                          {salesOrder?.order_id?.siteId?.siteName || "-"}
                        </span>
                      </p>
                      <p>
                        <span className="font-bold text-[15px]">
                          Sales Order no. :
                        </span>{" "}
                        <span className="ml-2 text-[10px]">
                          {salesOrder?.order_id?.billNumber || "-"}
                        </span>
                      </p>
                      <p>
                        <span className="font-bold text-[15px]">
                          Warranty Id :
                        </span>{" "}
                        <span className="ml-2 text-[12px]">
                          {" "}
                          {salesOrder?.warrantyId || "-"}
                        </span>
                      </p>
                      <p>
                        <span className="font-bold text-[15px]">
                          Warranty Period :
                        </span>{" "}
                        <span className="ml-2 text-[10px]">
                          {salesOrder?.warrantyStartDate
                            ? `${moment(salesOrder?.warrantyStartDate).format(
                                "DD/MM/YYYY"
                              )} → ${
                                salesOrder?.warrantyEndDate
                                  ? moment(salesOrder?.warrantyEndDate).format(
                                      "DD/MM/YYYY"
                                    )
                                  : "-"
                              }`
                            : "-"}
                        </span>
                      </p>
                    </div>

                    <p className="text-[10px] text-gray-600">
                      The warranty is valid only for the given period and once
                      it's expired, this warranty certificate won’t be valid.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Box>
        </Paper>
        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 2 }}>
          Service Details
        </Typography>
        <Paper
          elevation={6}
          className="px-2 sm:px-6 lg:px-8 py-8 max-w-9xl mx-auto mt-2"
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              px: 1,
            }}
          >
            {selectedServiceIds.length !== 0 && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleMultipleAssignSelectedStaff}
                size="medium"
                sx={{ borderRadius: 2, textTransform: "none" }}
              >
                <GroupIcon />
              </Button>
            )}
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={
                        selectedServiceIds.length ===
                        salesOrder?.serviceDetails.length
                      }
                      onChange={() => {
                        if (
                          selectedServiceIds.length ===
                          salesOrder?.serviceDetails.length
                        ) {
                          setSelectedServiceIds([]);
                        } else {
                          setSelectedServiceIds(
                            salesOrder?.serviceDetails.map(
                              (service) => service._id
                            )
                          );
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>SNO.</TableCell>
                  <TableCell>Service ID</TableCell>
                  <TableCell>Service Date</TableCell>
                  <TableCell>Service Sequence</TableCell>
                  <TableCell>Service By</TableCell>
                  <TableCell>Service Completion Date</TableCell>
                  <TableCell>Remarks</TableCell>
                  <TableCell>Parts Used</TableCell>
                  <TableCell>Document Upload</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {salesOrder?.serviceDetails &&
                salesOrder.serviceDetails.length > 0 ? (
                  salesOrder?.serviceDetails?.map((service, index) => (
                    <TableRow key={service._id}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedServiceIds.includes(service._id)}
                          onChange={() => handleSelectService(service._id)}
                        />
                      </TableCell>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell
                        sx={{ cursor: "pointer" }}
                        onClick={() =>
                          navigate(`/serviceMgt/view/${service._id}`)
                        }
                      >
                        {service._id}
                      </TableCell>
                      <TableCell>
                        {moment(service.serviceDate).format("DD/MM/YYYY")}
                      </TableCell>
                      <TableCell>{service.serviceSequence}</TableCell>
                      <TableCell>
                        <Typography>
                          {service.serviceBy?.length > 0
                            ? service.serviceBy
                                .map(
                                  (person) =>
                                    `${person.firstName} ${person.lastName}`
                                )
                                .join(", ")
                            : "N/A"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {service.serviceCompletionDate
                          ? moment(service.serviceCompletionDate).format(
                              "DD/MM/YYYY"
                            )
                          : "N/A"}
                      </TableCell>
                      <TableCell>{service.remarks || "N/A"}</TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center">
                          <Tooltip
                            title={renderTooltipList(
                              service?.partsUsed?.map(
                                (item) =>
                                  `${item?.itemId?.itemName || "-"} (${
                                    item?.quantity
                                  } ${item?.itemId?.unitType})`
                              ) || []
                            )}
                            arrow
                          >
                            <Typography variant="subtitle2" noWrap>
                              {renderLimitedList(
                                service.partsUsed?.map(
                                  (item) =>
                                    `${item?.itemId?.itemName || "-"} (${
                                      item?.quantity
                                    } ${item?.itemId?.unitType})`
                                ) || []
                              )}
                            </Typography>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        {service.photo === "" ? (
                          "Not Uploaded"
                        ) : (
                          <IconButton
                            onClick={() => handleOpeneModal(service.photo)}
                          >
                            <RemoveRedEyeIcon />
                          </IconButton>
                        )}
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            borderRadius: "50%",
                            backgroundColor: (() => {
                              switch (service.serviceStatus) {
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
                        {service.serviceStatus}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={(event) => handleMenuClick(event, service)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableNoData isNotFound={!salesOrder?.serviceDetails} />
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem
            onClick={() => {
              setOpenAssignModal(true);
              handleMenuClose();
            }}
          >
            <GroupIcon sx={{ marginRight: "5px" }} />
            Assign Staff
          </MenuItem>
          <MenuItem
            onClick={() => {
              if (selectedService.serviceStatus === "Completed") {
                toast.error("This service is already marked as complete.", {
                  autoClose: 5000,
                });
              } else {
                handleMarkAsComplete();
              }
            }}
          >
            <CheckCircleOutlineIcon sx={{ marginRight: "5px" }} />
            Mark As Complete
          </MenuItem>
          <MenuItem
            onClick={() => {
              setOpenChangeDateDialog(true);
              handleMenuClose();
            }}
          >
            <CalendarMonthIcon sx={{ marginRight: "5px" }} />
            Change Date
          </MenuItem>
        </Menu>
        <Dialog
          fullWidth
          maxWidth="sm"
          open={openMultipleAssignModal}
          onClose={handleCloseMultipleAssignModal}
        >
          <DialogTitle>
            Multiple Assign Staff
            <IconButton
              aria-label="close"
              onClick={handleCloseMultipleAssignModal}
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
                  onChange={handleChangeTechnician}
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
                  onChange={handleChangeHelper}
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
              <Button
                variant="outlined"
                onClick={handleCloseMultipleAssignModal}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleMultipleAssignStaff}
              >
                Save
              </Button>
            </div>
          </div>
        </Dialog>
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
                  onChange={handleChangeTechnician}
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
                  onChange={handleChangeHelper}
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
                Submit
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
              Please enter the date for the {selectedService?.serviceSequence}{" "}
              service of this order. The warranty period for the order will
              start from this date.
            </p>
            <Box sx={{ width: "100%", marginTop: "20px" }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  fullWidth
                  label="New Service Date"
                  value={newServiceDate}
                  onChange={(date) => setNewServiceDate(date)}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenChangeDateDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleChangeDate}
              color="primary"
              varient="contained"
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="file-modal"
          aria-describedby="file-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "98vw", sm: "80vw" },
              height: { xs: "90vh", sm: "80vh" },
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              borderRadius: 2,
              maxWidth: 900,
              maxHeight: "90vh",
            }}
          >
            <IconButton
              onClick={handleCloseModal}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                zIndex: 10,
              }}
            >
              <CloseIcon />
            </IconButton>

            {fileNames ? (
              (() => {
                const fileType = getFileType(fileNames);
                const file = fileNames.substring(
                  fileNames.lastIndexOf("/") + 1
                );
                const fileUrl = `${API_BASE_URL}/api/services/file/${encodeURIComponent(
                  file
                )}`;

                if (fileType === "image") {
                  return (
                    <Box
                      component="img"
                      src={fileUrl}
                      alt={file}
                      sx={{
                        maxWidth: "100%",
                        maxHeight: "70vh",
                        borderRadius: 2,
                        boxShadow: 2,
                        objectFit: "contain",
                      }}
                    />
                  );
                }

                if (fileType === "pdf") {
                  return (
                    <iframe
                      src={fileUrl}
                      width="100%"
                      height="600px"
                      title={`PDF Document ${file}`}
                      style={{
                        border: "none",
                        borderRadius: 8,
                        background: "#f3f3f3",
                        boxShadow: "0 2px 10px #0002",
                      }}
                    />
                  );
                }

                if (fileType === "video") {
                  return (
                    <video controls width="100%">
                      <source src={fileUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  );
                }

                if (fileType === "excel") {
                  return (
                    <Typography variant="body2" color="text.secondary">
                      Excel files cannot be previewed directly. You can download
                      it{" "}
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        here
                      </a>
                      .
                    </Typography>
                  );
                }

                return (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "60vh",
                      width: "100%",
                      gap: 2,
                    }}
                  >
                    <InsertDriveFileIcon
                      sx={{ fontSize: 80, color: "text.secondary" }}
                    />
                    <Typography variant="h6" noWrap>
                      {typeof fileNames === "string"
                        ? fileNames.substring(fileNames.lastIndexOf(".") + 1)
                        : ""}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      This file type cannot be previewed
                    </Typography>
                  </Box>
                );
              })()
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "60vh",
                  width: "100%",
                  gap: 2,
                }}
              >
                <InsertDriveFileIcon
                  sx={{ fontSize: 80, color: "text.secondary" }}
                />
                <Typography variant="h6">No file selected</Typography>
              </Box>
            )}
          </Box>
        </Modal>
      </Container>
    </Fade>
  );
};

export default Index;
