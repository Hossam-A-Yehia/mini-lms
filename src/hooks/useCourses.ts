"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Course, CourseFormValues } from "@/models/course";

export function useCourses() {
  const queryClient = useQueryClient();

  const coursesQuery = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const snapshot = await getDocs(collection(db, "courses"));
      return snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Course)
      );
    },
  });

  const createCourse = useMutation({
    mutationFn: async (data: CourseFormValues) => {
      const newCourse = {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const docRef = await addDoc(collection(db, "courses"), newCourse);
      return { id: docRef.id, ...newCourse };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });

  const updateCourse = useMutation({
    mutationFn: async ({ id, ...data }: CourseFormValues & { id: string }) => {
      await updateDoc(doc(db, "courses", id), {
        ...data,
        updatedAt: new Date(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });

  const deleteCourse = useMutation({
    mutationFn: async (id: string) => {
      await deleteDoc(doc(db, "courses", id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });

  return {
    courses: coursesQuery.data || [],
    isLoading: coursesQuery.isLoading,
    error: coursesQuery.error,
    createCourse,
    updateCourse,
    deleteCourse,
  };
}
