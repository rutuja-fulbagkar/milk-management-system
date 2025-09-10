import { yupResolver } from "@hookform/resolvers/yup";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Container,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import {
  Link as RouterLink,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import Iconify from "../../../components/iconify";
import ResponsivePaperWrapper from "../../../components/table/ResponsivePaperWrapper";
import { getRoles } from "../../../redux/slices/roles/rolesApi";
import {
  createUser,
  editUser,
  getStaffSetting,
  getuserbyId,
} from "../../../redux/slices/user/userApi";
import { useDispatch } from "../../../redux/store";
import RolesAddDialog from "./RolesAddDialog";

const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .trim()
    .required("First Name is required")
    .matches(/^[A-Za-z]+$/, "First Name must contain only letters"),
  lastName: Yup.string()
    .trim()
    .required("Last Name is required")
    .matches(/^[A-Za-z]+$/, "Last Name must contain only letters"),
  email: Yup.string()
  .transform((value) => (value === "" ? null : value))
  .email("Enter a valid email")
  .matches(
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    "Email must be a valid format"
  )
  .nullable()
  .notRequired(),


  role: Yup.object()
    .shape({
      _id: Yup.string().required(),
      name: Yup.string().required(),
    })
    .required("Role is required"),
  pinCode: Yup.string()
    .required("Pincode is required")
    .matches(/^\d{6}$/, "Pincode must be a 6-digit number"),
  mobile: Yup.string()
    .required("Contact Number is required")
    .matches(/^[0-9]{10}$/, "Contact Number must be a 10-digit number"),
});

const Index = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const isAddMode = !params?.id;
  const theme = useTheme();
  const location = useLocation();
  const [zipCodeError, setZipCodeError] = useState("");
  const [rolesOpen, setRolesOpen] = useState(false);
  const [rolesData, setRolesData] = useState([]);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [staffPrefix, setItemPrefix] = useState([]);

  const fetchRolesData = useCallback(async () => {
    const response = await dispatch(getRoles());
    setRolesData(response?.payload);
  }, [dispatch]);

  useEffect(() => {
    fetchRolesData();
  }, [fetchRolesData]);

  const fetchEmployeeSettings = async () => {
    const res = await dispatch(getStaffSetting());
    if (res?.payload) {
      setItemPrefix(res?.payload);
    }
  };

  useEffect(() => {
    fetchEmployeeSettings();
  }, []);

  useEffect(() => {
    if (!isAddMode && params.id) {
      if (location.state) {
        setEditData(location.state);
        setLoading(false);
      } else {
        dispatch(getuserbyId(params.id)).then((response) => {
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

  const defaultValues = useMemo(
    () => ({
      employeeId:
        editData?.employeeId ||
        (staffPrefix?.staffCount ? staffPrefix.staffCount + 1 : 1),
      firstName: editData?.firstName ?? "",
      lastName: editData?.lastName ?? "",
      email: editData?.email ?? "",
      mobile: editData?.mobile ?? "",
      pinCode: editData?.pinCode ?? "",
      state: editData?.state ?? "",
      city: editData?.city ?? "",
      address: editData?.address ?? "",
      role: editData?.role
        ? { _id: editData.role._id, name: editData.role.name }
        : null,
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
    watch,
    setValue,
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
  } = methods;

  useEffect(() => {
    if (
      staffPrefix?.staffPrefix &&
      staffPrefix?.staffNumberSeprator &&
      staffPrefix?.staffNumberDigits
    ) {
      const newId = staffPrefix?.staffCount + 1;
      const paddedPrefix =
        `${staffPrefix.staffPrefix}${staffPrefix.staffNumberSeprator}` +
        `${"0".repeat(
          Math.max(
            0,
            Number(staffPrefix.staffNumberDigits) - newId.toString().length
          )
        )}`;

      setValue("staffPrefix", paddedPrefix, { shouldValidate: true });
      setValue("employeeId", editData ? editData?.employeeId : newId, {
        shouldValidate: true,
      });
    }
  }, [
    setValue,
    staffPrefix?.staffPrefix,
    staffPrefix?.staffNumberSeprator,
    staffPrefix?.staffNumberDigits,
    staffPrefix?.staffCount,
    editData,
  ]);

  useEffect(() => {
    reset(defaultValues);
  }, [isAddMode, editData, defaultValues, reset]);

  const onSubmit = async (data) => {
    if (data) {
      const payload = {
        ...data,
        role: data.role?._id,
      };
      const editPayload = {
        ...data,
        role: data.role?._id,
      };

      if (!isAddMode) {
        const response = await dispatch(
          editUser({ paramsId: params?.id, data: editPayload })
        );
        if (response?.payload?.message) {
          reset();
          navigate("/user");
        }
      } else {
        const response = await dispatch(createUser(payload));
        if (response?.payload?.success) {
          toast.success(response?.payload?.message);
          reset();
          navigate("/user");
        }
      }
    }
  };

  const handleZipCodeChange = async (e) => {
    const enteredZipCode = e.target.value;
    setValue("pinCode", enteredZipCode, { shouldValidate: true });

    if (!/^\d{6}$/.test(enteredZipCode)) {
      setZipCodeError("Please enter a valid 6-digit ZIP code.");
      setValue("city", "", { shouldValidate: true });
      setValue("state", "", { shouldValidate: true });
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
      } else {
        setZipCodeError("Invalid ZIP code or data not available.");
        setValue("city", "", { shouldValidate: true });
        setValue("state", "", { shouldValidate: true });
      }
    } catch (error) {
      console.error("Error fetching ZIP code data:", error);
      setZipCodeError("Error fetching data. Please try again.");
      setValue("city", "", { shouldValidate: true });
      setValue("state", "", { shouldValidate: true });
    }
  };

  const handleClickOpenRoles = () => {
    setRolesOpen(true);
  };

  return (
    <>
      <Container maxWidth="2xl" sx={{ minHeight: "100vh" }}>
        <ResponsivePaperWrapper>
          <Box className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
            <Typography variant="h5" fontWeight="bold">
              {isAddMode ? "Create" : "Edit"} Staff
            </Typography>
            <IconButton variant="outlined" onClick={() => navigate("/user")}>
              <ArrowBackIcon />
            </IconButton>
          </Box>
        </ResponsivePaperWrapper>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Card sx={{ p: 3, background: theme.palette.background.default }}>
              <Typography variant="h6" sx={{ marginBottom: "10px" }}>
                Staff Details
              </Typography>
              <Box
                sx={{
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
                    name="staffPrefix"
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
                    name="employeeId"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        disabled
                        InputLabelProps={{
                          shrink: true,
                        }}
                        label="Employee Id"
                        fullWidth
                        sx={{ flex: "0 0 60%" }}
                      />
                    )}
                  />
                </Box>

                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="First Name"
                      onChange={e => {
                        // Only allow letters and spaces
                        const value = e.target.value.replace(/[^A-Za-z\s]/g, "");
                        field.onChange(value);
                      }}
                      error={!!errors?.firstName}
                      helperText={errors?.firstName?.message}
                      fullWidth
                    />
                  )}
                />
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Last Name"
                      onChange={e => {
                        // Only allow letters and spaces
                        const value = e.target.value.replace(/[^A-Za-z\s]/g, "");
                        field.onChange(value);
                      }}
                      error={!!errors?.lastName}
                      helperText={errors?.lastName?.message}
                      fullWidth
                    />
                  )}
                />

                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Email"
                      error={!!errors?.email}
                      helperText={errors?.email?.message}
                      fullWidth
                    />
                  )}
                />
                <Controller
                  name="mobile"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Contact Number"
                      fullWidth
                      error={!!errors?.mobile}
                      helperText={errors?.mobile?.message}
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
                <Box
                  display="flex"
                  className=" !w-[100%] "
                  rowGap={3}
                  columnGap={0}
                >
                  <Controller
                    name="role"
                    control={control}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <Autocomplete
                        disabled={!isAddMode}
                        fullWidth
                        options={rolesData.filter(role => role.name?.toLowerCase() !== "admin")}
                        getOptionLabel={(option) => option?.name || ""}
                        isOptionEqualToValue={(opt, val) => opt._id === val._id}
                        value={value}
                        onChange={(_, newValue) => onChange(newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="User Role"
                            error={!!error}
                            helperText={error?.message}
                          />
                        )}
                      />
                    )}
                  />
                  <Button
                    type="button"
                    disabled={!isAddMode}
                    variant="outlined"
                    onClick={handleClickOpenRoles}
                    sx={{ height: 55, minWidth: 50 }}
                  >
                    <Iconify icon="eva:plus-fill" />
                  </Button>
                </Box>
              </Box>
              <Typography variant="h6" sx={{ mt: 4 }}>
                Address
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
                    />
                  )}
                />
              </Box>
              <Box
                display="flex"
                justifyContent="flex-end"
                alignItems="center"
                mt={5}
              >
                <Button
                  component={RouterLink}
                  to="/user"
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
        <RolesAddDialog
          assetOpen={rolesOpen}
          setAssetOpen={setRolesOpen}
          assetTypesData={rolesData}
          fetchAssetTypesData={fetchRolesData}
        />
      </Container>
    </>
  );
};

export default Index;
