"use client"
import CourseDetail from '@/components/CourseDetail'

export default function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  return <CourseDetail params={params} />
}
