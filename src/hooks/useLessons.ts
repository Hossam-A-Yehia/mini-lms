'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  limit
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Lesson, LessonFormValues } from '@/models/lesson'

export function useLessons(courseId: string, pageSize: number = 5) {
  const queryClient = useQueryClient()
  const [currentPage, setCurrentPage] = useState(1)
  const [allLessons, setAllLessons] = useState<Lesson[]>([])

  const lessonsQuery = useQuery({
    queryKey: ['lessons', courseId, currentPage],
    queryFn: async () => {
      let q = query(
        collection(db, 'lessons'),
        where('courseId', '==', courseId),
        limit(pageSize)
      )
      if (currentPage > 1) {
        const skipCount = (currentPage - 1) * pageSize
        const allLessonsQuery = query(
          collection(db, 'lessons'),
          where('courseId', '==', courseId)
        )
        const allSnapshot = await getDocs(allLessonsQuery)
        const allLessons = allSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Lesson))
        
        allLessons.sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          }
          return b.id.localeCompare(a.id)
        })
        
        return allLessons.slice(skipCount, skipCount + pageSize)
      }

      const snapshot = await getDocs(q)
      const lessons = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Lesson))

      lessons.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        }
        return b.id.localeCompare(a.id)
      })


      if (currentPage === 1) {
        setAllLessons(lessons)
      } else {
        setAllLessons(prev => [...prev, ...lessons])
      }

      return lessons
    },
    enabled: !!courseId,
  })

  const totalCountQuery = useQuery({
    queryKey: ['lessons-count', courseId],
    queryFn: async () => {
      const q = query(collection(db, 'lessons'), where('courseId', '==', courseId))
      const snapshot = await getDocs(q)
      return snapshot.size
    },
    enabled: !!courseId,
  })

  const createLesson = useMutation({
    mutationFn: async ({ courseId, ...data }: LessonFormValues & { courseId: string }) => {
      const newLesson = {
        ...data,
        courseId,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      const docRef = await addDoc(collection(db, 'lessons'), newLesson)
      return { id: docRef.id, ...newLesson }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
  })

  const updateLesson = useMutation({
    mutationFn: async ({ id, ...data }: LessonFormValues & { id: string }) => {
      await updateDoc(doc(db, 'lessons', id), {
        ...data,
        updatedAt: new Date(),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
  })

  const deleteLesson = useMutation({
    mutationFn: async (id: string) => {
      await deleteDoc(doc(db, 'lessons', id))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
  })

  const nextPage = () => {
    if (lessonsQuery.data && lessonsQuery.data.length === pageSize) {
      setCurrentPage(prev => prev + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1)
    }
  }

  const resetPagination = () => {
    setCurrentPage(1)
    setAllLessons([])
  }

  return {
    lessons: lessonsQuery.data || [],
    allLessons: currentPage === 1 ? lessonsQuery.data || [] : allLessons,
    isLoading: lessonsQuery.isLoading,
    error: lessonsQuery.error,
    currentPage,
    totalCount: totalCountQuery.data || 0,
    hasNextPage: (lessonsQuery.data?.length || 0) === pageSize,
    hasPrevPage: currentPage > 1,
    nextPage,
    prevPage,
    resetPagination,
    createLesson: {
      ...createLesson,
      mutate: (data: LessonFormValues & { courseId: string }, options?: any) => {
        createLesson.mutate(data, {
          ...options,
          onSuccess: (...args: any[]) => {
            resetPagination()
            queryClient.invalidateQueries({ queryKey: ["lessons"] })
            queryClient.invalidateQueries({ queryKey: ["lessons-count"] })
            options?.onSuccess?.(...args)
          },
        })
      },
    },
    updateLesson: {
      ...updateLesson,
      mutate: (data: LessonFormValues & { id: string }, options?: any) => {
        updateLesson.mutate(data, {
          ...options,
          onSuccess: (...args: any[]) => {
            queryClient.invalidateQueries({ queryKey: ["lessons"] })
            options?.onSuccess?.(...args)
          },
        })
      },
    },
    deleteLesson: {
      ...deleteLesson,
      mutate: (id: string, options?: any) => {
        deleteLesson.mutate(id, {
          ...options,
          onSuccess: (...args: any[]) => {
            resetPagination()
            queryClient.invalidateQueries({ queryKey: ["lessons"] })
            queryClient.invalidateQueries({ queryKey: ["lessons-count"] })
            options?.onSuccess?.(...args)
          },
        })
      },
    },
  }
}