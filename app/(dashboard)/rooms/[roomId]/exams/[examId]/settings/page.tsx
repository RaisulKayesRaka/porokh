import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EditExamSettingsForm } from "@/components/exam/edit-exam-settings-form";

export default async function EditExamSettingsPage({
  params,
}: {
  params: Promise<{ roomId: string; examId: string }>;
}) {
  const { roomId, examId } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const membership = await prisma.roomMember.findUnique({
    where: {
      roomId_userId: {
        roomId,
        userId: session.user.id,
      },
    },
  });

  if (!membership || membership.role !== "EXAMINER") {
    redirect(`/rooms/${roomId}/exams`);
  }

  const examineesRaw = await prisma.roomMember.findMany({
    where: {
      roomId,
      role: "EXAMINEE",
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  const examinees = examineesRaw.map((member) => member.user);

  const exam = await prisma.exam.findUnique({
    where: { id: examId, roomId },
    include: {
      allowedExaminees: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!exam) {
    redirect(`/rooms/${roomId}/exams`);
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-12">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/rooms/${roomId}/exams/${examId}`}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Exam Settings</h2>
          <p className="text-muted-foreground">
            Configure time limits, scheduling, and access control for{" "}
            {exam.title}.
          </p>
        </div>
      </div>

      <div className="bg-card text-card-foreground rounded-xl border p-6 shadow">
        <EditExamSettingsForm exam={exam} examinees={examinees} />
      </div>
    </div>
  );
}
