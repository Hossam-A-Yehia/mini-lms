"use client";

import Link from "next/link";
import { Course } from "@/models/course";
import { Lesson } from "@/models/lesson";

export default function CourseDetail({
  course,
  lessons,
  isAdmin,
}: {
  course: Course;
  lessons: Lesson[];
  isAdmin: boolean;
}) {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
        <p className="text-gray-600">{course.description}</p>
        {isAdmin && (
          <div className="mt-4 space-x-4">
            <Link
              href={`/dashboard/courses/${course.id}/edit`}
              className="text-yellow-500 hover:text-yellow-700"
            >
              Edit Course
            </Link>
            <Link
              href={`/dashboard/courses/${course.id}/lessons/new`}
              className="text-green-500 hover:text-green-700"
            >
              Add Lesson
            </Link>
          </div>
        )}
      </div>

      <h2 className="text-xl font-semibold mb-4">Lessons</h2>
      {lessons.length === 0 ? (
        <p>No lessons yet.</p>
      ) : (
        <ul className="space-y-4">
          {lessons.map((lesson) => (
            <li key={lesson.id} className="border-b pb-4">
              <Link
                href={`/dashboard/courses/${course.id}/lessons/${lesson.id}`}
                className="text-blue-500 hover:text-blue-700"
              >
                <h3 className="text-lg font-medium">{lesson.title}</h3>
              </Link>
              {isAdmin && (
                <div className="mt-2 space-x-2">
                  <Link
                    href={`/dashboard/courses/${course.id}/lessons/${lesson.id}/edit`}
                    className="text-sm text-yellow-500 hover:text-yellow-700"
                  >
                    Edit
                  </Link>
                  <button className="text-sm text-red-500 hover:text-red-700">
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
