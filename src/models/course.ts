export interface Course {
  id: string
  title: string
  description: string
  createdAt: Date
  updatedAt: Date
}

export interface CourseFormValues {
  title: string
  description: string
}