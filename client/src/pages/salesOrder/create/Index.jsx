import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Container,
  MenuItem,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form";
import {
  Link as RouterLink,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import * as Yup from "yup";
import ResponsivePaperWrapper from "../../../components/table/ResponsivePaperWrapper";
import { findCompanyWithoutPagination } from "../../../redux/slices/company/companyApi";
import {
  createSalesOrders,
  editSalesOrders,
  getsalesOrdersbyId,
} from "../../../redux/slices/salesOrder/salesOrderApi";
import { findSiteWithoutPagination } from "../../../redux/slices/site/siteApi";
import { findUserWithoutPagination } from "../../../redux/slices/user/userApi";
import { useDispatch } from "../../../redux/store";

const Index = () => {
  const navigate = useNavigate();
  const params = useParams();
  const isAddMode = !params?.id;
  const theme = useTheme();
  const location = useLocation();
  const [editData, setEditData] = useState(null);
  const [userData, setUserData] = useState([]);
  const [company, setCompany] = useState([]);
  const [siteData, setSiteData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coolerRows, setCoolerRows] = useState([]);
  const [orderType, setOrderType] = useState("InHouse");

  const validationSchema = Yup.object().shape({
    companyId: Yup.object()
      .shape({
        _id: Yup.string().required("Company is required"),
        companyName: Yup.string().required("Company Name is required"),
      })
      .required("Company is required"),
    siteId: Yup.object()
      .shape({
        _id: Yup.string().required("Site is required"),
        siteName: Yup.string().required("Site Name is required"),
      })
      .required("Site is required"),
    billNumber: Yup.string().required("Sales Order Number is required"),
    purchaseDate: Yup.date().required("Sales Order Date is required"),
    numberOfCoolersPurchased:
      orderType === "InHouse" &&
      Yup.number()
        .typeError("Number of Coolers Purchased must be a number")
        .required("Number Of Coolers Purchased is required")
        .positive("Number must be greater than zero")
        .integer("Number must be an integer"),
    numberOfCoolersForService:
      orderType === "AdHoc" &&
      Yup.number()
        .typeError("Number of Coolers Services must be a number")
        .required("Number Of Coolers Services is required")
        .positive("Number must be greater than zero")
        .integer("Number must be an integer"),
    coolerDetails: Yup.array()
      .of(
        Yup.object().shape({
          serialNumber: Yup.string().required("Serial Number is required"),
          modelNumber: Yup.string().required("Model Number is required"),
          make: Yup.string().required("Make is required"),
        })
      )
      .min(1, "At least one cooler detail is required"),
  });

  const dispatch = useDispatch();

  const fetchUserData = useCallback(async () => {
    const response = await dispatch(findUserWithoutPagination());
    setUserData(response?.payload);
  }, [dispatch]);

  const fetchSiteData = useCallback(async () => {
    const response = await dispatch(findSiteWithoutPagination());
    setSiteData(response?.payload);
  }, [dispatch]);

  const fetchCompanyData = useCallback(async () => {
    const response = await dispatch(findCompanyWithoutPagination());
    setCompany(response?.payload);
  }, [dispatch]);

  useEffect(() => {
    fetchUserData();
    fetchSiteData();
    fetchCompanyData();
  }, [fetchUserData, fetchSiteData, fetchCompanyData]);

  useEffect(() => {
    if (!isAddMode && params?.id) {
      dispatch(getsalesOrdersbyId(params?.id)).then((response) => {
        if (response?.payload?.success) {
          setEditData(response?.payload?.data);
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [dispatch, isAddMode, params?.id]);

  const matchedCompany = editData?.companyId
    ? company?.find((user) => user?._id === editData?.companyId?._id)
    : null;
  const matchedSite = editData?.siteId
    ? siteData?.find((user) => user?._id === editData?.siteId?._id)
    : null;

  const defaultValues = useMemo(
    () => ({
      companyId: location?.state?.companyData || matchedCompany || null,
      siteId: matchedSite ?? null,
      billNumber: editData?.billNumber ?? "",
      numberOfCoolersPurchased: editData?.numberOfCoolersPurchased ?? "",
      numberOfCoolersForService: editData?.numberOfCoolersForService ?? "",
      status: editData?.status ?? "Pending",
      coolerDetails: editData?.coolerDetails || [],
      purchaseDate: editData?.purchaseDate
        ? dayjs(editData?.purchaseDate).format("YYYY-MM-DD")
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
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { isSubmitting, errors },
  } = methods;

  const selectedCompany = useWatch({ control, name: "companyId" });

  const filteredSites = useMemo(() => {
    if (!selectedCompany?._id) return [];
    return siteData?.filter((site) => site?.companyId === selectedCompany?._id);
  }, [selectedCompany, siteData]);

  //
  const selectedSite = useWatch({ control, name: "siteId" });

  const selectedSiteFull = useMemo(() => {
    if (!selectedSite?._id) return null;
    return siteData.find(site => site._id === selectedSite._id);
  }, [selectedSite, siteData]);
  
  const hideOrderTypeSelection = useMemo(() => {
    if (!selectedSiteFull) return false;
    return selectedSiteFull.contractorId === null;
  }, [selectedSiteFull]);


  useEffect(() => {
    if (hideOrderTypeSelection) {
      setOrderType("AdHoc");
    } else {
      setOrderType("InHouse");
    }
  }, [hideOrderTypeSelection]);
  
//  

  useEffect(() => {
    reset(defaultValues);
  }, [isAddMode, editData, defaultValues, reset]);

  useEffect(() => {
    if (editData?.coolerDetails) {
      setCoolerRows(editData?.coolerDetails);
    }
  }, [editData]);

  const onSubmit = async (data) => {
    let payload = {
      ...data,
      companyId: data?.companyId?._id,
      siteId: data?.siteId?._id,
      orderType: orderType,
      coolerDetails: coolerRows,
    };

    if (orderType === "InHouse") {
      payload = {
        ...payload,
        numberOfCoolersForService: 0,
      };
    } else {
      payload = {
        ...payload,
        numberOfCoolersPurchased: 0,
      };
    }

    if (!isAddMode) {
      const response = await dispatch(
        editSalesOrders({ paramsId: params?.id, data: payload })
      );
      reset();
      navigate("/salesOrder");
    } else {
      const response = await dispatch(createSalesOrders(payload));
      if (response?.payload?.success) {
        reset();
        navigate("/salesOrder");
      }
    }
  };

  useEffect(() => {
    if (editData) {
      if (
        editData.numberOfCoolersPurchased === 0 &&
        editData.numberOfCoolersForService > 0
      ) {
        setOrderType("AdHoc");
      } else if (
        editData.numberOfCoolersForService === 0 &&
        editData.numberOfCoolersPurchased > 0
      ) {
        setOrderType("InHouse");
      }
    } else {
      setOrderType("InHouse");
    }
  }, [editData]);

  const handleCoolerCountChange = (e) => {
    const count = parseInt(e.target.value, 10);
    if (!isNaN(count) && count > 0) {
      setCoolerRows(
        Array.from({ length: count }, (_, index) => ({
          serialNumber: "",
          modelNumber: "",
          make: "",
        }))
      );
    } else {
      setCoolerRows([]);
    }
  };

  const handleCoolerChange = (index, field, value) => {
    const updatedRows = [...coolerRows];
    updatedRows[index][field] = value;
    setCoolerRows(updatedRows);
  };

  return (
    <>
      <Container maxWidth="2xl" sx={{ minHeight: "100vh" }}>
        <ResponsivePaperWrapper>
          <Box className="w-full py-4 px-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <Box className="w-full md:w-auto">
              <h1 className="text-md md:text-2xl text-gray-700 dark:text-gray-100 font-bold">
                {isAddMode ? "Create" : "Edit"} Sales Order
              </h1>
            </Box>
          </Box>
        </ResponsivePaperWrapper>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Card sx={{ p: 3, background: theme.palette.background.default }}>
              <Typography variant="h6">Sales Order Details</Typography>

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
                <Controller
                  name="companyId"
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <Autocomplete
                      disabled={location?.state?.companyData}
                      options={company}
                      getOptionLabel={(option) => option?.companyName || ""}
                      isOptionEqualToValue={(opt, val) => opt._id === val._id}
                      value={value}
                      onChange={(_, newValue) => onChange(newValue)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          disabled={!isAddMode}
                          label="Company"
                          error={!!error}
                          helperText={error?.message}
                        />
                      )}
                    />
                  )}
                />
                <Controller
                  name="siteId"
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <Autocomplete
                      options={filteredSites}
                      getOptionLabel={(option) => option?.siteName || ""}
                      isOptionEqualToValue={(opt, val) => opt._id === val._id}
                      value={value}
                      onChange={(_, newValue) => onChange(newValue)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          disabled={!isAddMode}
                          label="Site"
                          error={!!error}
                          helperText={error?.message}
                        />
                      )}
                    />
                  )}
                />
                <Controller
                  name="billNumber"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      disabled={!isAddMode}
                      {...field}
                      label="Sales Order Number"
                      fullWidth
                      error={!!errors.billNumber}
                      helperText={errors.billNumber?.message}
                    />
                  )}
                />
                <Controller
                  name="purchaseDate"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="date"
                      label="Sales Order Date"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.purchaseDate}
                      helperText={errors.purchaseDate?.message}
                      fullWidth
                    />
                  )}
                />
         
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <FormLabel component="legend" sx={{ marginRight: 2 }}>
                    Select Order Type :
                  </FormLabel>
                  <Controller
                    name="orderType"
                    control={control}
                    defaultValue={orderType}
                    render={({ field }) => (
                      <RadioGroup
                        {...field}
                        value={orderType}
                        onChange={(e) => {
                          setOrderType(e.target.value);
                          field.onChange(e);
                        }}
                        row
                      >
                        <FormControlLabel
                          value="InHouse"
                          control={<Radio />}
                          label="InHouse"
                          disabled={hideOrderTypeSelection}
                        />


                        <FormControlLabel
                          value="AdHoc"
                          control={<Radio />}
                          label="AdHoc"
                          disabled={!hideOrderTypeSelection}
                        />
                      </RadioGroup>
                    )}
                  />
                </Box>
                {orderType === "InHouse" && (
                  <Controller
                    name="numberOfCoolersPurchased"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Number Of Coolers Purchased"
                        fullWidth
                        error={!!errors.numberOfCoolersPurchased}
                        helperText={errors.numberOfCoolersPurchased?.message}
                        onChange={(e) => {
                          field.onChange(e);
                          handleCoolerCountChange(e);
                        }}
                      />
                    )}
                  />
                )}

                {orderType === "AdHoc" && (
                  <Controller
                    name="numberOfCoolersForService"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Number Of Coolers for Service"
                        fullWidth
                        error={!!errors.numberOfCoolersForService}
                        helperText={errors.numberOfCoolersForService?.message}
                        onChange={(e) => {
                          field.onChange(e);
                          handleCoolerCountChange(e);
                        }}
                      />
                    )}
                  />
                )}
              </Box>
              <Typography
                variant="h6"
                sx={{ marginTop: "25px", marginBottom: "10px" }}
              >
                Product Details
              </Typography>
              <TableContainer>
                <Table sx={{ border: "1px solid #ccc" }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ border: "1px solid #ccc" }}>
                        S.No.
                      </TableCell>
                      <TableCell sx={{ border: "1px solid #ccc" }}>
                        Enter Serial Number
                      </TableCell>
                      <TableCell sx={{ border: "1px solid #ccc" }}>
                        Enter Model Number
                      </TableCell>
                      <TableCell sx={{ border: "1px solid #ccc" }}>
                        Make
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {coolerRows.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          sx={{ textAlign: "center", border: "1px solid #ccc" }}
                        >
                          Enter Number of Coolers Purchased
                        </TableCell>
                      </TableRow>
                    ) : (
                      coolerRows.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell sx={{ border: "1px solid #ccc" }}>
                            {index + 1}
                          </TableCell>
                          <TableCell sx={{ border: "1px solid #ccc" }}>
                            <Controller
                              name={`coolerDetails.${index}.serialNumber`}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  value={row.serialNumber}
                                  onChange={(e) => {
                                    handleCoolerChange(
                                      index,
                                      "serialNumber",
                                      e.target.value
                                    );
                                    field.onChange(e);
                                  }}
                                  fullWidth
                                  error={
                                    !!errors.coolerDetails?.[index]
                                      ?.serialNumber
                                  }
                                  helperText={
                                    errors.coolerDetails?.[index]?.serialNumber
                                      ?.message
                                  }
                                />
                              )}
                            />
                          </TableCell>
                          <TableCell sx={{ border: "1px solid #ccc" }}>
                            <Controller
                              name={`coolerDetails.${index}.modelNumber`}
                              control={control}
                              render={({ field }) => (
                                <Autocomplete
                                  freeSolo
                                  options={[
                                    ...new Set(
                                      coolerRows
                                        .slice(0, index)
                                        .map((row) => row.modelNumber)
                                        .filter((val) => val)
                                    ),
                                  ]}
                                  inputValue={row.modelNumber}
                                  onInputChange={(_, newValue) => {
                                    handleCoolerChange(
                                      index,
                                      "modelNumber",
                                      newValue
                                    );
                                    field.onChange(newValue);
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      fullWidth
                                      error={
                                        !!errors.coolerDetails?.[index]
                                          ?.modelNumber
                                      }
                                      helperText={
                                        errors.coolerDetails?.[index]
                                          ?.modelNumber?.message
                                      }
                                    />
                                  )}
                                />
                              )}
                            />
                          </TableCell>
                          <TableCell sx={{ border: "1px solid #ccc" }}>
                            <Controller
                              name={`coolerDetails.${index}.make`}
                              control={control}
                              render={({ field }) => (
                                <Autocomplete
                                  freeSolo
                                  options={[
                                    ...new Set(
                                      coolerRows
                                        .slice(0, index)
                                        .map((row) => row.make)
                                        .filter((val) => val)
                                    ),
                                  ]}
                                  inputValue={row.make}
                                  onInputChange={(_, newValue) => {
                                    handleCoolerChange(index, "make", newValue);
                                    field.onChange(newValue);
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      fullWidth
                                      error={
                                        !!errors.coolerDetails?.[index]?.make
                                      }
                                      helperText={
                                        errors.coolerDetails?.[index]?.make
                                          ?.message
                                      }
                                    />
                                  )}
                                />
                              )}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box
                display="flex"
                justifyContent="flex-end"
                alignItems="center"
                mt={5}
              >
                <Button
                  component={RouterLink}
                  to="/salesOrder"
                  variant="outlined"
                  color="inherit"
                  sx={{ mr: 2 }}
                >
                  Cancel
                </Button>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                >
                  Save
                </LoadingButton>
              </Box>
            </Card>
          </form>
        </FormProvider>
      </Container>
    </>
  );
};

export default Index;
