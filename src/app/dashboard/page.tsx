import Link from 'next/link'
import { useCourses } from '@/hooks/useCourses'
import { useAuth } from '@/lib/auth'

export default function DashboardPage() {
  const { courses, isLoading, deleteCourse } = useCourses()
  const { user } = useAuth()

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="border rounded-lg p-4 shadow-sm">
            <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
            <p className="text-gray-600 mb-4">{course.description}</p>
            <div className="flex justify-between">
              <Link
                href={`/dashboard/courses/${course.id}`}
                className="text-blue-500 hover:text-blue-700"
              >
                View Details
              </Link>
              {user?.role === 'admin' && (
                <div className="space-x-2">
                  <Link
                    href={`/dashboard/courses/${course.id}/edit`}
                    className="text-yellow-500 hover:text-yellow-700"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteCourse.mutate(course.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}