import { forwardRef, useCallback, useMemo, useState } from "react";
// @mui
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
  deleteRole,
  updateRole,
} from "../../../redux/slices/roles/rolesApi";

// ----------------------------------------------------------------------

RolesAddDialog.propTypes = {
  heading: PropTypes.string,
  assetTypesData: PropTypes.array,
  assetOpen: PropTypes.bool,
  setAssetOpen: PropTypes.func,
  fetchAssetTypesData: PropTypes.func,
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
}) {
  const dispatch = useDispatch();
  const [inputValues, setInputValues] = useState({});

  const handleClose = () => {
    setAssetOpen(false);
  };

  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
  });

  const defaultValues = useMemo(
    () => ({
      name: "",
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
        await dispatch(createRole(data));
        handleClose();
        fetchAssetTypesData();
        reset();
      } catch (error) {
        toast.error(error.response?.data?.message);
      }
    }
  };

  const isStatusActive = (status) => status === true || status === "Active";

  return (
    <div>
      <Dialog
        open={assetOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        className="shift_Transitions_dailog "
      >
        <DialogContent className=" max-w-[1140px] w-full ">
          <Box className="flex justify-between  pt-3 my-[15px]">
            <Box className="text-base font-semibold leading-7  ">Roles</Box>
            <button
              type="button"
              onClick={handleClose}
              className="flex items-center"
            >
              <CloseIcon style={{ cursor: "pointer" }} />
            </button>
          </Box>

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
                {assetTypesData?.map((row) => (
                  <TableRow
                    key={row?._id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Input
                        type="text"
                        value={inputValues[row?._id] || row?.name || ""}
                        onChange={(e) =>
                          handleInputChange(row?._id, e.target.value)
                        }
                        disabled={["Admin", "admin"].includes(row?.name)}
                        sx={{
                          backgroundColor: ["Admin", "admin"].includes(
                            row?.name
                          )
                            ? "#f5f5f5"
                            : "inherit",
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
                      <Button
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
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box className=" border-white-900/10 pb-12 pt-12">
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
                    />
                  )}
                />
                <Box
                  sx={{ mt: 3, mb: 3, display: "flex", gap: "10px " }}
                  className="!flex justify-end"
                >
                  <Button
                    className="!w-[50px]"
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                  >
                    Create
                  </Button>
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
        </DialogContent>
      </Dialog>
    </div>
  );
}
