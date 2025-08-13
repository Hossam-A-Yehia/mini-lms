"use client";

import { useAuth } from "@/lib/auth";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  IconButton,
  Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRouter } from "next/navigation";
import { useCourses } from "@/hooks/useCourses";
import toast from "react-hot-toast";

export default function Dashboard() {
  const router = useRouter();

  const { courses, isLoading, deleteCourse } = useCourses();
  const { user } = useAuth();

  const handleDelete = (id: string) => {
    deleteCourse.mutate(id, {
      onSuccess: () => {
        toast.success("Course deleted successfully");
      },
    });
  };

  if (isLoading)
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );

  return (
    <Container maxWidth="lg" sx={{ mt: 8 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Courses
      </Typography>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card
            key={course.id}
            elevation={4}
            sx={{
              borderRadius: 3,
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardHeader
              title={
                <Typography variant="h6" fontWeight="bold">
                  {course.title}
                </Typography>
              }
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {course.description}
              </Typography>
            </CardContent>
            <CardActions
              sx={{
                display: "flex",
                justifyContent: "space-between",
                px: 2,
                pb: 2,
              }}
            >
              <Button
                size="small"
                startIcon={<VisibilityIcon />}
                onClick={() => router.push(`/dashboard/courses/${course.id}`)}
              >
                View
              </Button>
              {user?.role === "admin" && (
                <Box>
                  <IconButton
                    disabled
                    color="primary"
                    onClick={() =>
                      router.push(`/dashboard/courses/${course.id}/edit`)
                    }
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(course.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              )}
            </CardActions>
          </Card>
        ))}
      </div>
    </Container>
  );
}
