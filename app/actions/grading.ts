"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { Prisma } from "@/app/generated/prisma/client";
import {
  gradeAnswerSchema,
  GradeAnswerInput,
  applyPenaltySchema,
  ApplyPenaltyInput,
  saveOverallFeedbackSchema,
  SaveOverallFeedbackInput,
} from "@/lib/validations/submission";

export async function gradeAnswer(
  submissionId: string,
  data: GradeAnswerInput,
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { error: { message: "Unauthorized: Please log in." } };
    }

    const submission = await prisma.examSubmission.findUnique({
      where: { id: submissionId },
      include: { exam: { include: { room: true } } },
    });

    if (!submission) {
      return { error: { message: "Submission not found." } };
    }

    // Verify user is an examiner or owner
    const membership = await prisma.roomMember.findUnique({
      where: {
        roomId_userId: {
          roomId: submission.exam.roomId,
          userId: session.user.id,
        },
      },
    });

    if (
      submission.exam.room.ownerId !== session.user.id &&
      (!membership || membership.role !== "EXAMINER")
    ) {
      return {
        error: { message: "Forbidden: Only examiners can grade submissions." },
      };
    }

    const validatedData = gradeAnswerSchema.safeParse(data);
    if (!validatedData.success) {
      return {
        error: {
          message: "Invalid grading data provided.",
          details: validatedData.error.flatten(),
        },
      };
    }

    const { answerId, score, feedback } = validatedData.data;

    // Verify the answer belongs to this submission
    const answer = await prisma.answer.findUnique({
      where: { id: answerId },
      include: { question: true },
    });

    if (!answer || answer.submissionId !== submissionId) {
      return { error: { message: "Answer not found for this submission." } };
    }

    if (score > answer.question.points) {
      return {
        error: {
          message: `Score cannot exceed maximum points (${answer.question.points}) for this question.`,
        },
      };
    }

    // Fix #4: Clear AI feedback if manual score differs from AI score
    const aiScoreMismatch = answer.aiScore !== null && score !== answer.aiScore;
    const aiScoreUpdate = aiScoreMismatch ? null : answer.aiScore;
    const aiRubricUpdate = aiScoreMismatch 
      ? Prisma.JsonNull 
      : (answer.aiRubricResult as Prisma.InputJsonValue);

    const updatedAnswer = await prisma.answer.update({
      where: { id: answerId },
      data: { 
        score, 
        feedback,
        aiScore: aiScoreUpdate,
        aiRubricResult: aiRubricUpdate,
      },
    });

    // Dynamically recalculate the total submission score and check grading completion
    const submissionObj = await prisma.examSubmission.findUniqueOrThrow({
      where: { id: submissionId },
      include: {
        answers: true,
        exam: {
          include: {
            questions: true,
          },
        },
      },
    });

    let totalScore = submissionObj.answers.reduce(
      (total, a) => total + (a.score || 0),
      0,
    );

    totalScore = totalScore - (submissionObj.penalty || 0);

    const descriptiveQuestions = submissionObj.exam.questions.filter(
      (q) => q.type === "DESCRIPTIVE",
    );

    const hasUngradedDescriptive = submissionObj.answers.some(
      (a) =>
        descriptiveQuestions.some((q) => q.id === a.questionId) &&
        a.score === null,
    );

    const newStatus = hasUngradedDescriptive ? "SUBMITTED" : "GRADED";

    await prisma.examSubmission.update({
      where: { id: submissionId },
      data: {
        score: totalScore,
        status: newStatus,
      },
    });

    revalidatePath(
      `/rooms/${submission.exam.roomId}/exams/${submission.examId}/submissions`,
    );
    revalidatePath(
      `/rooms/${submission.exam.roomId}/exams/${submission.examId}/submissions/${submissionId}`,
    );

    return { answer: updatedAnswer };
  } catch (error) {
    console.error("Error grading answer:", error);
    return { error: { message: "An unexpected error occurred." } };
  }
}

export async function applyPenalty(
  submissionId: string,
  data: ApplyPenaltyInput,
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { error: { message: "Unauthorized: Please log in." } };
    }

    const { penalty, penaltyReason } = applyPenaltySchema.parse(data);

    const submission = await prisma.examSubmission.findUnique({
      where: { id: submissionId },
      include: {
        answers: true,
        exam: { include: { room: true } },
      },
    });

    if (!submission) {
      return { error: { message: "Submission not found." } };
    }

    const membership = await prisma.roomMember.findUnique({
      where: {
        roomId_userId: {
          roomId: submission.exam.roomId,
          userId: session.user.id,
        },
      },
    });

    if (
      submission.exam.room.ownerId !== session.user.id &&
      (!membership || membership.role !== "EXAMINER")
    ) {
      return {
        error: { message: "Forbidden: Only examiners can apply penalties." },
      };
    }

    const rawScore = submission.answers.reduce(
      (total, a) => total + (a.score || 0),
      0,
    );
    const newScore = rawScore - penalty;

    await prisma.examSubmission.update({
      where: { id: submissionId },
      data: {
        penalty,
        penaltyReason,
        score: newScore,
      },
    });

    revalidatePath(
      `/rooms/${submission.exam.roomId}/exams/${submission.examId}/submissions`,
    );
    revalidatePath(
      `/rooms/${submission.exam.roomId}/exams/${submission.examId}/submissions`,
    );

    return { success: true };
  } catch (error) {
    console.error("Error applying penalty:", error);
    return { error: { message: "An unexpected error occurred." } };
  }
}

export async function saveOverallFeedback(
  submissionId: string,
  data: SaveOverallFeedbackInput,
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { error: { message: "Unauthorized: Please log in." } };
    }

    const { overallFeedback } = saveOverallFeedbackSchema.parse(data);

    const submission = await prisma.examSubmission.findUnique({
      where: { id: submissionId },
      include: {
        exam: { include: { room: true } },
      },
    });

    if (!submission) {
      return { error: { message: "Submission not found." } };
    }

    const membership = await prisma.roomMember.findUnique({
      where: {
        roomId_userId: {
          roomId: submission.exam.roomId,
          userId: session.user.id,
        },
      },
    });

    if (
      submission.exam.room.ownerId !== session.user.id &&
      (!membership || membership.role !== "EXAMINER")
    ) {
      return {
        error: { message: "Forbidden: Only examiners can leave overall feedback." },
      };
    }

    await prisma.examSubmission.update({
      where: { id: submissionId },
      data: {
        overallFeedback,
      },
    });

    revalidatePath(
      `/rooms/${submission.exam.roomId}/exams/${submission.examId}/submissions`,
    );
    revalidatePath(
      `/rooms/${submission.exam.roomId}/exams/${submission.examId}/submissions/${submissionId}`,
    );

    return { success: true };
  } catch (error) {
    console.error("Error saving overall feedback:", error);
    return { error: { message: "An unexpected error occurred." } };
  }
}

export async function togglePublishSubmission(
  submissionId: string,
  isResultPublished: boolean,
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { error: { message: "Unauthorized: Please log in." } };
    }

    const submission = await prisma.examSubmission.findUnique({
      where: { id: submissionId },
      include: { exam: { include: { room: true } } },
    });

    if (!submission) {
      return { error: { message: "Submission not found." } };
    }

    // Verify user is an examiner or owner
    const membership = await prisma.roomMember.findUnique({
      where: {
        roomId_userId: {
          roomId: submission.exam.roomId,
          userId: session.user.id,
        },
      },
    });

    if (
      submission.exam.room.ownerId !== session.user.id &&
      (!membership || membership.role !== "EXAMINER")
    ) {
      return {
        error: { message: "Forbidden: Only examiners can publish results." },
      };
    }

    await prisma.examSubmission.update({
      where: { id: submissionId },
      data: { isResultPublished },
    });

    revalidatePath(
      `/rooms/${submission.exam.roomId}/exams/${submission.examId}/submissions`,
    );

    return { success: true };
  } catch (error) {
    console.error("Error toggling publication status:", error);
    return { error: { message: "An unexpected error occurred." } };
  }
}

