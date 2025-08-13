"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCourses } from "@/hooks/useCourses";
import { CourseFormValues } from "@/models/course";
import { Paper, Typography, Box, TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import toast from "react-hot-toast";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

export default function AddCourseForm() {
  const router = useRouter();
  const { createCourse } = useCourses();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CourseFormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: CourseFormValues) => {
    createCourse.mutate(data, {
      onSuccess: () => {
        toast.success("Course created successfully");
        router.push("/dashboard");
      },
    });
  };

  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: 500,
        mx: "auto",
        p: 4,
        mt: 6,
        borderRadius: 2,
        position: "relative",
        top: "50%",
        transform: "translate(0%, -50%)",
      }}
    >
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Create New Course
      </Typography>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
      >
        <TextField
          fullWidth
          label="Title"
          variant="outlined"
          margin="normal"
          {...register("title")}
          error={!!errors.title}
          helperText={errors.title?.message}
        />

        <TextField
          fullWidth
          label="Description"
          variant="outlined"
          margin="normal"
          multiline
          rows={4}
          {...register("description")}
          error={!!errors.description}
          helperText={errors.description?.message}
        />

        <LoadingButton
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          sx={{ mt: 3 }}
          loading={createCourse.isPending}
        >
          Create Course
        </LoadingButton>
      </Box>
    </Paper>
  );
}
