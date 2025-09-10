import { forwardRef, useCallback, useMemo, useState } from "react";
// @mui
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import * as Yup from "yup";

import PropTypes from "prop-types";
// form
import { yupResolver } from "@hookform/resolvers/yup";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Input,
  Paper,
  Slide,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { debounce } from "lodash";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import {
  createRole,
  updateRole,
  deleteRole,
} from "../../../redux/slices/roles/rolesApi";

// ----------------------------------------------------------------------

RolesAddDialog.propTypes = {
  heading: PropTypes.string,
  assetTypesData: PropTypes.array,
  assetOpen: PropTypes.bool,
  setAssetOpen: PropTypes.func,
  fetchAssetTypesData: PropTypes.func,
  selectedRole: PropTypes.object,
};

const Transition = forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

export default function RolesAddDialog({
  heading,
  assetTypesData,
  assetOpen,
  fetchAssetTypesData,
  setAssetOpen,
  selectedRole,
}) {
  const dispatch = useDispatch();
  const [inputValues, setInputValues] = useState({
    name: selectedRole?.name || "",
    status: selectedRole?.status === "Active",
  });

  const handleClose = () => {
    setAssetOpen(false);
    setInputValues({ name: "", status: false });
  };

  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
  });

  const defaultValues = useMemo(
    () => ({
      name: "",
      status: false,
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting, errors },
    setValue,
  } = methods;

  const debouncedUpdateAsset = useMemo(
    () =>
      debounce(async (id, value) => {
        try {
          await dispatch(updateRole({ id, name: value }));
          fetchAssetTypesData();
        } catch (error) {
          toast.error(error?.response?.data?.message);
        }
      }, 1000),
    [dispatch]
  );

  const handleInputChange = useCallback(
    (id, value) => {
      setInputValues((prev) => ({ ...prev, [id]: value }));
      debouncedUpdateAsset(id, value);
    },
    [debouncedUpdateAsset]
  );

  const handleDeleteRow = async (id) => {
    try {
      await dispatch(deleteRole(id));
      handleClose();
      fetchAssetTypesData();
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const onSubmit = async (data) => {
    if (data) {
      try {
        const status = data.status ? "Active" : "Inactive";
        if (selectedRole) {
          await dispatch(
            updateRole({ id: selectedRole._id, name: data.name, status })
          );
        } else {
          await dispatch(createRole({ name: data.name, status }));
        }
        handleClose();
        fetchAssetTypesData();
        reset();
      } catch (error) {
        toast.error(error.response?.data?.message);
      }
    }
  };

  const isStatusActive = (status) => status === true || status === "Active";

  const filteredAssetTypesData = selectedRole
    ? assetTypesData.filter((role) => role._id === selectedRole._id)
    : [];

  return (
    <div>
      <Dialog
        open={assetOpen}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
      >
        <DialogContent className="max-w-[1140px] w-full">
          <Box className="flex justify-between my-[10px]">
            <Box className="text-base font-semibold leading-7">Roles</Box>
            <button
              type="button"
              onClick={handleClose}
              className="flex items-center"
            >
              <CloseIcon style={{ cursor: "pointer" }} />
            </button>
          </Box>

          {selectedRole && (
            <TableContainer component={Paper}>
              <Table
                sx={{ minWidth: 450, marginBottom: "25px" }}
                aria-label="simple table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Login</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAssetTypesData.map((row) => (
                    <TableRow
                      key={row?._id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        <Input
                          type="text"
                          value={inputValues[row?._id] ?? row?.name}
                          // onChange={(e) =>
                          //   handleInputChange(row?._id, e.target.value)
                          // }
                          onChange={(e) => {
                            // Filter out non-letter characters before updating state
                            const onlyLetters = e.target.value.replace(/[^A-Za-z\s]/g, "");
                            handleInputChange(row?._id, onlyLetters);
                          }}
                          disabled={["Admin", "admin"].includes(row?.name)}
                          sx={{
                            "&.Mui-disabled": {
                              color: "inherit",
                              WebkitTextFillColor: "inherit",
                            },
                          }}
                        />
                      </TableCell>
                      
                      <TableCell>
                        <Switch
                          checked={isStatusActive(row.status)}
                          onChange={async (e) => {
                            try {
                              await dispatch(
                                updateRole({
                                  id: row._id,
                                  name: row.name,
                                  status: e.target.checked
                                    ? "Active"
                                    : "Inactive",
                                })
                              );
                              fetchAssetTypesData();
                            } catch (error) {
                              toast.error(error?.response?.data?.message);
                            }
                          }}
                          disabled={["Admin", "admin"].includes(row?.name)}
                          color="primary"
                          inputProps={{ "aria-label": "role status switch" }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <LoadingButton
                          type="submit"
                          variant="outlined"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDeleteRow(row?._id)}
                          disabled={["Admin", "admin"].includes(row?.name)}
                          sx={{
                            "&.Mui-disabled": {
                              borderColor: "rgba(0, 0, 0, 0.12)",
                              color: "rgba(0, 0, 0, 0.26)",
                            },
                          }}
                        >
                          Delete
                        </LoadingButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          {!selectedRole && (
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Box className="border-white-900/10 pb-12 pt-12">
                  <Controller
                    name="name"
                    control={methods.control}
                    render={({ field }) => (
                      <TextField
                        fullWidth
                        {...field}
                        label="Name"
                        error={!!errors.name}
                        helperText={errors.name ? errors.name.message : ""}
                        defaultValue={inputValues.name}
                        onChange={e => {
                          // Only allow letters and spaces
                          const value = e.target.value.replace(/[^A-Za-z\s]/g, "");
                          field.onChange(value);
                        }}
                      />
                    )}
                  />
                  <Box display="flex" alignItems="center" sx={{ mt: 2 }}>
                    <Box>Login</Box>
                    <Controller
                      name="status"
                      control={methods.control}
                      render={({ field }) => (
                        <Switch
                          {...field}
                          checked={inputValues.status}
                          onChange={(e) => {
                            setInputValues((prev) => ({
                              ...prev,
                              status: e.target.checked,
                            }));
                            setValue("status", e.target.checked);
                          }}
                          color="primary"
                        />
                      )}
                    />
                  </Box>
                  <Box
                    sx={{ mt: 3, mb: 3, display: "flex", gap: "10px " }}
                    className="!flex justify-end"
                  >
                    <LoadingButton
                      className="!w-[50px]"
                      type="submit"
                      variant="contained"
                      loading={isSubmitting}
                    >
                      {selectedRole ? "Update" : "Create"}
                    </LoadingButton>
                    <Button
                      onClick={handleClose}
                      className="!w-[50px]"
                      color="primary"
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              </form>
            </FormProvider>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
