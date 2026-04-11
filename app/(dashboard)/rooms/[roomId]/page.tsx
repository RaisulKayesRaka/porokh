import { redirect } from "next/navigation";

export default async function RoomDashboardPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;
  redirect(`/rooms/${roomId}/exams`);
}
