"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";

type GuardType = "protected" | "public";

export default function AuthGuard({
  children,
  role,
  type = "protected",
}: {
  children: React.ReactNode;
  role?: "admin" | "user";
  type?: GuardType;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (type === "protected" && !user) {
        router.push("/login");
      }
      if (type === "public" && user) {
        router.push("/dashboard");
      }
    }
  }, [user, loading, router, type]);

  if (loading) return null;

  if (type === "protected" && (!user || (role && user.role !== role))) {
    return null;
  }

  return <>{children}</>;
}
