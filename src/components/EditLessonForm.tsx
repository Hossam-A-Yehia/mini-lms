"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLessons } from "@/hooks/useLessons";
import { LessonFormValues } from "@/models/lesson";
import { Paper, Typography, Box, TextField, CircularProgress } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import toast from "react-hot-toast";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
});

export default function EditLessonForm({
  params,
}: {
  params: Promise<{ id: string; lessonId: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { lessons, isLoading, updateLesson } = useLessons(resolvedParams.id);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LessonFormValues>({
    resolver: zodResolver(schema),
  });

  const lesson = lessons.find((l) => l.id === resolvedParams.lessonId);

  useEffect(() => {
    if (lesson) {
      setValue("title", lesson.title);
      setValue("content", lesson.content);
    }
  }, [lesson, setValue]);

  const onSubmit = (data: LessonFormValues) => {
    updateLesson.mutate(
      { id: resolvedParams.lessonId, ...data },
      {
        onSuccess: () => {
          toast.success("Lesson updated successfully");
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

  if (!lesson) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <Typography variant="h6" color="error">
          Lesson not found
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
        Edit Lesson
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
          loading={updateLesson.isPending}
        >
          Update Lesson
        </LoadingButton>
      </Box>
    </Paper>
  );
}
