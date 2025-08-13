export interface Lesson {
  id: string
  courseId: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
}

export interface LessonFormValues {
  title: string
  content: string
}