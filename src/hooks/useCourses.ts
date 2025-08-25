"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Course, CourseFormValues } from "@/models/course";

export function useCourses(pageSize: number = 6) {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
  const [allCourses, setAllCourses] = useState<Course[]>([]);

  const coursesQuery = useQuery({
    queryKey: ["courses", currentPage],
    queryFn: async () => {
      let q = query(
        collection(db, "courses"),
        orderBy("createdAt", "desc"),
        limit(pageSize)
      );

      if (currentPage > 1 && lastDoc) {
        q = query(
          collection(db, "courses"),
          orderBy("createdAt", "desc"),
          startAfter(lastDoc),
          limit(pageSize)
        );
      }

      const snapshot = await getDocs(q);
      const courses = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Course)
      );

      if (snapshot.docs.length > 0) {
        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      }

      if (currentPage === 1) {
        setAllCourses(courses);
      } else {
        setAllCourses(prev => [...prev, ...courses]);
      }

      return courses;
    },
  });

  const totalCountQuery = useQuery({
    queryKey: ["courses-count"],
    queryFn: async () => {
      const snapshot = await getDocs(collection(db, "courses"));
      return snapshot.size;
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

  const nextPage = () => {
    if (coursesQuery.data && coursesQuery.data.length === pageSize) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      setLastDoc(null);
    }
  };

  const resetPagination = () => {
    setCurrentPage(1);
    setLastDoc(null);
    setAllCourses([]);
  };

  return {
    courses: coursesQuery.data || [],
    allCourses: currentPage === 1 ? coursesQuery.data || [] : allCourses,
    isLoading: coursesQuery.isLoading,
    error: coursesQuery.error,
    currentPage,
    totalCount: totalCountQuery.data || 0,
    hasNextPage: (coursesQuery.data?.length || 0) === pageSize,
    hasPrevPage: currentPage > 1,
    nextPage,
    prevPage,
    resetPagination,
    createCourse: {
      ...createCourse,
      mutate: (data: CourseFormValues, options?: any) => {
        createCourse.mutate(data, {
          ...options,
          onSuccess: (...args: any[]) => {
            resetPagination();
            queryClient.invalidateQueries({ queryKey: ["courses"] });
            queryClient.invalidateQueries({ queryKey: ["courses-count"] });
            options?.onSuccess?.(...args);
          },
        });
      },
    },
    updateCourse: {
      ...updateCourse,
      mutate: (data: CourseFormValues & { id: string }, options?: any) => {
        updateCourse.mutate(data, {
          ...options,
          onSuccess: (...args: any[]) => {
            queryClient.invalidateQueries({ queryKey: ["courses"] });
            options?.onSuccess?.(...args);
          },
        });
      },
    },
    deleteCourse: {
      ...deleteCourse,
      mutate: (id: string, options?: any) => {
        deleteCourse.mutate(id, {
          ...options,
          onSuccess: (...args: any[]) => {
            resetPagination();
            queryClient.invalidateQueries({ queryKey: ["courses"] });
            queryClient.invalidateQueries({ queryKey: ["courses-count"] });
            options?.onSuccess?.(...args);
          },
        });
      },
    },
  };
}
