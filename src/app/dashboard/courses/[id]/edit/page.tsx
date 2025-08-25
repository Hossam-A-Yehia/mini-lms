import EditCourseForm from "@/components/EditCourseForm";

export default function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <EditCourseForm params={params} />;
}
