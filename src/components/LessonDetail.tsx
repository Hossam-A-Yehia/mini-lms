"use client";

import Link from "next/link";
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

export default function LessonDetail({
  lesson,
  isAdmin,
}: {
  lesson: Lesson;
  isAdmin: boolean;
}) {
    const { deleteLesson } = useLessons(lesson.courseId);
  
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
                color="warning"
                startIcon={<DeleteIcon />}
                onClick={() => deleteLesson.mutate(lesson.id)}
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
