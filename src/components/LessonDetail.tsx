"use client";

import { Lesson } from "@/models/lesson";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useLessons } from "@/hooks/useLessons";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LessonDetail({
  lesson,
  isAdmin,
}: {
  lesson: Lesson;
  isAdmin: boolean;
}) {
  const router = useRouter();
  const { deleteLesson } = useLessons(lesson.courseId);

  const handleDelete = () => {
    deleteLesson.mutate(lesson.id, {
      onSuccess: () => {
        router.push(`/dashboard/courses/${lesson.courseId}`);
        toast.success('Lesson deleted successfully');
      },
    });
  };

  return (
    <Box maxWidth="800px" mx="auto" mt={10}>
      <Card sx={{ mb: 4 }}>
        <CardHeader
          title={
            <Typography variant="h5" fontWeight="bold">
              {lesson.title}
            </Typography>
          }
          action={
            isAdmin && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
              >
                Delete Lesson
              </Button>
            )
          }
        />
        <Divider />
        <CardContent>
          <Typography
            variant="body1"
            sx={{
              whiteSpace: "pre-line",
              lineHeight: 1.7,
            }}
          >
            {lesson.content}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
