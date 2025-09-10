import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Card,
  Container,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
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
import { useTheme } from "@mui/material/styles";
import { useEffect, useMemo, useState } from "react";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import {
  Link as RouterLink,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import * as Yup from "yup";
import Iconify from "../../../components/iconify";
import ResponsivePaperWrapper from "../../../components/table/ResponsivePaperWrapper";
import {
  createCompany,
  editCompany,
  getCompanybyId,
  getCompanySetting,
} from "../../../redux/slices/company/companyApi";
import { findUserWithoutPagination } from "../../../redux/slices/warehouse/warehouseApi";
import { useDispatch } from "../../../redux/store";

const validationSchema = Yup.object().shape({
  companyName: Yup.string().trim().required("Company Name is required"),
  contactNumber: Yup.string()
    .required("Contact Number is required")
    .matches(/^[0-9]{10}$/, "Contact Number must be a 10-digit number"),
  contactName: Yup.string()
    .trim()
    .required("Contact Name is required")
    .matches(/^[A-Za-z\s]+$/, "Contact Name must contain only letters"),
  emailId: Yup.string().email("Invalid email address"),
  address: Yup.string().trim().required("Address is required"),
  pinCode: Yup.string()
    .required("Pincode is required")
    .matches(/^\d{6}$/, "Pincode must be a 6-digit number"),
  siteDetails: Yup.array().of(
    Yup.object().shape({
      siteId: Yup.string().trim().required("Site ID is required"),
      siteName: Yup.string().trim().required("Site Name is required"),
      pinCode: Yup.string()
        .required("Pincode is required")
        .matches(/^\d{6}$/, "Pincode must be a 6-digit number"),
      state: Yup.string().trim().required("State is required"),
      city: Yup.string().trim().required("City is required"),
      address: Yup.string().trim().required("Site Address is required"),
      // contractorId: Yup.string().required("Contractor is required"),
    })
  ),
});

const Index = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const isAddMode = !params?.id;
  const theme = useTheme();
  const [itemList, setItemList] = useState([]);
  const location = useLocation();
  const [zipCodeError, setZipCodeError] = useState("");
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [companyPrefix, setItemPrefix] = useState([]);

  useEffect(() => {
    if (!isAddMode && params.id) {
      if (location.state) {
        setEditData(location.state);
        setLoading(false);
      } else {
        dispatch(getCompanybyId(params.id)).then((response) => {
          if (response.payload.success) {
            setEditData(response.payload.data);
          }
          setLoading(false);
        });
      }
    } else {
      setLoading(false);
    }
  }, [dispatch, isAddMode, params.id, location.state]);

  const fetchCompanySettings = async () => {
    const res = await dispatch(getCompanySetting());
    if (res?.payload) {
      setItemPrefix(res?.payload);
    }
  };

  useEffect(() => {
    fetchCompanySettings();
  }, []);

  useEffect(() => {
    const fetchAllInventory = async () => {
      try {
        const response = await dispatch(findUserWithoutPagination());
        setItemList(response.payload.data || []);
      } catch (error) {
        console.error("Failed to fetch storage stock locations:", error);
      }
    };

    fetchAllInventory();
  }, []);

  const defaultValues = useMemo(
    () => ({
      companyCode:
        editData?.companyCode ||
        (companyPrefix?.companyCount ? companyPrefix.companyCount + 1 : 1),
      companyName: editData?.companyName ?? "",
      contactNumber: editData?.contactNumber ?? "",
      siteDetails: editData?.siteDetails?.length
        ? editData.siteDetails
        : [
          {
            siteId: "",
            siteName: "",
            pinCode: "",
            state: "",
            city: "",
            address: "",
            contractorId: "",
          },
        ],
      contactName: editData?.contactName ?? "",
      emailId: editData?.emailId ?? "",
      pinCode: editData?.pinCode ?? "",
      state: editData?.state ?? "",
      city: editData?.city ?? "",
      address: editData?.address ?? "",
    }),
    [editData]
  );

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
    mode: "onTouched",
  });

  const {
    reset,
    setValue,
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
  } = methods;

  useEffect(() => {
    if (
      companyPrefix?.companyPrefix &&
      companyPrefix?.companyNumberSeprator &&
      companyPrefix?.companyNumberDigits
    ) {
      const newId = companyPrefix?.companyCount + 1;
      const paddedPrefix =
        `${companyPrefix.companyPrefix}${companyPrefix.companyNumberSeprator}` +
        `${"0".repeat(
          Math.max(
            0,
            Number(companyPrefix.companyNumberDigits) - newId.toString().length
          )
        )}`;

      setValue("companyPrefix", paddedPrefix, { shouldValidate: true });
      setValue("companyCode", editData ? editData?.companyCode : newId, {
        shouldValidate: true,
      });
    }
  }, [
    setValue,
    companyPrefix?.companyPrefix,
    companyPrefix?.companyNumberSeprator,
    companyPrefix?.companyNumberDigits,
    companyPrefix?.companyCount,
    editData,
  ]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "siteDetails",
  });

  useEffect(() => {
    reset(defaultValues);
  }, [isAddMode, editData, defaultValues, reset]);

  const onSubmit = async (data) => {
    if (data) {
      const payload = {
        ...data,
        contractorId: data.contractorId === "" ? undefined : data.contractorId,
        siteDetails: data.siteDetails.map((item) => ({
          ...item,
        })),
      };

      const editPayload = {
        ...data,
        contractorId: data.contractorId === "" ? undefined : data.contractorId,
        siteDetails: !isAddMode
          ? data.siteDetails.filter((item) => item.companyId !== params.id)
          : data.siteDetails,
      };

      if (!isAddMode) {
        const response = await dispatch(
          editCompany({ paramsId: params?.id, data: editPayload })
        );
        if (response?.payload?.message) {
          reset();
          navigate("/company");
        }
      } else {
        const response = await dispatch(createCompany(payload));
        if (response?.payload?.success) {
          reset();
          navigate("/company");
        }
      }
    }
  };

  const handleTableZipCodeChange = async (e, index) => {
    const enteredZipCode = e.target.value;
    setValue(`siteDetails.${index}.pinCode`, enteredZipCode, {
      shouldValidate: true,
    });
    if (!/^\d{6}$/.test(enteredZipCode)) {
      setZipCodeError("Please enter a valid 6-digit ZIP code.");
      setValue(`siteDetails.${index}.city`, "", { shouldValidate: true });
      setValue(`siteDetails.${index}.state`, "", { shouldValidate: true });
      return;
    }
    try {
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${enteredZipCode}`
      );
      const data = await response.json();
      if (data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
        const postOffice = data[0].PostOffice[0];
        const city = postOffice?.District || postOffice?.Division || "";
        const state = postOffice?.State || "";
        setValue(`siteDetails.${index}.city`, city, { shouldValidate: true });
        setValue(`siteDetails.${index}.state`, state, { shouldValidate: true });
        setZipCodeError("");
      } else {
        setZipCodeError("Invalid ZIP code or data not available.");
        setValue(`siteDetails.${index}.city`, "", { shouldValidate: true });
        setValue(`siteDetails.${index}.state`, "", { shouldValidate: true });
      }
    } catch (error) {
      setZipCodeError("Error fetching data. Please try again.");
      setValue(`siteDetails.${index}.city`, "", { shouldValidate: true });
      setValue(`siteDetails.${index}.state`, "", { shouldValidate: true });
    }
  };

  // const handleZipCodeChange = async (e) => {
  //   const enteredZipCode = e.target.value;
  //   setValue("pinCode", enteredZipCode, { shouldValidate: true });

  //   if (!/^\d{6}$/.test(enteredZipCode)) {
  //     setZipCodeError("Please enter a valid 6-digit ZIP code.");
  //     setValue("city", "", { shouldValidate: true });
  //     setValue("state", "", { shouldValidate: true });
  //     return;
  //   }

  //   try {
  //     const response = await fetch(
  //       `https://api.postalpincode.in/pincode/${enteredZipCode}`
  //     );
  //     const data = await response.json();

  //     if (data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
  //       const postOffice = data[0].PostOffice[0];
  //       const city = postOffice?.District || postOffice?.Division || "";
  //       const state = postOffice?.State || "";

  //       setValue("city", city, { shouldValidate: true });
  //       setValue("state", state, { shouldValidate: true });
  //       setZipCodeError("");
  //     } else {
  //       setZipCodeError("Invalid ZIP code or data not available.");
  //       setValue(`city`, "", { shouldValidate: true });
  //       setValue(`state`, "", { shouldValidate: true });
  //     }
  //   } catch (error) {
  //     setZipCodeError("Error fetching data. Please try again.");
  //     setValue("city", "", { shouldValidate: true });
  //     setValue("state", "", { shouldValidate: true });
  //   }
  // };

  // const handleCompanyNameChange = (e) => {
  //   const value = e.target.value;
  //   setValue("companyName", value);

  //   const prefix = value
  //     .split(" ")
  //     .map((word) => word.charAt(0).toUpperCase())
  //     .join("");

  //   fields.forEach((_, index) => {
  //     const siteId = `${prefix}${String(index + 1).padStart(2, "0")}`;
  //     setValue(`siteDetails.${index}.siteId`, siteId);
  //   });
  // };

  // const handleAddSite = () => {
  //   const currentSiteCount = fields.length;
  //   const prefix = methods
  //     .getValues("companyName")
  //     .split(" ")
  //     .map((word) => word.charAt(0).toUpperCase())
  //     .join("");

  //   const newSiteId = `${prefix}${String(currentSiteCount + 1).padStart(
  //     2,
  //     "0"
  //   )}`;

  //   append({
  //     siteId: newSiteId,
  //     siteName: "",
  //     pinCode: "",
  //     state: "",
  //     city: "",
  //     address: "",
  //     contractorId: "",
  //   });
  // };
  
  //
  const handleZipCodeChange = async (e) => {
    const enteredZipCode = e.target.value;
    setValue("pinCode", enteredZipCode, { shouldValidate: true });
  
    if (!/^\d{6}$/.test(enteredZipCode)) {
      setZipCodeError("Please enter a valid 6-digit ZIP code.");
      setValue("city", "", { shouldValidate: true });
      setValue("state", "", { shouldValidate: true });
      // Clear for all site rows
      fields.forEach((_, idx) => {
        setValue(`siteDetails.${idx}.pinCode`, "", { shouldValidate: true });
        setValue(`siteDetails.${idx}.city`, "", { shouldValidate: true });
        setValue(`siteDetails.${idx}.state`, "", { shouldValidate: true });
        setValue(`siteDetails.${idx}.address`, "", { shouldValidate: true });
      });
      return;
    }
  
    try {
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${enteredZipCode}`
      );
      const data = await response.json();
  
      if (data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
        const postOffice = data[0].PostOffice[0];
        const city = postOffice?.District || postOffice?.Division || "";
        const state = postOffice?.State || "";
  
        setValue("city", city, { shouldValidate: true });
        setValue("state", state, { shouldValidate: true });
        setZipCodeError("");
  
        // Get the latest main address
        const mainAddress = methods.getValues("address");
  
        // Autofill for all site rows
        fields.forEach((_, idx) => {
          setValue(`siteDetails.${idx}.pinCode`, enteredZipCode, { shouldValidate: true });
          setValue(`siteDetails.${idx}.city`, city, { shouldValidate: true });
          setValue(`siteDetails.${idx}.state`, state, { shouldValidate: true });
          setValue(`siteDetails.${idx}.address`, mainAddress, { shouldValidate: true });
        });
      } else {
        setZipCodeError("Invalid ZIP code or data not available.");
        setValue("city", "", { shouldValidate: true });
        setValue("state", "", { shouldValidate: true });
        // Clear for all site rows
        fields.forEach((_, idx) => {
          setValue(`siteDetails.${idx}.pinCode`, "", { shouldValidate: true });
          setValue(`siteDetails.${idx}.city`, "", { shouldValidate: true });
          setValue(`siteDetails.${idx}.state`, "", { shouldValidate: true });
          setValue(`siteDetails.${idx}.address`, "", { shouldValidate: true });
        });
      }
    } catch (error) {
      setZipCodeError("Error fetching data. Please try again.");
      setValue("city", "", { shouldValidate: true });
      setValue("state", "", { shouldValidate: true });
      // Clear for all site rows
      fields.forEach((_, idx) => {
        setValue(`siteDetails.${idx}.pinCode`, "", { shouldValidate: true });
        setValue(`siteDetails.${idx}.city`, "", { shouldValidate: true });
        setValue(`siteDetails.${idx}.state`, "", { shouldValidate: true });
        setValue(`siteDetails.${idx}.address`, "", { shouldValidate: true });
      });
    }
  };
  
  
  
  const handleCompanyNameChange = (e) => {
    const value = e.target.value;
    setValue("companyName", value);
  
    const prefix = value
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  
    // Get the unique company code from form values
    const companyCode = methods.getValues("companyCode");
  
    fields.forEach((_, index) => {
      // Include the company code in the siteId for uniqueness
      const siteId = `${prefix}${companyCode}${String(index + 1).padStart(2, "0")}`;
      setValue(`siteDetails.${index}.siteId`, siteId);
    });

    
  };
  
  const handleAddSite = () => {
    const currentSiteCount = fields.length;
    const companyName = methods.getValues("companyName");
    const prefix = companyName
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
    const companyCode = methods.getValues("companyCode");
    const mainPinCode = methods.getValues("pinCode");
    const mainCity = methods.getValues("city");
    const mainState = methods.getValues("state");
    const mainAddress = methods.getValues("address");

  
    const newSiteId = `${prefix}${companyCode}${String(currentSiteCount + 1).padStart(2, "0")}`;
  
    append({
      siteId: newSiteId,
      siteName: "",
      pinCode: mainPinCode || "",
      state: mainState || "",
      city: mainCity || "",
      address: mainAddress||"",
      contractorId: "",
    });
  };
  
  //
  
  const contractorOptions = (itemList || [])
    .filter((item) => item?.role?.name === "Contractor")
    .map((item) => ({
      title: `${item.firstName || ""} ${item.lastName || ""}`.trim(),
      id: item._id,
    }));

  return (
    <>
      <Container maxWidth="2xl">
        <ResponsivePaperWrapper>
          <Box className="w-full flex flex-col md:flex-row siteDetails-center justify-between gap-4">
            <Typography variant="h5" fontWeight="bold">
              {isAddMode ? "Create" : "Edit"} Company
            </Typography>
          </Box>
        </ResponsivePaperWrapper>
      </Container>
      <Container maxWidth="2xl" sx={{ minHeight: "100vh" }}>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Card sx={{ p: 3, background: theme.palette.background.default }}>
              <Typography variant="h6">Company Details</Typography>

              <Box
                sx={{
                  marginTop: "10px",
                  display: "grid",
                  columnGap: 2,
                  rowGap: 3,
                  gridTemplateColumns: {
                    xs: "repeat(1, 1fr)",
                    sm: "repeat(1, 1fr)",
                    md: "repeat(3, 1fr)",
                  },
                }}
              >
                <Box sx={{ display: "flex" }}>
                  <Controller
                    name="companyPrefix"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        disabled
                        fullWidth
                        sx={{ flex: "0 0 40%" }}
                      />
                    )}
                  />
                  <Controller
                    name="companyCode"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        disabled
                        InputLabelProps={{
                          shrink: true,
                        }}
                        label="Company Code"
                        fullWidth
                        sx={{ flex: "0 0 60%" }}
                      />
                    )}
                  />
                </Box>
                <Controller
                  name="companyName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Company Name"
                      onChange={handleCompanyNameChange}
                      error={!!errors?.companyName}
                      helperText={errors?.companyName?.message}
                      fullWidth
                    />
                  )}
                />
                <Controller
                  name="contactName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Contact Name"
                      onChange={e => {
                        const value = e.target.value.replace(/[^A-Za-z\s]/g, "");
                        field.onChange(value);
                      }}
                      error={!!errors?.contactName}
                      helperText={errors?.contactName?.message}
                      fullWidth
                    />
                  )}
                />
                <Controller
                  name="contactNumber"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Contact Number"
                      fullWidth
                      error={!!errors?.contactNumber}
                      helperText={errors?.contactNumber?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">+91</InputAdornment>
                        ),
                      }}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        field.onChange(value);
                      }}
                    />
                  )}
                />

                <Controller
                  name="emailId"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="email"
                      label="Email"
                      fullWidth
                      error={!!errors?.emailId}
                      helperText={errors?.emailId?.message}
                    />
                  )}
                />
              </Box>
              <Typography variant="h6" sx={{ mt: 4 }}>
                Place Of Work
              </Typography>

              <Box
                sx={{
                  marginTop: "10px",
                  display: "grid",
                  columnGap: 2,
                  rowGap: 3,
                  gridTemplateColumns: {
                    xs: "repeat(1, 1fr)",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(3, 1fr)",
                  },
                }}
              >
                <Controller
                  name="pinCode"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleZipCodeChange(e);
                      }}
                      label="Pincode"
                      fullWidth
                      error={!!zipCodeError || !!errors?.pinCode}
                      helperText={zipCodeError || errors?.pinCode?.message}
                    />
                  )}
                />
                <Controller
                  name="state"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="State" disabled fullWidth />
                  )}
                />
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="City" disabled fullWidth />
                  )}
                />
              </Box>
              <Box
                sx={{
                  marginTop: "25px",
                  display: "grid",
                  columnGap: 2,
                  rowGap: 3,
                  gridTemplateColumns: {
                    xs: "repeat(1, 1fr)",
                    sm: "repeat(1, 1fr)",
                    md: "repeat(1, 1fr)",
                  },
                }}
              >
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      multiple
                      row={3}
                      label="Address"
                      fullWidth
                      error={!!errors?.address}
                      helperText={errors?.address?.message}
                    />
                  )}
                />
              </Box>
              <Typography variant="h6" sx={{ mt: 4, marginBottom: "10px" }}>
                Site Details
              </Typography>

              <TableContainer >
           
                <Table>
                  <TableHead>
                    <TableRow >
                      <TableCell>S.No.</TableCell>
                      <TableCell>Site ID</TableCell>
                      <TableCell>Site Name</TableCell>
                      <TableCell sx={{ width: "9%" }}>Pincode</TableCell>
                      <TableCell sx={{ width: "10%" }}>State</TableCell>
                      <TableCell sx={{ width: "10%" }}>City</TableCell>
                      <TableCell sx={{ width: "20%" }}>Site Address</TableCell>
                      <TableCell>Contractor</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {fields.map((item, index) => {
                      const isDisabled = item._id;
                      return (
                        <TableRow key={item.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            <Controller
                              name={`siteDetails.${index}.siteId`}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label="Site Id"
                                  fullWidth
                                  error={!!errors.siteDetails?.[index]?.siteId}
                                  helperText={
                                    errors.siteDetails?.[index]?.siteId?.message
                                  }
                                  disabled
                                />
                              )}
                            />
                          </TableCell>

                          <TableCell>
                            <Controller
                              name={`siteDetails.${index}.siteName`}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label="Site Name"
                                  fullWidth
                                  error={
                                    !!errors.siteDetails?.[index]?.siteName
                                  }
                                  helperText={
                                    errors.siteDetails?.[index]?.siteName
                                      ?.message
                                  }
                                  disabled={isDisabled}
                                />
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <Controller
                              name={`siteDetails.${index}.pinCode`}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label="Pincode"
                                  error={!!errors.siteDetails?.[index]?.pinCode}
                                  helperText={
                                    errors.siteDetails?.[index]?.pinCode
                                      ?.message
                                  }
                                  fullWidth
                                  onChange={(e) => {
                                    field.onChange(e);
                                    handleTableZipCodeChange(e, index);
                                  }}
                                  disabled={isDisabled}
                                />
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <Controller
                              name={`siteDetails.${index}.state`}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label="State"
                                  fullWidth
                                  error={!!errors.siteDetails?.[index]?.state}
                                  helperText={
                                    errors.siteDetails?.[index]?.state?.message
                                  }
                                  disabled
                                />
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <Controller
                              name={`siteDetails.${index}.city`}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label="City"
                                  fullWidth
                                  error={!!errors.siteDetails?.[index]?.city}
                                  helperText={
                                    errors.siteDetails?.[index]?.city?.message
                                  }
                                  disabled
                                />
                              )}
                            />
                          </TableCell>
                          <TableCell sx={{ width: "20%" }}>
                            <Controller
                              name={`siteDetails.${index}.address`}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label="Site Address"
                                  fullWidth
                                  error={!!errors.siteDetails?.[index]?.address}
                                  helperText={
                                    errors.siteDetails?.[index]?.address
                                      ?.message
                                  }
                                  disabled={isDisabled}
                                />
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <Controller
                              name={`siteDetails.${index}.contractorId`}
                              control={control}
                              render={({ field }) => {
                                const contractorValue = field.value;

                                return (
                                  <FormControl
                                    fullWidth
                                    error={
                                      !!errors.siteDetails?.[index]
                                        ?.contractorId
                                    }
                                  >
                                    <InputLabel id="item-name-label" shrink>
                                      Contractor
                                    </InputLabel>
                                    <Select
                                      {...field}
                                      labelId="item-name-label"
                                      label="Contractor"
                                      displayEmpty
                                      // disabled={isDisabled}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        field.onChange(value);
                                      }}
                                      value={contractorValue || ""}
                                    >
                                      <MenuItem value="">
                                        No Contractor Needed
                                      </MenuItem>
                                      {contractorOptions.map((item) => (
                                        <MenuItem key={item.id} value={item.id}>
                                          {item.title}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                    {errors.siteDetails?.[index]
                                      ?.contractorId && (
                                        <Typography
                                          variant="caption"
                                          color="error"
                                          sx={{ mt: 0.5, ml: 1.5 }}
                                        >
                                          {
                                            errors.siteDetails[index].contractorId
                                              .message
                                          }
                                        </Typography>
                                      )}
                                  </FormControl>
                                );
                              }}
                            />
                          </TableCell>

                          <TableCell>
                            <Tooltip title="Remove This Site" arrow>
                              <span>
                                <IconButton
                                  color="error"
                                  onClick={() => remove(index)}
                                  disabled={isDisabled || index === 0}
                                >
                                  <Iconify icon="eva:trash-2-outline" />
                                </IconButton>
                              </span>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box pt={2}>
                <Tooltip title="Add Sites" arrow>
                  <Button onClick={handleAddSite}>
                    <Iconify icon="eva:plus-fill" className="m-2" />
                    Add Sites
                  </Button>
                </Tooltip>
              </Box>

              <Box
                display="flex"
                justifyContent="flex-end"
                alignItems="center"
                mt={5}
              >
                <Button
                  component={RouterLink}
                  to="/company"
                  variant="outlined"
                  color="inherit"
                  sx={{ mr: 2 }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                >
                  Save
                </Button>
              </Box>
            </Card>
          </form>
        </FormProvider>
      </Container>
    </>
  );
};

export default Index;
