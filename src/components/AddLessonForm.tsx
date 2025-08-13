"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLessons } from "@/hooks/useLessons";
import { LessonFormValues } from "@/models/lesson";
import { useParams } from "next/navigation";
import { Paper, Typography, Box, TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
});

export default function AddLessonForm() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;
  const { createLesson } = useLessons(courseId);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LessonFormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: LessonFormValues) => {
    createLesson.mutate(
      { ...data, courseId },
      {
        onSuccess: () => router.push(`/dashboard/courses/${courseId}`),
      }
    );
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
        Create Lesson
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
          label="Content"
          variant="outlined"
          margin="normal"
          multiline
          rows={4}
          {...register("content")}
          error={!!errors.content}
          helperText={errors.content?.message}
        />

        <LoadingButton
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          sx={{ mt: 3 }}
          loading={createLesson.isPending}
        >
          Create Lesson
        </LoadingButton>
      </Box>
    </Paper>
  );
}
