"use client";

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

export default function CourseDetail({ params }: { params: { id: string } }) {
  const { courses, isLoading: isCoursesLoading } = useCourses();
  const { lessons, isLoading: isLessonsLoading } = useLessons(params.id);
  const { user } = useAuth();

  const isAdmin = user?.role === "admin";

  if (isCoursesLoading || isLessonsLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  const course = courses.find((c) => c.id === params.id);
  if (!course) return notFound();

  return (
    <Box maxWidth="800px" mx="auto" mt={10}>
      {/* Course Details */}
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

      {/* Lessons List */}
      <Typography variant="h6" gutterBottom>
        Lessons
      </Typography>
      {lessons.length === 0 ? (
        <Typography color="text.secondary">No lessons yet.</Typography>
      ) : (
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
                          color="warning"
                          component={Link}
                          href={`/dashboard/courses/${course.id}/lessons/${lesson.id}/edit`}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          variant="text"
                          color="error"
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
                        <Typography variant="body1" fontWeight="medium" color="primary">
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
      )}
    </Box>
  );
}
