import { notFound } from 'next/navigation'
import { useCourses } from '@/hooks/useCourses'
import { useAuth } from '@/lib/auth'
import { useLessons } from '@/hooks/useLessons'
import CourseDetail from '@/components/CourseDetail'

export default function CoursePage({ params }: { params: { id: string } }) {
  const { courses, isLoading: isCoursesLoading } = useCourses()
  const { lessons, isLoading: isLessonsLoading } = useLessons(params.id)
  const { user } = useAuth()

  if (isCoursesLoading || isLessonsLoading) return <div>Loading...</div>

  const course = courses.find((c) => c.id === params.id)
  if (!course) return notFound()

  return <CourseDetail course={course} lessons={lessons} isAdmin={user?.role === 'admin'} />
}