'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Lesson, LessonFormValues } from '@/models/lesson'

export function useLessons(courseId: string) {
  const queryClient = useQueryClient()

  const lessonsQuery = useQuery({
    queryKey: ['lessons', courseId],
    queryFn: async () => {
      const q = query(collection(db, 'lessons'), where('courseId', '==', courseId))
      const snapshot = await getDocs(q)
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Lesson))
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

  return {
    lessons: lessonsQuery.data || [],
    isLoading: lessonsQuery.isLoading,
    error: lessonsQuery.error,
    createLesson,
    updateLesson,
    deleteLesson,
  }
}