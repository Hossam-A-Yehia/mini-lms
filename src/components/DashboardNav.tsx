'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth'

export default function DashboardNav() {
  const { user, logout } = useAuth()

  return (
    <nav className="w-64 bg-gray-800 text-white p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold">Mini LMS</h1>
        {user && (
          <div className="mt-2 text-sm">
            <p>{user.email}</p>
            <p className="text-gray-400 capitalize">{user.role}</p>
          </div>
        )}
      </div>
      <ul className="space-y-2">
        <li>
          <Link href="/dashboard" className="block p-2 hover:bg-gray-700 rounded">
            Courses
          </Link>
        </li>
        {user?.role === 'admin' && (
          <li>
            <Link href="/dashboard/courses/new" className="block p-2 hover:bg-gray-700 rounded">
              Create Course
            </Link>
          </li>
        )}
        <li>
          <button onClick={logout} className="w-full text-left p-2 hover:bg-gray-700 rounded">
            Logout
          </button>
        </li>
      </ul>
    </nav>
  )
}