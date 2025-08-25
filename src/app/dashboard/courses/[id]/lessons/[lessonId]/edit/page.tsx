import EditLessonForm from "@/components/EditLessonForm";

export default function EditLessonPage({
  params,
}: {
  params: Promise<{ id: string; lessonId: string }>;
}) {
  return <EditLessonForm params={params} />;
}
