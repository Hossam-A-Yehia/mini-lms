import { notFound } from 'next/navigation'
import { useLessons } from '@/hooks/useLessons'
import { useAuth } from '@/lib/auth'
import LessonDetail from '@/components/LessonDetail';

export default function LessonPage({
  params,
}: {
  params: { id: string; lessonId: string }
}) {
  const { lessons, isLoading } = useLessons(params.id)
  const { user } = useAuth()

  if (isLoading) return <div>Loading...</div>

  const lesson = lessons.find((l) => l.id === params.lessonId)
  if (!lesson) return notFound()

  return <LessonDetail lesson={lesson} isAdmin={user?.role === 'admin'} />
}