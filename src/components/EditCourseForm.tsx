"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCourses } from "@/hooks/useCourses";
import { CourseFormValues } from "@/models/course";
import { Paper, Typography, Box, TextField, CircularProgress } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import toast from "react-hot-toast";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

export default function EditCourseForm({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { courses, isLoading, updateCourse } = useCourses();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CourseFormValues>({
    resolver: zodResolver(schema),
  });

  const course = courses.find((c) => c.id === resolvedParams.id);

  useEffect(() => {
    if (course) {
      setValue("title", course.title);
      setValue("description", course.description);
    }
  }, [course, setValue]);

  const onSubmit = (data: CourseFormValues) => {
    updateCourse.mutate(
      { id: resolvedParams.id, ...data },
      {
        onSuccess: () => {
          toast.success("Course updated successfully");
          router.push(`/dashboard/courses/${resolvedParams.id}`);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  if (!course) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <Typography variant="h6" color="error">
          Course not found
        </Typography>
      </Box>
    );
  }

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
        Edit Course
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
          loading={updateCourse.isPending}
        >
          Update Course
        </LoadingButton>
      </Box>
    </Paper>
  );
}
