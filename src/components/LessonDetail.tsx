'use client'

import Link from 'next/link'
import { Lesson } from '@/models/lesson'

export default function LessonDetail({
  lesson,
  isAdmin,
}: {
  lesson: Lesson
  isAdmin: boolean
}) {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{lesson.title}</h1>
        {isAdmin && (
          <Link
            href={`/dashboard/courses/${lesson.courseId}/lessons/${lesson.id}/edit`}
            className="text-yellow-500 hover:text-yellow-700"
          >
            Edit Lesson
          </Link>
        )}
      </div>
      <div className="prose max-w-none">
        <p className="whitespace-pre-line">{lesson.content}</p>
      </div>
    </div>
  )
}