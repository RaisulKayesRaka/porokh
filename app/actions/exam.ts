"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { getExamState } from "@/lib/exam-state";
import { examSchema, ExamInput } from "@/lib/validations/exam";

export async function createExam(roomId: string, data: ExamInput) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { error: { message: "Unauthorized: Please log in." } };
    }

    // Check if the user is an owner or examiner in the room
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
      // Allow owners too, their membership role might be examiner but let's double check ownerId
      const room = await prisma.room.findUnique({ where: { id: roomId } });
      if (
        room?.ownerId !== session.user.id &&
        (!membership || membership.role !== "EXAMINER")
      ) {
        return {
          error: {
            message:
              "Forbidden: You must be an examiner or owner to create an exam.",
          },
        };
      }
    }

    // Validate data
    const validatedData = examSchema.safeParse(data);
    if (!validatedData.success) {
      return {
        error: {
          message: "Invalid exam data provided.",
          details: validatedData.error.flatten(),
        },
      };
    }

    const {
      title,
      description,
      startTime,
      endTime,
      timeLimitMinutes,
      isRestricted,
      allowedExamineeIds,
    } = validatedData.data;

    const newExam = await prisma.exam.create({
      data: {
        roomId,
        title,
        description,
        startTime,
        endTime,
        timeLimitMinutes,
        isRestricted,
        ...(isRestricted && allowedExamineeIds && allowedExamineeIds.length > 0
          ? {
              allowedExaminees: {
                connect: allowedExamineeIds.map((id) => ({ id })),
              },
            }
          : {}),
      },
    });

    revalidatePath(`/rooms/${roomId}/exams`);
    return { exam: newExam };
  } catch (error) {
    console.error("Error creating exam:", error);
    return { error: { message: "An unexpected error occurred." } };
  }
}

export async function updateExam(examId: string, data: ExamInput) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { error: { message: "Unauthorized: Please log in." } };
    }

    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: { room: true },
    });

    if (!exam) {
      return { error: { message: "Exam not found." } };
    }

    // Check permissions
    const membership = await prisma.roomMember.findUnique({
      where: {
        roomId_userId: {
          roomId: exam.roomId,
          userId: session.user.id,
        },
      },
    });

    if (
      exam.room.ownerId !== session.user.id &&
      (!membership || membership.role !== "EXAMINER")
    ) {
      return {
        error: {
          message:
            "Forbidden: You must be an examiner or owner to edit this exam.",
        },
      };
    }

    const validatedData = examSchema.safeParse(data);
    if (!validatedData.success) {
      return {
        error: {
          message: "Invalid exam data provided.",
          details: validatedData.error.flatten(),
        },
      };
    }

    const { isRestricted, allowedExamineeIds, ...restData } =
      validatedData.data;

    const updatedExam = await prisma.exam.update({
      where: { id: examId },
      data: {
        ...restData,
        isRestricted,
        allowedExaminees: {
          set: [], // Clear existing
          ...(isRestricted &&
          allowedExamineeIds &&
          allowedExamineeIds.length > 0
            ? {
                connect: allowedExamineeIds.map((id) => ({ id })),
              }
            : {}),
        },
      },
    });

    revalidatePath(`/rooms/${exam.roomId}/exams/${examId}`);
    revalidatePath(`/rooms/${exam.roomId}/exams`);
    return { exam: updatedExam };
  } catch (error) {
    console.error("Error updating exam:", error);
    return { error: { message: "An unexpected error occurred." } };
  }
}

export async function deleteExam(examId: string) {
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
        room: true,
        questions: true,
        submissions: {
          include: { answers: true }
        }
      },
    });

    if (!exam) {
      return { error: { message: "Exam not found." } };
    }

    const membership = await prisma.roomMember.findUnique({
      where: {
        roomId_userId: { roomId: exam.roomId, userId: session.user.id },
      },
    });

    if (
      exam.room.ownerId !== session.user.id &&
      (!membership || membership.role !== "EXAMINER")
    ) {
      return {
        error: {
          message:
            "Forbidden: You must be an examiner or owner to delete this exam.",
        },
      };
    }



    await prisma.exam.delete({
      where: { id: examId },
    });

    revalidatePath(`/rooms/${exam.roomId}/exams`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting exam:", error);
    return { error: { message: "An unexpected error occurred." } };
  }
}

export async function toggleResultsPublished(
  examId: string,
  published: boolean,
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { error: { message: "Unauthorized: Please log in." } };
    }

    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: { room: true },
    });

    if (!exam) {
      return { error: { message: "Exam not found." } };
    }

    const membership = await prisma.roomMember.findUnique({
      where: {
        roomId_userId: { roomId: exam.roomId, userId: session.user.id },
      },
    });

    if (
      exam.room.ownerId !== session.user.id &&
      (!membership || membership.role !== "EXAMINER")
    ) {
      return {
        error: { message: "Forbidden: Only examiners can publish results." },
      };
    }

    const updatedExam = await prisma.exam.update({
      where: { id: examId },
      data: { resultsPublished: published },
    });

    // Bulk update all submissions to match the new global setting
    await prisma.examSubmission.updateMany({
      where: { examId },
      data: { isResultPublished: published },
    });

    revalidatePath(`/rooms/${exam.roomId}/exams/${examId}/submissions`);
    revalidatePath(`/rooms/${exam.roomId}/exams/${examId}/results`);
    return { exam: updatedExam };
  } catch (error) {
    console.error("Error toggling results published:", error);
    return { error: { message: "An unexpected error occurred." } };
  }
}

export async function publishExam(examId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { error: { message: "Unauthorized: Please log in." } };
    }

    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: { room: true, questions: true },
    });

    if (!exam) {
      return { error: { message: "Exam not found." } };
    }

    const membership = await prisma.roomMember.findUnique({
      where: {
        roomId_userId: { roomId: exam.roomId, userId: session.user.id },
      },
    });

    if (
      exam.room.ownerId !== session.user.id &&
      (!membership || membership.role !== "EXAMINER")
    ) {
      return {
        error: {
          message:
            "Forbidden: You must be an examiner or owner to publish this exam.",
        },
      };
    }

    if (exam.questions.length === 0) {
      return {
        error: { message: "Cannot publish an exam with no questions." },
      };
    }

    const updatedExam = await prisma.exam.update({
      where: { id: examId },
      data: {
        status: "PUBLISHED",
      },
    });

    revalidatePath(`/rooms/${exam.roomId}/exams`);
    revalidatePath(`/rooms/${exam.roomId}/exams/${examId}/edit`);
    return { exam: updatedExam };
  } catch (error) {
    console.error("Error publishing exam:", error);
    return { error: { message: "An unexpected error occurred." } };
  }
}

export async function closeExamEarly(examId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { error: { message: "Unauthorized: Please log in." } };
    }

    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: { room: true },
    });

    if (!exam) {
      return { error: { message: "Exam not found." } };
    }

    const membership = await prisma.roomMember.findUnique({
      where: {
        roomId_userId: { roomId: exam.roomId, userId: session.user.id },
      },
    });

    if (
      exam.room.ownerId !== session.user.id &&
      (!membership || membership.role !== "EXAMINER")
    ) {
      return {
        error: {
          message:
            "Forbidden: You must be an examiner or owner to close this exam.",
        },
      };
    }

    const updatedExam = await prisma.exam.update({
      where: { id: examId },
      data: {
        status: "COMPLETED",
      },
    });

    revalidatePath(`/rooms/${exam.roomId}/exams/${examId}`);
    revalidatePath(`/rooms/${exam.roomId}/exams`);
    revalidatePath(`/rooms/${exam.roomId}/exams/${examId}/edit`);
    return { exam: updatedExam };
  } catch (error) {
    console.error("Error closing exam:", error);
    return { error: { message: "An unexpected error occurred." } };
  }
}

import { questionSchema, QuestionInput } from "@/lib/validations/exam";

export async function addQuestion(examId: string, data: QuestionInput) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { error: { message: "Unauthorized: Please log in." } };
    }

    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: { room: true },
    });

    if (!exam) {
      return { error: { message: "Exam not found." } };
    }

    const membership = await prisma.roomMember.findUnique({
      where: {
        roomId_userId: { roomId: exam.roomId, userId: session.user.id },
      },
    });

    if (
      exam.room.ownerId !== session.user.id &&
      (!membership || membership.role !== "EXAMINER")
    ) {
      return {
        error: {
          message:
            "Forbidden: You must be an examiner or owner to add questions.",
        },
      };
    }

    const state = getExamState(exam);
    if (state === "ACTIVE" || state === "CLOSED") {
      return {
        error: {
          message: `Cannot add questions. The exam is currently ${state}.`,
        },
      };
    }

    const validatedData = questionSchema.safeParse(data);
    if (!validatedData.success) {
      return {
        error: {
          message: "Invalid question data provided.",
          details: validatedData.error.flatten(),
        },
      };
    }

    const newQuestion = await prisma.question.create({
      data: {
        examId,
        ...validatedData.data,
      },
    });

    revalidatePath(`/rooms/${exam.roomId}/exams/${examId}/edit`);
    return { question: newQuestion };
  } catch (error) {
    console.error("Error adding question:", error);
    return { error: { message: "An unexpected error occurred." } };
  }
}

export async function updateQuestion(questionId: string, data: QuestionInput) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { error: { message: "Unauthorized: Please log in." } };
    }

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: { exam: { include: { room: true } } },
    });

    if (!question) {
      return { error: { message: "Question not found." } };
    }

    const membership = await prisma.roomMember.findUnique({
      where: {
        roomId_userId: {
          roomId: question.exam.roomId,
          userId: session.user.id,
        },
      },
    });

    if (
      question.exam.room.ownerId !== session.user.id &&
      (!membership || membership.role !== "EXAMINER")
    ) {
      return {
        error: {
          message:
            "Forbidden: You must be an examiner or owner to edit questions.",
        },
      };
    }

    const state = getExamState(question.exam);
    if (state === "ACTIVE" || state === "CLOSED") {
      return {
        error: {
          message: `Cannot edit questions. The exam is currently ${state}.`,
        },
      };
    }

    const validatedData = questionSchema.safeParse(data);
    if (!validatedData.success) {
      return {
        error: {
          message: "Invalid question data provided.",
          details: validatedData.error.flatten(),
        },
      };
    }

    const updatedQuestion = await prisma.question.update({
      where: { id: questionId },
      data: { ...validatedData.data },
    });

    revalidatePath(
      `/rooms/${question.exam.roomId}/exams/${question.examId}/edit`,
    );
    return { question: updatedQuestion };
  } catch (error) {
    console.error("Error updating question:", error);
    return { error: { message: "An unexpected error occurred." } };
  }
}

export async function deleteQuestion(questionId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { error: { message: "Unauthorized: Please log in." } };
    }

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: { exam: { include: { room: true } } },
    });

    if (!question) {
      return { error: { message: "Question not found." } };
    }

    const membership = await prisma.roomMember.findUnique({
      where: {
        roomId_userId: {
          roomId: question.exam.roomId,
          userId: session.user.id,
        },
      },
    });

    if (
      question.exam.room.ownerId !== session.user.id &&
      (!membership || membership.role !== "EXAMINER")
    ) {
      return {
        error: {
          message:
            "Forbidden: You must be an examiner or owner to delete questions.",
        },
      };
    }

    const state = getExamState(question.exam);
    if (state === "ACTIVE" || state === "CLOSED") {
      return {
        error: {
          message: `Cannot delete questions. The exam is currently ${state}.`,
        },
      };
    }



    await prisma.question.delete({ where: { id: questionId } });

    revalidatePath(
      `/rooms/${question.exam.roomId}/exams/${question.examId}/edit`,
    );
    return { success: true };
  } catch (error) {
    console.error("Error deleting question:", error);
    return { error: { message: "An unexpected error occurred." } };
  }
}

export async function reorderQuestions(
  examId: string,
  updates: { id: string; order: number }[],
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { error: { message: "Unauthorized: Please log in." } };
    }

    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: { room: true },
    });

    if (!exam) {
      return { error: { message: "Exam not found." } };
    }

    const membership = await prisma.roomMember.findUnique({
      where: {
        roomId_userId: { roomId: exam.roomId, userId: session.user.id },
      },
    });

    if (
      exam.room.ownerId !== session.user.id &&
      (!membership || membership.role !== "EXAMINER")
    ) {
      return {
        error: {
          message:
            "Forbidden: You must be an examiner or owner to reorder questions.",
        },
      };
    }

    const state = getExamState(exam);
    if (state === "ACTIVE" || state === "CLOSED") {
      return {
        error: {
          message: `Cannot reorder questions. The exam is currently ${state}.`,
        },
      };
    }

    // Use a transaction to perform bulk updates
    await prisma.$transaction(
      updates.map((update) =>
        prisma.question.update({
          where: { id: update.id },
          data: { order: update.order },
        }),
      ),
    );

    revalidatePath(`/rooms/${exam.roomId}/exams/${examId}/edit`);
    return { success: true };
  } catch (error) {
    console.error("Error reordering questions:", error);
    return { error: { message: "An unexpected error occurred." } };
  }
}
