import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { TakeExamClient } from "@/components/exam/take-exam";
import { Question } from "@/app/generated/prisma/client";

export default async function ExamAttemptPage({
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

  // Fetch the active submission for this examinee
  const submission = await prisma.examSubmission.findUnique({
    where: {
      examId_examineeId: {
        examId,
        examineeId: session.user.id,
      },
    },
    include: {
        exam: {
           include: { questions: { orderBy: { order: "asc" } } }
        },
        answers: true,
    }
  });

  if (!submission) {
     // User hasn't started the exam formally yet, or invalid params. Redirect them to overview.
     redirect(`/rooms/${roomId}/exams/${examId}`);
  }

  if (submission.status !== "IN_PROGRESS") {
     // Already submitted or graded.
     redirect(`/rooms/${roomId}/exams/${examId}`);
  }

  // Pass down the serialized answers to the client safely
  const initialAnswers = JSON.stringify(submission.answers);

  // CRITICAL SECURITY FIX:
  // Strip out correctOption and rubric from the questions before sending them to the client
  const sanitizedQuestions = submission.exam.questions.map((q) => {
    // We explicitly exclude the sensitive fields and pass the rest
    const safeQuestionData = { ...q };
    // @ts-expect-error - we are explicitly removing these for security
    delete safeQuestionData.correctOption;
    // @ts-expect-error - we are explicitly removing these for security
    delete safeQuestionData.rubric;
    return safeQuestionData;
  });

  return (
    <div className="py-6 min-h-[calc(100vh-4rem)]">
         <TakeExamClient 
            roomId={roomId}
            examId={examId}
            submissionId={submission.id}
            exam={{ 
               title: submission.exam.title, 
               timeLimitMinutes: submission.exam.timeLimitMinutes,
               endTime: submission.exam.endTime
            }}
            questions={sanitizedQuestions as unknown as Question[]} 
            initialAnswers={initialAnswers}
            startedAt={submission.startedAt}
         />
    </div>
  );
}
