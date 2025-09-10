// import { yupResolver } from '@hookform/resolvers/yup';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import { LoadingButton } from '@mui/lab';
// import {
//   Autocomplete,
//   Box,
//   Button,
//   Card,
//   Container,
//   Grid,
//   IconButton,
//   TextField,
//   Tooltip,
//   Typography
// } from '@mui/material';
// import { useEffect, useMemo, useState } from 'react';
// import { Controller, FormProvider, useFieldArray, useForm } from 'react-hook-form';
// import { useLocation, useNavigate, useParams } from 'react-router-dom';
// import * as Yup from 'yup';
// import Iconify from '../../../../components/iconify';
// import ResponsivePaperWrapper from '../../../../components/table/ResponsivePaperWrapper';
// import { findCompanyWithoutPagination } from '../../../../redux/slices/company/companyApi';
// import { findAllInventory, getInventorySetting } from '../../../../redux/slices/inventory/inventoryApi';
// import { createOutward, editOutwardStatus, getOutwardbyId } from '../../../../redux/slices/outward/outwardApi';
// import { findRolesWithoutPagination } from '../../../../redux/slices/roles/rolesApi';
// import { findSiteWithoutPagination, getsitebyId } from '../../../../redux/slices/site/siteApi';
// import { findUserWithoutPagination } from '../../../../redux/slices/warehouse/warehouseApi';
// import { useDispatch } from '../../../../redux/store';

// const validationSchema = Yup.object().shape({
//   requestId: Yup.string().required('Request ID is required'),
//   outWardQtyDate: Yup.date().required('Date is required').typeError('Invalid date format'),
//   items: Yup.array().of(
//     Yup.object().shape({
//       itemId: Yup.string().required('Item Name is required'),
//       itemCode: Yup.string().required('Item Code / SKU is required'),
//       category: Yup.string().required('Category is required'),
//       unitType: Yup.string().required('Unit of Measurement is required'),
//       quantity: Yup.number()
//         .min(1, 'Quantity cannot be less than 1')
//         .required('Quantity is required'),
//     })
//   ).required('At least one item is required'),
//   companyId: Yup.string().required('Company is required'),
//   siteId: Yup.string().required('Site is required'),
//   orderId: Yup.string().required('Order No. is required'),
// });

// const Outward = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const params = useParams();
//   const location = useLocation();
//   const isAddMode = !params.id;
//   const [loading, setLoading] = useState(true);
//   const [editData, setEditData] = useState(null);
//   const [itemList, setItemList] = useState([]);
//   const [companyList, setCompanyList] = useState([]);
//   const [siteList, setSiteList] = useState([]);
//   const [staffList, setStaffList] = useState([]);
//   const [filteredStaffList, setFilteredStaffList] = useState([]);
//   const [rolesList, setRolesList] = useState([]);
//   const [filteredSiteList, setFilteredSiteList] = useState([]);
//   const [selectedSiteOrders, setSelectedSiteOrders] = useState([]);
//   const [outwardPrefix, setOutwardPrefix] = useState([]);
//   const [isIsNotContractorAdhoc, setIsNotContractorAdhoc] = useState(false);
//   const [selectedItemIds, setSelectedItemIds] = useState([]);
 
//   useEffect(() => {
//     const fetchData = async () => {
//       if (!isAddMode && params.id) {
//         const res = await dispatch(getOutwardbyId(params.id));
//         if (res.payload.success) setEditData(res.payload.data);
//       }
//       setLoading(false);
//     };

//     fetchData();
//   }, [dispatch, isAddMode, params.id, location.state]);

//   useEffect(() => {
//     const fetchAllInventory = async () => {
//       try {
//         const response = await dispatch(findAllInventory());
//         setItemList(response.payload.data || []);
//       } catch (error) {
//         console.error("Failed to fetch inventory:", error);
//       }
//     };

//     fetchAllInventory();
//   }, []);

//   useEffect(() => {
//     const fetchAllCompany = async () => {
//       try {
//         const response = await dispatch(findCompanyWithoutPagination());
//         setCompanyList(response.payload || []);
//       } catch (error) {
//         console.error("Failed to fetch companies:", error);
//       }
//     };

//     fetchAllCompany();
//   }, []);

//   useEffect(() => {
//     const fetchAllSite = async () => {
//       try {
//         const response = await dispatch(findSiteWithoutPagination());
//         setSiteList(response.payload || []);
//         setFilteredSiteList(response.payload || []);
//       } catch (error) {
//         console.error("Failed to fetch sites:", error);
//       }
//     };

//     fetchAllSite();
//   }, []);

//   useEffect(() => {
//     const fetchAllStaff = async () => {
//       try {
//         const response = await dispatch(findUserWithoutPagination());
//         setStaffList(response?.payload?.data || []);
//         setFilteredStaffList(response?.payload?.data || []);
//       } catch (error) {
//         console.error("Failed to fetch staff:", error);
//       }
//     };

//     fetchAllStaff();
//   }, []);

//   useEffect(() => {
//     const fetchAllRoles = async () => {
//       try {
//         const response = await dispatch(findRolesWithoutPagination());
//         setRolesList(response?.payload || []);
//       } catch (error) {
//         console.error("Failed to fetch roles:", error);
//       }
//     };

//     fetchAllRoles();
//   }, []);

//   const fetchInventorySettings = async () => {
//     const res = await dispatch(getInventorySetting());
//     if (res) {
//       setOutwardPrefix(res?.payload);
//     }
//   };

//   useEffect(() => {
//     fetchInventorySettings();
//   }, []);

//   const defaultEditData = useMemo(() => ({
//     requestId: editData?.requestId || (outwardPrefix?.requestCount ?? 0) + 1,
//     outWardQtyDate: editData?.requestedDate
//       ? editData.requestedDate.split('T')[0]
//       : new Date().toISOString().split('T')[0],
//     items: Array.isArray(editData?.items) && editData.items.length
//       ? editData.items.map(item => ({
//         itemId: item.itemId ? item.itemId._id : '' || '',
//         itemCode: item.itemCode || '',
//         category: item.category._id || '',
//         unitType: item.unitType || '',
//         quantity: item.quantity || 1,
//       }))
//       : [{ itemId: '', itemCode: '', category: '', unitType: '', quantity: 1 }],
//     companyId: editData?.siteId?.companyId?._id || '',
//     siteId: editData?.siteId?._id || '',
//     orderId: editData?.billNumber || '',
//     roleId: editData?.siteId?.contractorId?.role?._id || '',
//     staffId: editData?.requestedBy?._id || '',
//   }), [editData, outwardPrefix]);

//   const methods = useForm({
//     resolver: yupResolver(validationSchema),
//     defaultValues: defaultEditData,
//     mode: 'onTouched'
//   });

//   const { handleSubmit, reset, control, watch, setValue, formState: { isSubmitting, errors } } = methods;

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: 'items'
//   });

//   useEffect(() => {
//     reset(defaultEditData);
//   }, [defaultEditData, reset]);


//   useEffect(() => {
//     if (outwardPrefix?.outwardRequestPrefix && outwardPrefix?.outwardRequestNumberSeprator && outwardPrefix?.outwardRequestDigits) {
//       const newId = outwardPrefix?.requestCount + 1;
//       const paddedPrefix =
//         `${outwardPrefix.outwardRequestPrefix}${outwardPrefix.outwardRequestNumberSeprator}` +
//         `${'0'.repeat(
//           Math.max(0, Number(outwardPrefix.outwardRequestDigits) - newId.toString().length)
//         )}`;
//       setValue('outwardPrefix', paddedPrefix, { shouldValidate: true });
//       setValue('requestId', editData ? editData?.requestId : newId, { shouldValidate: true });
//     }
//   }, [
//     setValue,
//     outwardPrefix?.outwardRequestPrefix,
//     outwardPrefix?.outwardRequestNumberSeprator,
//     outwardPrefix?.outwardRequestDigits,
//     outwardPrefix?.requestCount,
//     editData
//   ]);

//   const onSubmit = async (data) => {
//     const { staffId, roleId, ...rest } = data;

//     let submitData = {
//       ...rest,
//       outwardPrefix: data.outwardPrefix,
//       items: rest.items.map(item => ({
//         ...item,
//         category: item.category
//       })),
//     };

//     if (isIsNotContractorAdhoc) {
//       submitData = {
//         ...submitData,
//         requestedBy: staffId || null,
//       };
//     } else {
//       submitData = {
//         ...submitData,
//         requestedBy: null,
//       };
//     }

//     const updateData = {
//       items: rest.items.map(item => ({
//         ...item,
//       })),
//       requestedBy: staffId || null,
//     };

//     if (isAddMode) {
//       const res = await dispatch(createOutward(submitData));
//       if (res.payload.success) {
//         reset();
//         navigate('/inward-outward-request?tab=outward');
//       }
//     } else {
//       const res = await dispatch(editOutwardStatus({ paramsId: params.id, data: updateData }));
//       if (res.payload.success) {
//         reset();
//         navigate('/inward-outward-request?tab=outward');
//       }
//     }
//   };

//   // Watch the selected site to filter orders
//   const selectedSiteId = watch('siteId');
//   useEffect(() => {
//     const fetchSiteById = async (siteId) => {
//       // Prevent fetching if the siteId is already being processed
//       if (!siteId) return;

//       try {
//         const response = await dispatch(getsitebyId(siteId));
//         if (response.payload.success) {
//           const siteData = response.payload.data;
//           setIsNotContractorAdhoc(!!siteData.contractorId);
//           methods.setValue('roleId', siteData.contractorId ? siteData.contractorId.role._id : '');
//           methods.setValue('staffId', siteData.contractorId ? siteData.contractorId._id : '');
//           // methods.setValue('orderId', ''); // Reset orderId when site changes
//         }
//       } catch (error) {
//         console.error("Failed to fetch site by ID:", error);
//       }
//     };

//     if (selectedSiteId) {
//       fetchSiteById(selectedSiteId);
//     }
//   }, [selectedSiteId, dispatch, methods]);


//   useEffect(() => {
//     if (selectedSiteId) {
//       const site = siteList.find(site => site._id === selectedSiteId);
//       setSelectedSiteOrders(site?.orders || []);
//       // Set orderId to the first order if available
//       if (site?.orders.length > 0) {
//         methods.setValue('orderId', site.orders[0].billNumber);
//       } else {
//         methods.setValue('orderId', ''); // Reset if no orders are available
//       }
//     } else {
//       setSelectedSiteOrders([]);
//       methods.setValue('orderId', ''); // Reset orderId if no site is selected
//     }
//   }, [selectedSiteId, siteList, methods]);

//   // Watch the selected role to filter staff
//   const selectedRoleId = watch('roleId');

//   useEffect(() => {
//     if (selectedRoleId) {
//       const filteredStaff = staffList.filter(staff => staff.role._id === selectedRoleId);
//       setFilteredStaffList(filteredStaff);
//       if (filteredStaff.length > 0) {
//         methods.setValue('staffId', filteredStaff[0]._id); // Set the first staff member as selected
//       } else {
//         methods.setValue('staffId', ''); // Reset if no staff is available
//       }
//     } else {
//       setFilteredStaffList(staffList);
//       methods.setValue('staffId', '');
//     }
//   }, [selectedRoleId, staffList, methods]);

//   // Watch the selected company to filter sites
//   const selectedCompanyId = watch('companyId');

//   useEffect(() => {
//     if (selectedCompanyId) {
//       const filteredSites = siteList.filter(site => site.companyId === selectedCompanyId);
//       setFilteredSiteList(filteredSites);
//     } else {
//       setFilteredSiteList(siteList);
//     }
//   }, [selectedCompanyId, siteList]);

//   if (loading) return <div>Loading...</div>;



//   //


//   // const handleItemChange = (index, selectedItemId) => {
//   //   // Update selected item IDs
//   //   const updatedSelectedItemIds = [...selectedItemIds];
//   //   if (selectedItemId) {
//   //     updatedSelectedItemIds[index] = selectedItemId;
//   //   } else {
//   //     updatedSelectedItemIds[index] = null; // Reset if no item is selected
//   //   }
//   //   setSelectedItemIds(updatedSelectedItemIds);
//   // };


//   const handleItemChange = (index, selectedItemId) => {
//     setSelectedItemIds(prev => {
//       const updated = [...prev];
//       updated[index] = selectedItemId || '';
//       return updated;
//     });
//   };

//   return (
//     <Container maxWidth="2xl">
//       <ResponsivePaperWrapper>
//         <Box className="w-full py-4 px-4 flex flex-col md:flex-row items-center justify-between gap-4">
//           <Typography variant="h5" fontWeight="bold">
//             {isAddMode ? "Add" : "Update"} Outward Request
//           </Typography>
//           <IconButton onClick={() => navigate("/inward-outward-request?tab=outward")}>
//             <ArrowBackIcon />
//           </IconButton>
//         </Box>
//       </ResponsivePaperWrapper>

//       <FormProvider {...methods}>
//         <form onSubmit={handleSubmit(onSubmit)} noValidate>
//           <Card sx={{ p: 3, mt: 3 }}>
//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={6}>
//                 <Box className="flex">
//                   <Box className="w-[35%]">
//                     <Controller
//                       name="outwardPrefix"
//                       control={control}
//                       render={({ field }) => (
//                         <TextField
//                           {...field}
//                           InputLabelProps={{
//                             shrink: true,
//                           }}
//                           disabled
//                           fullWidth
//                         />
//                       )}
//                     />
//                   </Box>
//                   <Box className="w-[85%]">
//                     <Controller
//                       name="requestId"
//                       control={control}
//                       render={({ field }) => (
//                         <TextField
//                           {...field}
//                           disabled
//                           InputLabelProps={{
//                             shrink: true,
//                           }}
//                           label="Outward Request ID"
//                           fullWidth
//                         />
//                       )}
//                     />
//                   </Box>
//                 </Box>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Controller
//                   name="outWardQtyDate"
//                   control={control}
//                   render={({ field }) => (
//                     <TextField
//                       {...field}
//                       label="Date of Outward Request"
//                       type="date"
//                       fullWidth
//                       InputLabelProps={{ shrink: true }}
//                       error={!!errors.outWardQtyDate}
//                       helperText={errors.outWardQtyDate?.message}
//                       disabled={!isAddMode}
//                     />
//                   )}
//                 />
//               </Grid>
//             </Grid>

//             <Typography variant="h6" sx={{ mt: 4 }}>Item Details</Typography>
//             {fields.map((item, index) => (
//               <Box key={item.id} sx={{ display: 'flex', gap: 2, mt: 2, flexDirection: { xs: 'column', sm: 'column', md: 'column', lg: 'row' } }}>
//                 <Controller
//                   name={`items.${index}.itemId`}
//                   control={control}
//                   render={({ field }) => (
//                     <Autocomplete
//                       {...field}
//                       options={itemList.filter(item => !selectedItemIds.includes(item._id) || item._id === field.value)}
//                       getOptionLabel={option => option.itemName || ''}
//                       isOptionEqualToValue={(option, value) => option._id === value}
//                       value={itemList.find(item => item._id === field.value) || null}
//                       onChange={(_, selectedOption) => {
//                         const selectedItemId = selectedOption ? selectedOption._id : '';
//                         handleItemChange(index, selectedItemId);
//                         const selectedItem = itemList.find(item => item._id === selectedItemId);

//                         if (selectedItem) {
//                           methods.setValue(`items.${index}.itemCode`, selectedItem.itemCode);
//                           methods.setValue(`items.${index}.category`, selectedItem.category._id);
//                           methods.setValue(`items.${index}.unitType`, selectedItem.unitType);
//                         } else {
//                           methods.setValue(`items.${index}.itemCode`, '');
//                           methods.setValue(`items.${index}.category`, '');
//                           methods.setValue(`items.${index}.unitType`, '');
//                         }
//                         field.onChange(selectedItemId);
//                       }}
//                       renderInput={(params) => (
//                         <TextField
//                           {...params}
//                           label="Item Name"
//                           error={!!errors.items?.[index]?.itemId}
//                           helperText={errors.items?.[index]?.itemId?.message}
//                         />
//                       )}
//                       fullWidth
//                       disableClearable
//                     />
//                   )}
//                 />

//                 <Controller
//                   name={`items.${index}.itemCode`}
//                   control={control}
//                   render={({ field }) => (
//                     <TextField
//                       {...field}
//                       label="Code/SKU"
//                       error={!!errors.items?.[index]?.itemCode}
//                       helperText={errors.items?.[index]?.itemCode?.message}
//                       fullWidth
//                       disabled
//                     />
//                   )}
//                 />
//                 <Controller
//                   name={`items.${index}.category`}
//                   control={control}
//                   render={({ field }) => {
//                     const selectedItemId = watch(`items.${index}.itemId`);
//                     const selectedItem = itemList.find(item => item._id === selectedItemId);
//                     const categoryName = selectedItem?.category?.categoryName || '';
//                     return (
//                       <TextField
//                         {...field}
//                         label="Category"
//                         error={!!errors.items?.[index]?.category}
//                         fullWidth
//                         disabled
//                         value={categoryName}
//                       />
//                     );
//                   }}
//                 />
//                 <Controller
//                   name={`items.${index}.unitType`}
//                   control={control}
//                   render={({ field }) => (
//                     <TextField
//                       {...field}
//                       label="UOM"
//                       error={!!errors.items?.[index]?.unitType}
//                       fullWidth
//                       disabled
//                     />
//                   )}
//                 />
//                 <Controller
//                   name={`items.${index}.quantity`}
//                   control={control}
//                   render={({ field }) => (
//                     <TextField
//                       {...field}
//                       label="Qty"
//                       type="number"
//                       inputProps={{ min: 1 }}
//                       error={!!errors.items?.[index]?.quantity}
//                       helperText={errors.items?.[index]?.quantity?.message}
//                       fullWidth
//                     />
//                   )}
//                 />
//                 <Tooltip title="Remove this item" arrow>
//                   <Button
//                     color="error"
//                     onClick={() => {
//                       remove(index);
//                       // Remove from selectedItemIds too
//                       setSelectedItemIds((prev) => {
//                         const newSelected = [...prev];
//                         newSelected.splice(index, 1);
//                         return newSelected;
//                       });
//                     }}
//                     disabled={index === 0}
//                   >
//                     <Iconify icon="eva:trash-2-outline" />
//                   </Button>
//                 </Tooltip>
//               </Box>
//             ))}

//             <Box pt={2}>
//               <Tooltip title="Add another item" arrow>
//                 <Button
//                   onClick={() => {
//                     append({ itemId: '', itemCode: '', category: '', unitType: '', quantity: 1 });
//                     setSelectedItemIds((prev) => [...prev, null]);
//                   }}
//                 >
//                   <Iconify icon="eva:plus-fill" className="m-2" />
//                   Add Another Item
//                 </Button>
//               </Tooltip>
//             </Box>

//             <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
//               Stock Usage Location
//             </Typography>

//             <Box
//               sx={{
//                 display: 'flex',
//                 flexWrap: 'wrap',
//                 gap: 2,
//                 mb: 4,
//               }}
//             >
//               <Box sx={{ flex: '1 1 300px' }}>

//                 <Controller
//                   name="companyId"
//                   control={control}
//                   disabled={!isAddMode}
//                   render={({ field }) => (
//                     <Autocomplete
//                       {...field}
//                       options={companyList}
//                       getOptionLabel={(option) => option.companyName || ''}
//                       isOptionEqualToValue={(option, value) => option._id === value}
//                       value={companyList.find(company => company._id === field.value) || null}
//                       onChange={(_, selectedOption) => {
//                         field.onChange(selectedOption ? selectedOption._id : '');
//                       }}
//                       renderInput={(params) => (
//                         <TextField
//                           {...params}
//                           label="Select Company"
//                           error={!!errors.companyId}
//                           helperText={errors.companyId?.message}
//                         />
//                       )}
//                       fullWidth
//                       disableClearable
//                       disabled={!isAddMode}
//                     />
//                   )}
//                 />
//               </Box>

//               {/* Conditionally render Site Name based on selected Company */}
//               {watch('companyId') && (
//                 <Box sx={{ flex: '1 1 300px' }}>
//                   <Controller
//                     name="siteId"
//                     control={control}
//                     disabled={!isAddMode}
//                     render={({ field }) => (
//                       <Autocomplete
//                         {...field}
//                         options={filteredSiteList}
//                         getOptionLabel={(option) => option.siteName || ''}
//                         isOptionEqualToValue={(option, value) => option._id === value}
//                         value={filteredSiteList.find(site => site._id === field.value) || null}
//                         onChange={(_, selectedOption) => {
//                           field.onChange(selectedOption ? selectedOption._id : '');
//                         }}
//                         renderInput={(params) => (
//                           <TextField
//                             {...params}
//                             label="Select Site Name"
//                             error={!!errors.siteId}
//                             helperText={errors.siteId?.message}
//                           />
//                         )}
//                         fullWidth
//                         disableClearable
//                         disabled={!isAddMode}
//                       />
//                     )}
//                   />
//                 </Box>
//               )}

//               {/* Conditionally render Select Order No. based on selected Site */}
//               {watch('siteId') && (
//                 <Box sx={{ flex: '1 1 300px' }}>
//                   <Controller
//                     name="orderId"
//                     control={control}
//                     disabled={!isAddMode}
//                     render={({ field }) => (
//                       <Autocomplete
//                         {...field}
//                         options={selectedSiteOrders}
//                         getOptionLabel={(option) => option.billNumber || ''}
//                         isOptionEqualToValue={(option, value) => option.billNumber === value}
//                         value={selectedSiteOrders.find(order => order.billNumber === field.value) || null}
//                         onChange={(_, selectedOption) => {
//                           field.onChange(selectedOption ? selectedOption.billNumber : '');
//                         }}
//                         renderInput={(params) => (
//                           <TextField
//                             {...params}
//                             label="Select Order No."
//                             error={!!errors.orderId}
//                             helperText={errors.orderId?.message}
//                           />
//                         )}
//                         fullWidth
//                         disableClearable
//                         disabled={!isAddMode}
//                       />
//                     )}
//                   />
//                 </Box>
//               )}
//             </Box>

//             {isIsNotContractorAdhoc && (
//               <>
//                 <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
//                   Request By
//                 </Typography>
//                 <Box
//                   sx={{
//                     display: 'flex',
//                     flexWrap: 'wrap',
//                     gap: 2,
//                   }}
//                 >
//                   <Box sx={{ flex: '1 1 300px' }}>
//                     <Controller
//                       name="roleId"
//                       control={control}
//                       disabled={!isAddMode}
//                       render={({ field }) => (
//                         <Autocomplete
//                           {...field}
//                           options={Array.isArray(rolesList) ? rolesList.filter(role => role.name?.toLowerCase() !== "helper") : []}
//                           getOptionLabel={(option) => option.name || ''}
//                           isOptionEqualToValue={(option, value) => option._id === value}
//                           value={rolesList.find(role => role._id === field.value) || null}
//                           onChange={(_, selectedOption) => {
//                             field.onChange(selectedOption ? selectedOption._id : '');
//                           }}
//                           renderInput={(params) => (
//                             <TextField
//                               {...params}
//                               label="Select Role"
//                               error={!!errors.roleId}
//                               helperText={errors.roleId?.message}
//                             />
//                           )}
//                           fullWidth
//                           disableClearable
//                           disabled={!isAddMode}
//                         />
//                       )}
//                     />
//                   </Box>
//                   <Box sx={{ flex: '1 1 300px' }}>
//                     <Controller
//                       name="staffId"
//                       control={control}
//                       disabled={!isAddMode}
//                       render={({ field }) => (
//                         <Autocomplete
//                           {...field}
//                           options={filteredStaffList}
//                           getOptionLabel={(option) =>
//                             option && option.firstName && option.lastName
//                               ? `${option.firstName} ${option.lastName}`
//                               : ''
//                           }
//                           isOptionEqualToValue={(option, value) => option._id === value}
//                           value={filteredStaffList.find(staff => staff._id === field.value) || null}
//                           onChange={(_, selectedOption) => {
//                             field.onChange(selectedOption ? selectedOption._id : '');
//                           }}
//                           renderInput={(params) => (
//                             <TextField
//                               {...params}
//                               label="Select Staff Name"
//                               error={!!errors.staffId}
//                               helperText={errors.staffId?.message}
//                             />
//                           )}
//                           fullWidth
//                           disableClearable
//                           disabled={!isAddMode}
//                         />
//                       )}
//                     />
//                   </Box>
//                 </Box>
//               </>
//             )}

//             <Box display="flex" justifyContent="flex-end" mt={4} gap={2}>
//               <Button variant="outlined" onClick={() => navigate('/inward-outward-request?tab=outward')} size="large">
//                 Cancel
//               </Button>
//               <LoadingButton type="submit" variant="contained" loading={isSubmitting} size="large">
//                 Save
//               </LoadingButton>
//             </Box>
//           </Card>
//         </form>
//       </FormProvider>
//     </Container>
//   );
// };

// export default Outward;
import { yupResolver } from '@hookform/resolvers/yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { LoadingButton } from '@mui/lab';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Container,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { Controller, FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import Iconify from '../../../../components/iconify';
import ResponsivePaperWrapper from '../../../../components/table/ResponsivePaperWrapper';
import { findCompanyWithoutPagination } from '../../../../redux/slices/company/companyApi';
import { findAllInventory, getInventorySetting } from '../../../../redux/slices/inventory/inventoryApi';
import { createOutward, editOutwardStatus, getOutwardbyId } from '../../../../redux/slices/outward/outwardApi';
import { findRolesWithoutPagination } from '../../../../redux/slices/roles/rolesApi';
import { findSiteWithoutPagination, getsitebyId } from '../../../../redux/slices/site/siteApi';
import { findUserWithoutPagination } from '../../../../redux/slices/warehouse/warehouseApi';
import { useDispatch } from '../../../../redux/store';

const validationSchema = Yup.object().shape({
  requestId: Yup.string().required('Request ID is required'),
  outWardQtyDate: Yup.date().required('Date is required').typeError('Invalid date format'),
  items: Yup.array().of(
    Yup.object().shape({
      itemId: Yup.string().required('Item Name is required'),
      itemCode: Yup.string().required('Item Code / SKU is required'),
      category: Yup.string().required('Category is required'),
      unitType: Yup.string().required('Unit of Measurement is required'),
      quantity: Yup.number()
        .min(1, 'Quantity cannot be less than 1')
        .required('Quantity is required'),
    })
  ).required('At least one item is required'),
  companyId: Yup.string().required('Company is required'),
  siteId: Yup.string().required('Site is required'),
  orderId: Yup.string().required('Order No. is required'),
});

const Outward = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const isAddMode = !params.id;
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState(null);
  const [itemList, setItemList] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [siteList, setSiteList] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [filteredStaffList, setFilteredStaffList] = useState([]);
  const [rolesList, setRolesList] = useState([]);
  const [filteredSiteList, setFilteredSiteList] = useState([]);
  const [selectedSiteOrders, setSelectedSiteOrders] = useState([]);
  const [outwardPrefix, setOutwardPrefix] = useState([]);
  const [isIsNotContractorAdhoc, setIsNotContractorAdhoc] = useState(false);
  const [selectedItemIds, setSelectedItemIds] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!isAddMode && params.id) {
        const res = await dispatch(getOutwardbyId(params.id));
        if (res.payload.success) setEditData(res.payload.data);
      }
      setLoading(false);
    };

    fetchData();
  }, [dispatch, isAddMode, params.id, location.state]);

  useEffect(() => {
    const fetchAllInventory = async () => {
      try {
        const response = await dispatch(findAllInventory());
        setItemList(response.payload.data || []);
      } catch (error) {
        console.error("Failed to fetch inventory:", error);
      }
    };

    fetchAllInventory();
  }, []);

  useEffect(() => {
    const fetchAllCompany = async () => {
      try {
        const response = await dispatch(findCompanyWithoutPagination());
        setCompanyList(response.payload || []);
      } catch (error) {
        console.error("Failed to fetch companies:", error);
      }
    };

    fetchAllCompany();
  }, []);

  useEffect(() => {
    const fetchAllSite = async () => {
      try {
        const response = await dispatch(findSiteWithoutPagination());
        setSiteList(response.payload || []);
        setFilteredSiteList(response.payload || []);
      } catch (error) {
        console.error("Failed to fetch sites:", error);
      }
    };

    fetchAllSite();
  }, []);

  useEffect(() => {
    const fetchAllStaff = async () => {
      try {
        const response = await dispatch(findUserWithoutPagination());
        setStaffList(response?.payload?.data || []);
        setFilteredStaffList(response?.payload?.data || []);
      } catch (error) {
        console.error("Failed to fetch staff:", error);
      }
    };

    fetchAllStaff();
  }, []);

  useEffect(() => {
    const fetchAllRoles = async () => {
      try {
        const response = await dispatch(findRolesWithoutPagination());
        setRolesList(response?.payload || []);
      } catch (error) {
        console.error("Failed to fetch roles:", error);
      }
    };

    fetchAllRoles();
  }, []);

  const fetchInventorySettings = async () => {
    const res = await dispatch(getInventorySetting());
    if (res) {
      setOutwardPrefix(res?.payload);
    }
  };

  useEffect(() => {
    fetchInventorySettings();
  }, []);

  const defaultEditData = useMemo(() => ({
    requestId: editData?.requestId || (outwardPrefix?.requestCount ?? 0) + 1,
    outWardQtyDate: editData?.requestedDate
      ? editData.requestedDate.split('T')[0]
      : new Date().toISOString().split('T')[0],
    items: Array.isArray(editData?.items) && editData.items.length
      ? editData.items.map(item => ({
        itemId: item.itemId ? item.itemId._id : '' || '',
        itemCode: item.itemCode || '',
        category: item.category?._id || '',
        unitType: item.unitType || '',
        quantity: item.quantity || 1,
      }))
      : [{ itemId: '', itemCode: '', category: '', unitType: '', quantity: 1 }],
    companyId: editData?.siteId?.companyId?._id || '',
    siteId: editData?.siteId?._id || '',
    orderId: editData?.billNumber || '',
    roleId: editData?.siteId?.contractorId?.role?._id || '',
    staffId: editData?.requestedBy?._id || '',
  }), [editData, outwardPrefix]);

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: defaultEditData,
    mode: 'onTouched'
  });

  const { handleSubmit, reset, control, watch, setValue, formState: { isSubmitting, errors } } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  });

  useEffect(() => {
    reset(defaultEditData);
  }, [defaultEditData, reset]);

  useEffect(() => {
    if (outwardPrefix?.outwardRequestPrefix && outwardPrefix?.outwardRequestNumberSeprator && outwardPrefix?.outwardRequestDigits) {
      const newId = outwardPrefix?.requestCount + 1;
      const paddedPrefix =
        `${outwardPrefix.outwardRequestPrefix}${outwardPrefix.outwardRequestNumberSeprator}` +
        `${'0'.repeat(
          Math.max(0, Number(outwardPrefix.outwardRequestDigits) - newId.toString().length)
        )}`;
      setValue('outwardPrefix', paddedPrefix, { shouldValidate: true });
      setValue('requestId', editData ? editData?.requestId : newId, { shouldValidate: true });
    }
  }, [
    setValue,
    outwardPrefix?.outwardRequestPrefix,
    outwardPrefix?.outwardRequestNumberSeprator,
    outwardPrefix?.outwardRequestDigits,
    outwardPrefix?.requestCount,
    editData
  ]);

  const onSubmit = async (data) => {
    const { staffId, roleId, ...rest } = data;

    let submitData = {
      ...rest,
      outwardPrefix: data.outwardPrefix,
      items: rest.items.map(item => ({
        ...item,
        category: item.category
      })),
    };

    if (isIsNotContractorAdhoc) {
      submitData = {
        ...submitData,
        requestedBy: staffId || null,
      };
    } else {
      submitData = {
        ...submitData,
        requestedBy: null,
      };
    }

    const updateData = {
      items: rest.items.map(item => ({
        ...item,
      })),
      requestedBy: staffId || null,
    };

    if (isAddMode) {
      const res = await dispatch(createOutward(submitData));
      if (res.payload.success) {
        reset();
        navigate('/inward-outward-request?tab=outward');
      }
    } else {
      const res = await dispatch(editOutwardStatus({ paramsId: params.id, data: updateData }));
      if (res.payload.success) {
        reset();
        navigate('/inward-outward-request?tab=outward');
      }
    }
  };

  // Watch the selected site to filter orders
  const selectedSiteId = watch('siteId');
  useEffect(() => {
    const fetchSiteById = async (siteId) => {
      // Prevent fetching if the siteId is already being processed
      if (!siteId) return;

      try {
        const response = await dispatch(getsitebyId(siteId));
        if (response.payload.success) {
          const siteData = response.payload.data;
          setIsNotContractorAdhoc(!!siteData.contractorId);
          methods.setValue('roleId', siteData.contractorId ? siteData.contractorId.role?._id : '');
          methods.setValue('staffId', siteData.contractorId ? siteData.contractorId._id : '');
        }
      } catch (error) {
        console.error("Failed to fetch site by ID:", error);
      }
    };

    if (selectedSiteId) {
      fetchSiteById(selectedSiteId);
    }
  }, [selectedSiteId, dispatch, methods]);

  useEffect(() => {
    if (selectedSiteId) {
      const site = siteList.find(site => site?._id === selectedSiteId);
      setSelectedSiteOrders(site?.orders || []);
      // Set orderId to the first order if available
      if (site?.orders?.length > 0) {
        methods.setValue('orderId', site.orders[0].billNumber);
      } else {
        methods.setValue('orderId', ''); // Reset if no orders are available
      }
    } else {
      setSelectedSiteOrders([]);
      methods.setValue('orderId', ''); // Reset orderId if no site is selected
    }
  }, [selectedSiteId, siteList, methods]);

  // Watch the selected role to filter staff
  const selectedRoleId = watch('roleId');

  useEffect(() => {
    if (selectedRoleId) {
      const filteredStaff = staffList.filter(staff => staff.role?._id === selectedRoleId);
      setFilteredStaffList(filteredStaff);
      if (filteredStaff.length > 0) {
        methods.setValue('staffId', filteredStaff[0]._id); // Set the first staff member as selected
      } else {
        methods.setValue('staffId', ''); // Reset if no staff is available
      }
    } else {
      setFilteredStaffList(staffList);
      methods.setValue('staffId', '');
    }
  }, [selectedRoleId, staffList, methods]);

  // Watch the selected company to filter sites
  const selectedCompanyId = watch('companyId');

  useEffect(() => {
    if (selectedCompanyId) {
      const filteredSites = siteList.filter(site => site?.companyId === selectedCompanyId);
      setFilteredSiteList(filteredSites);
    } else {
      setFilteredSiteList(siteList);
    }
  }, [selectedCompanyId, siteList]);

  if (loading) return <div>Loading...</div>;

  const handleItemChange = (index, selectedItemId) => {
    setSelectedItemIds(prev => {
      const updated = [...prev];
      updated[index] = selectedItemId || '';
      return updated;
    });
  };

  return (
    <Container maxWidth="2xl">
      <ResponsivePaperWrapper>
        <Box className="w-full py-4 px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <Typography variant="h5" fontWeight="bold">
            {isAddMode ? "Add" : "Update"} Outward Request
          </Typography>
          <IconButton onClick={() => navigate("/inward-outward-request?tab=outward")}>
            <ArrowBackIcon />
          </IconButton>
        </Box>
      </ResponsivePaperWrapper>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Card sx={{ p: 3, mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box className="flex">
                  <Box className="w-[35%]">
                    <Controller
                      name="outwardPrefix"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          disabled
                          fullWidth
                        />
                      )}
                    />
                  </Box>
                  <Box className="w-[85%]">
                    <Controller
                      name="requestId"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          disabled
                          InputLabelProps={{
                            shrink: true,
                          }}
                          label="Outward Request ID"
                          fullWidth
                        />
                      )}
                    />
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="outWardQtyDate"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Date of Outward Request"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.outWardQtyDate}
                      helperText={errors.outWardQtyDate?.message}
                      disabled={!isAddMode}
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Typography variant="h6" sx={{ mt: 4 }}>Item Details</Typography>
            {fields.map((item, index) => (
              <Box key={item.id} sx={{ display: 'flex', gap: 2, mt: 2, flexDirection: { xs: 'column', sm: 'column', md: 'column', lg: 'row' } }}>
                <Controller
                  name={`items.${index}.itemId`}
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={itemList.filter(item => !selectedItemIds.includes(item._id) || item._id === field.value)}
                      getOptionLabel={option => option.itemName || ''}
                      isOptionEqualToValue={(option, value) => option._id === value}
                      value={itemList.find(item => item._id === field.value) || null}
                      onChange={(_, selectedOption) => {
                        const selectedItemId = selectedOption ? selectedOption._id : '';
                        handleItemChange(index, selectedItemId);
                        const selectedItem = itemList.find(item => item._id === selectedItemId);

                        if (selectedItem) {
                          methods.setValue(`items.${index}.itemCode`, selectedItem.itemCode);
                          methods.setValue(`items.${index}.category`, selectedItem.category?._id);
                          methods.setValue(`items.${index}.unitType`, selectedItem.unitType);
                        } else {
                          methods.setValue(`items.${index}.itemCode`, '');
                          methods.setValue(`items.${index}.category`, '');
                          methods.setValue(`items.${index}.unitType`, '');
                        }
                        field.onChange(selectedItemId);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Item Name"
                          error={!!errors.items?.[index]?.itemId}
                          helperText={errors.items?.[index]?.itemId?.message}
                        />
                      )}
                      fullWidth
                      disableClearable
                    />
                  )}
                />

                <Controller
                  name={`items.${index}.itemCode`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Code/SKU"
                      error={!!errors.items?.[index]?.itemCode}
                      helperText={errors.items?.[index]?.itemCode?.message}
                      fullWidth
                      disabled
                    />
                  )}
                />
                <Controller
                  name={`items.${index}.category`}
                  control={control}
                  render={({ field }) => {
                    const selectedItemId = watch(`items.${index}.itemId`);
                    const selectedItem = itemList.find(item => item._id === selectedItemId);
                    const categoryName = selectedItem?.category?.categoryName || '';
                    return (
                      <TextField
                        {...field}
                        label="Category"
                        error={!!errors.items?.[index]?.category}
                        fullWidth
                        disabled
                        value={categoryName}
                      />
                    );
                  }}
                />
                <Controller
                  name={`items.${index}.unitType`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="UOM"
                      error={!!errors?.items?.[index]?.unitType}
                      fullWidth
                      disabled
                    />
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
                      inputProps={{                      min: 1 }}
                      error={!!errors.items?.[index]?.quantity}
                      helperText={errors.items?.[index]?.quantity?.message}
                      fullWidth
                    />
                  )}
                />
                <Tooltip title="Remove this item" arrow>
                  <Button
                    color="error"
                    onClick={() => {
                      remove(index);
                      // Remove from selectedItemIds too
                      setSelectedItemIds((prev) => {
                        const newSelected = [...prev];
                        newSelected.splice(index, 1);
                        return newSelected;
                      });
                    }}
                    disabled={index === 0}
                  >
                    <Iconify icon="eva:trash-2-outline" />
                  </Button>
                </Tooltip>
              </Box>
            ))}

            <Box pt={2}>
              <Tooltip title="Add another item" arrow>
                <Button
                  onClick={() => {
                    append({ itemId: '', itemCode: '', category: '', unitType: '', quantity: 1 });
                    setSelectedItemIds((prev) => [...prev, '']);
                  }}
                >
                  <Iconify icon="eva:plus-fill" className="m-2" />
                  Add Another Item
                </Button>
              </Tooltip>
            </Box>

            <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
              Stock Usage Location
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2,
                mb: 4,
              }}
            >
              <Box sx={{ flex: '1 1 300px' }}>
                <Controller
                  name="companyId"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={companyList || []}
                      getOptionLabel={(option) => option?.companyName || ''}
                      isOptionEqualToValue={(option, value) => option?._id === value}
                      value={companyList?.find(company => company?._id === field.value) || null}
                      onChange={(_, selectedOption) => {
                        field.onChange(selectedOption ? selectedOption._id : '');
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Company"
                          error={!!errors.companyId}
                          helperText={errors.companyId?.message}
                        />
                      )}
                      fullWidth
                      disableClearable
                      disabled={!isAddMode}
                    />
                  )}
                />
              </Box>

              {watch('companyId') && (
                <Box sx={{ flex: '1 1 300px' }}>
                  <Controller
                    name="siteId"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        options={filteredSiteList || []}
                        getOptionLabel={(option) => option?.siteName || ''}
                        isOptionEqualToValue={(option, value) => option?._id === value}
                        value={filteredSiteList?.find(site => site?._id === field.value) || null}
                        onChange={(_, selectedOption) => {
                          field.onChange(selectedOption ? selectedOption._id : '');
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select Site Name"
                            error={!!errors.siteId}
                            helperText={errors.siteId?.message}
                          />
                        )}
                        fullWidth
                        disableClearable
                        disabled={!isAddMode}
                      />
                    )}
                  />
                </Box>
              )}

              {watch('siteId') && (
                <Box sx={{ flex: '1 1 300px' }}>
                  <Controller
                    name="orderId"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        options={selectedSiteOrders || []}
                        getOptionLabel={(option) => option?.billNumber || ''}
                        isOptionEqualToValue={(option, value) => option?.billNumber === value}
                        value={selectedSiteOrders?.find(order => order?.billNumber === field.value) || null}
                        onChange={(_, selectedOption) => {
                          field.onChange(selectedOption ? selectedOption.billNumber : '');
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select Order No."
                            error={!!errors.orderId}
                            helperText={errors.orderId?.message}
                          />
                        )}
                        fullWidth
                        disableClearable
                        disabled={!isAddMode}
                      />
                    )}
                  />
                </Box>
              )}
            </Box>

            {isIsNotContractorAdhoc && (
              <>
                <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                  Request By
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 2,
                  }}
                >
                  <Box sx={{ flex: '1 1 300px' }}>
                    <Controller
                      name="roleId"
                      control={control}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          options={(Array.isArray(rolesList) ? rolesList.filter(role => (role?.name?.toLowerCase() !== "helper")) : []) || []}
                          getOptionLabel={(option) => option?.name || ''}
                          isOptionEqualToValue={(option, value) => option?._id === value}
                          value={rolesList?.find(role => role?._id === field.value) || null}
                          onChange={(_, selectedOption) => {
                            field.onChange(selectedOption ? selectedOption._id : '');
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Select Role"
                              error={!!errors.roleId}
                              helperText={errors.roleId?.message}
                            />
                          )}
                          fullWidth
                          disableClearable
                          disabled={!isAddMode}
                        />
                      )}
                    />
                  </Box>
                  {console.log("filteredStaffList",filteredStaffList,"rolesList",rolesList,'selectedSiteOrders',selectedSiteOrders)}
                  <Box sx={{ flex: '1 1 300px' }}>
                    <Controller
                      name="staffId"
                      control={control}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          options={filteredStaffList || []}
                          getOptionLabel={(option) =>
                            option && option.firstName && option.lastName
                              ? `${option.firstName} ${option.lastName}`
                              : ''
                          }
                          isOptionEqualToValue={(option, value) => option?._id === value}
                          value={filteredStaffList?.find(staff => staff?._id === field.value) || null}
                          onChange={(_, selectedOption) => {
                            field.onChange(selectedOption ? selectedOption._id : '');
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Select Staff Name"
                              error={!!errors.staffId}
                              helperText={errors.staffId?.message}
                            />
                          )}
                          fullWidth
                          disableClearable
                          disabled={!isAddMode}
                        />
                      )}
                    />
                  </Box>
                </Box>
              </>
            )}

            <Box display="flex" justifyContent="flex-end" mt={4} gap={2}>
              <Button variant="outlined" onClick={() => navigate('/inward-outward-request?tab=outward')} size="large">
                Cancel
              </Button>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting} size="large">
                Save
              </LoadingButton>
            </Box>
          </Card>
        </form>
      </FormProvider>
    </Container>
  );
};

export default Outward;
