import { yupResolver } from "@hookform/resolvers/yup";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Card,
  Container,
  IconButton,
  TextField,
  Typography
} from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import ResponsivePaperWrapper from "../../../components/table/ResponsivePaperWrapper";
import { createcategories, editcategories, getcategoriesbyId } from "../../../redux/slices/categories/categoriesApi";
import { useDispatch } from "../../../redux/store";

const validationSchema = Yup.object().shape({
  categoryName: Yup.string().trim().required("Category Name is required"),
});

const Index = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const isAddMode = !params.id;
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState(null);

  const fetchData = useCallback(async () => {
    if (!isAddMode && params.id) {
      const res = await dispatch(getcategoriesbyId(params.id));
      if (res.payload.success) {
        setEditData(res.payload.data);
      }
    }
    setLoading(false);
  }, [dispatch, isAddMode, params.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const defaultValues = useMemo(() => ({
    categoryName: editData?.categoryName ?? "",
  }), [editData]);

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
    mode: "onTouched",
  });

  const {
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting, errors },
  } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const onSubmit = useCallback(async (data) => {
    const payload = { ...data };

    if (isAddMode) {
      const res = await dispatch(createcategories(payload));
      if (res.payload.success) {
        reset();
        navigate("/categories");
      }
    } else {
      const res = await dispatch(editcategories({ id: params.id, data: payload }));
      if (res.payload.success) {
        reset();
        navigate("/categories");
      }
    }
  }, [dispatch, isAddMode, navigate, params.id, reset]);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Container maxWidth="2xl">
        <ResponsivePaperWrapper>
          <Box className="w-full py-4 px-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <Box className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
              <Typography variant="h5" fontWeight="bold">
                {isAddMode ? "Create" : "Update"} Categories
              </Typography>
              <IconButton
                variant="outlined"
                onClick={() => navigate("/categories")}
              >
                <ArrowBackIcon />
              </IconButton>
            </Box>
          </Box>
        </ResponsivePaperWrapper>
      </Container>
      <Container maxWidth="2xl" sx={{ minHeight: "100vh" }}>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Card sx={{ p: 3, mt: 5 }}>
              <Box
                sx={{
                  display: "grid",
                  gap: 2,
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                  },
                }}
              >
                <Controller
                  name="categoryName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Category Name"
                      error={!!errors.categoryName}
                      helperText={errors.categoryName?.message}
                      fullWidth
                    />
                  )}
                />
              </Box>
              <Box display="flex" justifyContent="flex-end" mt={4}>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/categories")}
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

export default React.memo(Index);
