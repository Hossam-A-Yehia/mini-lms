"use client";

import * as React from "react";
import { notFound } from "next/navigation";
import { useLessons } from "@/hooks/useLessons";
import { useAuth } from "@/lib/auth";
import LessonDetail from "@/components/LessonDetail";

export default function LessonPage({
  params,
}: {
  params: Promise<{ id: string; lessonId: string }>;
}) {
  const resolvedParams = React.use(params);

  const { lessons, isLoading } = useLessons(resolvedParams.id);
  const { user } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  const lesson = lessons.find((l) => l.id === resolvedParams.lessonId);
  if (!lesson) return notFound();

  return <LessonDetail lesson={lesson} isAdmin={user?.role === "admin"} />;
}
