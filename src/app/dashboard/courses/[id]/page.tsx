"use client"
import CourseDetail from '@/components/CourseDetail'

export default function CoursePage({ params }: { params: { id: string } }) {
  return <CourseDetail params={params} />
}
