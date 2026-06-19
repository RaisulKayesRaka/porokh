import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CreateExamForm } from "@/components/exam/create-exam-form";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function NewExamPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;

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
    include: {
      room: true,
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

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/rooms/${roomId}/exams`}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Create New Exam</h2>
          <p className="text-muted-foreground">
            Start by setting the title and basic rules. You can add questions
            next.
          </p>
        </div>
      </div>

      <div className="bg-card text-card-foreground rounded-xl border ">
        <div className="p-6">
          <CreateExamForm roomId={roomId} examinees={examinees} />
        </div>
      </div>
    </div>
  );
}
