"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { getExamState } from "@/lib/exam-state";
import { Prisma, SubmissionStatus } from "@/app/generated/prisma/client";
import {
  saveAnswerSchema,
  SaveAnswerInput,
} from "@/lib/validations/submission";

export async function startExam(examId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { error: { message: "Unauthorized: Please log in." } };
    }

    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: {
        room: {
          include: { roomMembers: { where: { userId: session.user.id } } },
        },
        allowedExaminees: {
          where: { id: session.user.id },
          select: { id: true },
        },
      },
    });

    if (!exam) {
      return { error: { message: "Exam not found." } };
    }

    // Role check logic already implicitly exists, but now we enforce selective participation
    const membership = exam.room.roomMembers[0];
    if (membership && membership.role === "EXAMINEE") {
      if (exam.isRestricted && exam.allowedExaminees.length === 0) {
        return {
          error: {
            message:
              "Forbidden: You are not selected to participate in this restricted exam.",
          },
        };
      }
    }

    // Check if a submission already exists
    let submission = await prisma.examSubmission.findUnique({
      where: {
        examId_examineeId: {
          examId,
          examineeId: session.user.id,
        },
      },
    });

    if (submission) {
      if (submission.status !== "IN_PROGRESS") {
        return { error: { message: "Exam has already been submitted." } };
      }
      // If it exists and is in progress, allow resumption regardless of global state
      revalidatePath(`/rooms/${exam.roomId}/exams/${examId}`);
      return { submission };
    }

    const state = getExamState(exam);

    if (state !== "ACTIVE") {
      return {
        error: { message: `Cannot start exam. The current state is ${state}.` },
      };
    }

    submission = await prisma.examSubmission.create({
      data: {
        examId,
        examineeId: session.user.id,
        status: "IN_PROGRESS",
      },
    });

    revalidatePath(`/rooms/${exam.roomId}/exams/${examId}`);
    return { submission };
  } catch (error) {
    console.error("Error starting exam:", error);
    return { error: { message: "An unexpected error occurred." } };
  }
}

export async function saveAnswer(submissionId: string, data: SaveAnswerInput) {
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

    if (!submission || submission.examineeId !== session.user.id) {
      return { error: { message: "Submission not found or unauthorized." } };
    }

    if (submission.status !== "IN_PROGRESS") {
      return { error: { message: "Exam has already been submitted." } };
    }

    const now = new Date();
    const exam = submission.exam;

    // Check global end time
    if (exam.endTime && now > exam.endTime) {
      return { error: { message: "The exam window has already closed." } };
    }

    // Check duration limit (strict, no grace period)
    if (exam.timeLimitMinutes) {
      const expiresAt = new Date(
        submission.startedAt.getTime() + exam.timeLimitMinutes * 60000,
      );
      if (now > expiresAt) {
        return { error: { message: "Time limit has expired." } };
      }
    }

    const validatedData = saveAnswerSchema.safeParse(data);
    if (!validatedData.success) {
      return {
        error: {
          message: "Invalid answer data provided.",
          details: validatedData.error.flatten(),
        },
      };
    }

    const { questionId, textValue, optionValue, timeSpentSeconds, pasteCount, pastedTextLength, attachments } = validatedData.data;

    // Verify question exists in this exam
    const question = await prisma.question.findFirst({
      where: { id: questionId, examId: submission.examId },
    });

    if (!question) {
      return { error: { message: "Question not found for this exam." } };
    }

    // Upsert the answer
    const savedAnswer = await prisma.answer.upsert({
      where: {
        submissionId_questionId: {
          submissionId,
          questionId,
        },
      },
      update: {
        textValue: textValue !== undefined ? textValue : undefined,
        optionValue: optionValue !== undefined ? optionValue : undefined,
        ...(timeSpentSeconds !== undefined && { timeSpentSeconds }),
        ...(pasteCount !== undefined && { pasteCount }),
        ...(pastedTextLength !== undefined && { pastedTextLength }),
        ...(attachments !== undefined && { attachments: attachments ? (attachments as Prisma.InputJsonValue) : Prisma.JsonNull }),
      },
      create: {
        submissionId,
        questionId,
        textValue: textValue || null,
        optionValue: optionValue || null,
        timeSpentSeconds: timeSpentSeconds || 0,
        pasteCount: pasteCount || 0,
        pastedTextLength: pastedTextLength || 0,
        attachments: attachments ? (attachments as Prisma.InputJsonValue) : Prisma.JsonNull,
      },
    });

    return { answer: savedAnswer };
  } catch (error) {
    console.error("Error saving answer:", error);
    return { error: { message: "An unexpected error occurred." } };
  }
}

export async function submitExam(submissionId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { error: { message: "Unauthorized: Please log in." } };
    }

    const submission = await prisma.examSubmission.findUnique({
      where: { id: submissionId },
      include: {
        exam: { include: { questions: true } },
        answers: true,
      },
    });

    if (!submission || submission.examineeId !== session.user.id) {
      return { error: { message: "Submission not found or unauthorized." } };
    }

    if (submission.status !== "IN_PROGRESS") {
      return { error: { message: "Exam has already been submitted." } };
    }

    // Autograde Multiple Choice Questions
    let autoScore = 0;
    const questions = submission.exam.questions;

    // We will do bulk updates for isCorrect and score for MCQ
    for (const answer of submission.answers) {
      const question = questions.find((q) => q.id === answer.questionId);
      if (question && question.type === "MULTIPLE_CHOICE") {
        const isCorrect = answer.optionValue === question.correctOption;
        const score = isCorrect ? question.points : 0;
        autoScore += score;

        await prisma.answer.update({
          where: { id: answer.id },
          data: { isCorrect, score },
        });
      }
    }

    const hasDescriptiveToGrade = submission.answers.some((a) =>
      questions.some((q) => q.id === a.questionId && q.type === "DESCRIPTIVE"),
    );

    const updatedSubmission = await prisma.examSubmission.update({
      where: { id: submissionId },
      data: {
        status: hasDescriptiveToGrade ? "SUBMITTED" : "GRADED",
        submittedAt: new Date(),
        score: autoScore - (submission.penalty || 0), // Start with auto score, examiner can add points later
      },
    });

    revalidatePath(
      `/rooms/${submission.exam.roomId}/exams/${submission.examId}`,
    );
    return { submission: updatedSubmission };
  } catch (error) {
    console.error("Error submitting exam:", error);
    return { error: { message: "An unexpected error occurred." } };
  }
}

export async function deleteSubmission(submissionId: string) {
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
        error: {
          message:
            "Forbidden: Only examiners or owners can delete submissions.",
        },
      };
    }

    await prisma.examSubmission.delete({
      where: { id: submissionId },
    });

    revalidatePath(
      `/rooms/${submission.exam.roomId}/exams/${submission.examId}/submissions`,
    );
    revalidatePath(
      `/rooms/${submission.exam.roomId}/exams/${submission.examId}`,
    );
    return { success: true };
  } catch (error) {
    console.error("Error deleting submission:", error);
    if (error && typeof error === "object" && "code" in error && error.code === "P2003") {
      // Cascade might not be set. Fallback to deleting answers first just in case.
      // Or if it is set, it won't hit this.
      await prisma.answer.deleteMany({ where: { submissionId } });
      await prisma.examSubmission.delete({ where: { id: submissionId } });
      return { success: true };
    }
    return { error: { message: "An unexpected error occurred." } };
  }
}

export async function autoCollectExpiredSubmissions(examId: string) {
  try {
    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: { questions: true },
    });

    if (!exam) return { success: true, count: 0 };

    const now = new Date();
    const isGloballyExpired = exam.endTime && now > exam.endTime;

    // Determine the query criteria for "expired"
    const statusCriteria: SubmissionStatus = "IN_PROGRESS";
    let startedAtCriteria: Prisma.DateTimeFilter | undefined = undefined;

    if (isGloballyExpired) {
      // If globally expired, all IN_PROGRESS submissions are considered expired regardless of startedAt.
    } else if (exam.timeLimitMinutes) {
      // A submission is expired if it started before this strict threshold
      const expiredThreshold = new Date(
        now.getTime() - exam.timeLimitMinutes * 60000,
      );
      startedAtCriteria = { lte: expiredThreshold };
    } else {
      // If there's neither a global end time nor a time limit, submissions never auto-expire linearly.
      return { success: true, count: 0 };
    }

    const whereClause: Prisma.ExamSubmissionWhereInput = {
      examId,
      status: statusCriteria,
    };

    if (startedAtCriteria) {
      whereClause.startedAt = startedAtCriteria;
    }

    // Get all genuinely EXPIRED submissions for this exam using DB native filtering
    const submissions = await prisma.examSubmission.findMany({
      where: whereClause,
      include: {
        answers: true,
      },
    });

    if (submissions.length === 0) {
      return { success: true, count: 0 };
    }

    let collectedCount = 0;

    for (const submission of submissions) {
      // Autograde MCQ
      let autoScore = 0;
      for (const answer of submission.answers) {
        const question = exam.questions.find((q) => q.id === answer.questionId);
        if (question && question.type === "MULTIPLE_CHOICE") {
          const isCorrect = answer.optionValue === question.correctOption;
          const score = isCorrect ? question.points : 0;
          autoScore += score;

          await prisma.answer.update({
            where: { id: answer.id },
            data: { isCorrect, score },
          });
        }
      }

      const hasDescriptiveToGrade = submission.answers.some((a) =>
        exam.questions.some(
          (q) => q.id === a.questionId && q.type === "DESCRIPTIVE",
        ),
      );

      // Clamp the submission time to when it theoretically expired
      let theoreticalSubmitTime = now;
      if (exam.timeLimitMinutes) {
        const expiresAt = new Date(
          submission.startedAt.getTime() + exam.timeLimitMinutes * 60000,
        );
        if (expiresAt < theoreticalSubmitTime) {
          theoreticalSubmitTime = expiresAt;
        }
      }
      if (exam.endTime && exam.endTime < theoreticalSubmitTime) {
        theoreticalSubmitTime = exam.endTime;
      }

      await prisma.examSubmission.update({
        where: { id: submission.id },
        data: {
          status: hasDescriptiveToGrade ? "SUBMITTED" : "GRADED",
          submittedAt: theoreticalSubmitTime,
          score: autoScore - (submission.penalty || 0),
        },
      });
      collectedCount++;
    }

    return { success: true, count: collectedCount };
  } catch (error) {
    console.error("Error auto collecting submissions:", error);
    return { error: { message: "Failed to collect submissions." } };
  }
}

export async function reportTabSwitch(submissionId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { error: { message: "Unauthorized." } };
    }

    const submission = await prisma.examSubmission.findUnique({
      where: { id: submissionId },
    });

    if (!submission || submission.examineeId !== session.user.id) {
      return { error: { message: "Submission not found." } };
    }

    if (submission.status !== "IN_PROGRESS") {
      return { error: { message: "Exam already submitted." } };
    }

    await prisma.examSubmission.update({
      where: { id: submissionId },
      data: { tabSwitchCount: { increment: 1 } },
    });

    return { success: true };
  } catch (error) {
    console.error("Error reporting tab switch:", error);
    return { error: { message: "Failed to report tab switch." } };
  }
}

export async function bulkDeleteSubmissions(submissionIds: string[]) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { error: { message: "Unauthorized: Please log in." } };
    }

    if (!submissionIds || submissionIds.length === 0) {
      return { error: { message: "No submissions selected." } };
    }

    // Verify user is an examiner or owner for the first submission's room
    const firstSubmission = await prisma.examSubmission.findUnique({
      where: { id: submissionIds[0] },
      include: { exam: { include: { room: true } } },
    });

    if (!firstSubmission) {
      return { error: { message: "Submission not found." } };
    }

    const membership = await prisma.roomMember.findUnique({
      where: {
        roomId_userId: {
          roomId: firstSubmission.exam.roomId,
          userId: session.user.id,
        },
      },
    });

    if (
      firstSubmission.exam.room.ownerId !== session.user.id &&
      (!membership || membership.role !== "EXAMINER")
    ) {
      return {
        error: {
          message: "Forbidden: Only examiners or owners can delete submissions.",
        },
      };
    }

    await prisma.answer.deleteMany({
      where: { submissionId: { in: submissionIds } },
    });
    
    await prisma.examSubmission.deleteMany({
      where: { id: { in: submissionIds } },
    });

    revalidatePath(`/rooms/${firstSubmission.exam.roomId}/exams/${firstSubmission.examId}/submissions`);
    revalidatePath(`/rooms/${firstSubmission.exam.roomId}/exams/${firstSubmission.examId}`);
    return { success: true };
  } catch (error) {
    console.error("Error bulk deleting submissions:", error);
    return { error: { message: "An unexpected error occurred." } };
  }
}

export async function bulkPublishSubmissions(submissionIds: string[], publish: boolean) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { error: { message: "Unauthorized: Please log in." } };
    }

    if (!submissionIds || submissionIds.length === 0) {
      return { error: { message: "No submissions selected." } };
    }

    // Verify user is an examiner or owner
    const firstSubmission = await prisma.examSubmission.findUnique({
      where: { id: submissionIds[0] },
      include: { exam: { include: { room: true } } },
    });

    if (!firstSubmission) {
      return { error: { message: "Submission not found." } };
    }

    const membership = await prisma.roomMember.findUnique({
      where: {
        roomId_userId: {
          roomId: firstSubmission.exam.roomId,
          userId: session.user.id,
        },
      },
    });

    if (
      firstSubmission.exam.room.ownerId !== session.user.id &&
      (!membership || membership.role !== "EXAMINER")
    ) {
      return {
        error: {
          message: "Forbidden: Only examiners or owners can publish results.",
        },
      };
    }

    await prisma.examSubmission.updateMany({
      where: { id: { in: submissionIds } },
      data: { isResultPublished: publish },
    });

    revalidatePath(`/rooms/${firstSubmission.exam.roomId}/exams/${firstSubmission.examId}/submissions`);
    return { success: true };
  } catch (error) {
    console.error("Error bulk publishing submissions:", error);
    return { error: { message: "An unexpected error occurred." } };
  }
}
