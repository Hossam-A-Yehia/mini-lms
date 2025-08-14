"use client";

import { notFound } from "next/navigation";
import { useLessons } from "@/hooks/useLessons";
import { useAuth } from "@/lib/auth";
import LessonDetail from "@/components/LessonDetail";
import { Box, CircularProgress } from "@mui/material";
import { use } from "react";

export default function LessonPage({
  params,
}: {
  params: Promise<{ id: string; lessonId: string }>;
}) {
  const resolvedParams = use(params);

  const { lessons, isLoading } = useLessons(resolvedParams.id);
  const { user } = useAuth();

  if (isLoading)
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );

  const lesson = lessons.find((l) => l.id === resolvedParams.lessonId);
  if (!lesson) return notFound();

  return <LessonDetail lesson={lesson} isAdmin={user?.role === "admin"} />;
}
