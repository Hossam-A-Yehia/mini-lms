"use client";
import { use } from "react";
import { notFound } from "next/navigation";
import { useCourses } from "@/hooks/useCourses";
import { useAuth } from "@/lib/auth";
import { useLessons } from "@/hooks/useLessons";

import Link from "next/link";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import toast from "react-hot-toast";

export default function CourseDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);

  const { courses, isLoading: isCoursesLoading } = useCourses();
  const { 
    lessons, 
    isLoading: isLessonsLoading, 
    currentPage,
    totalCount,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
    deleteLesson 
  } = useLessons(resolvedParams.id);
  const { user } = useAuth();

  const handleDelete = (lessonId: string) => {
    deleteLesson.mutate(lessonId, {
      onSuccess: () => {
        toast.success("Lesson deleted successfully");
      },
    });
  };

  const isAdmin = user?.role === "admin";
  const pageSize = 6; 
  const totalPages = Math.ceil(totalCount / pageSize);

  if (isCoursesLoading || isLessonsLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  const course = courses.find((c) => c.id === resolvedParams.id);
  if (!course) return notFound();
console.log(lessons);

  return (
    <Box maxWidth="800px" mx="auto" mt={10}>
      <Card sx={{ mb: 4 }}>
        <CardHeader
          title={
            <Typography variant="h5" fontWeight="bold">
              {course.title}
            </Typography>
          }
          subheader={course.description}
        />
        {isAdmin && (
          <CardContent>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                color="warning"
                component={Link}
                href={`/dashboard/courses/${course.id}/edit`}
              >
                Edit Course
              </Button>
              <Button
                variant="outlined"
                color="success"
                component={Link}
                href={`/dashboard/courses/${course.id}/lessons/new`}
              >
                Add Lesson
              </Button>
            </Stack>
          </CardContent>
        )}
      </Card>
      <Typography variant="h6" gutterBottom>
        Lessons
      </Typography>
      {totalCount === 0 ? (
        <Typography color="text.secondary">No lessons yet.</Typography>
      ) : (
        <>
          <Card>
            <List>
              {lessons.map((lesson, index) => (
                <Box key={lesson.id}>
                  <ListItem
                    secondaryAction={
                      isAdmin && (
                        <Stack direction="row" spacing={1}>
                          <Button
                            size="small"
                            variant="text"
                            color="success"
                            component={Link}
                            href={`/dashboard/courses/${course.id}/lessons/${lesson.id}/edit`}
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            variant="text"
                            color="error"
                            onClick={() => handleDelete(lesson.id)}
                          >
                            Delete
                          </Button>
                        </Stack>
                      )
                    }
                  >
                    <ListItemText
                      primary={
                        <Link
                          href={`/dashboard/courses/${course.id}/lessons/${lesson.id}`}
                          style={{
                            textDecoration: "none",
                            color: "inherit",
                          }}
                        >
                          <Typography
                            variant="body1"
                            fontWeight="medium"
                            color="primary"
                          >
                            {lesson.title}
                          </Typography>
                        </Link>
                      }
                    />
                  </ListItem>
                  {index < lessons.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          </Card>
          {totalPages > 1 && (
            <Stack spacing={2} alignItems="center" sx={{ mt: 3 }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={prevPage}
                  disabled={!hasPrevPage}
                  size="small"
                >
                  Previous
                </Button>
                <Typography variant="body2">
                  Page {currentPage} of {totalPages}
                </Typography>
                <Button
                  variant="outlined"
                  onClick={nextPage}
                  disabled={!hasNextPage}
                  size="small"
                >
                  Next
                </Button>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Showing {lessons.length} of {totalCount} lessons
              </Typography>
            </Stack>
          )}
        </>
      )}
    </Box>
  );
}
