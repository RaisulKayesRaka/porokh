"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { generateText, Output } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { Prisma } from "@/app/generated/prisma/client";

interface RubricItem {
  criterion: string;
  marks: number;
}

interface RubricResult {
  criterion: string;
  marks: number;
  matched: boolean;
  reasoning: string;
}

export async function aiGradeDescriptiveAnswer(answerId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { error: { message: "Unauthorized: Please log in." } };
    }

    const answer = await prisma.answer.findUnique({
      where: { id: answerId },
      include: {
        question: true,
        submission: {
          include: {
            exam: {
              include: { room: true },
            },
          },
        },
      },
    });

    if (!answer) {
      return { error: { message: "Answer not found." } };
    }

    // Verify examiner
    const membership = await prisma.roomMember.findUnique({
      where: {
        roomId_userId: {
          roomId: answer.submission.exam.roomId,
          userId: session.user.id,
        },
      },
    });

    if (
      answer.submission.exam.room.ownerId !== session.user.id &&
      (!membership || membership.role !== "EXAMINER")
    ) {
      return {
        error: {
          message: "Forbidden: Only examiners can trigger AI grading.",
        },
      };
    }

    if (answer.question.type !== "DESCRIPTIVE") {
      return {
        error: { message: "AI grading is only available for descriptive questions." },
      };
    }

    const rubric = answer.question.rubric as RubricItem[] | null;

    if (!rubric || rubric.length === 0) {
      return {
        error: {
          message:
            "No rubric defined for this question. Please add marking criteria first.",
        },
      };
    }

    const answerText = answer.textValue || "";

    // Extract any image URLs inserted into the question
    const questionImageRegex = /<img[^>]+src="([^">]+)"/g;
    const extractedQuestionImages: string[] = [];
    let qMatch;
    while ((qMatch = questionImageRegex.exec(answer.question.text)) !== null) {
      if (qMatch[1]) {
        extractedQuestionImages.push(qMatch[1]);
      }
    }

    const hasTextContent = answerText.replace(/<[^>]*>?/gm, '').trim().length > 0;

    if (!hasTextContent) {
      // No answer text — all criteria are unmatched
      const results: RubricResult[] = rubric.map((item) => ({
        criterion: item.criterion,
        marks: item.marks,
        matched: false,
        reasoning: "No text or drawing was provided.",
      }));

      await prisma.answer.update({
        where: { id: answerId },
        data: {
          aiScore: 0,
          aiRubricResult: results as unknown as Prisma.InputJsonValue,
        },
      });

      revalidatePath(
        `/rooms/${answer.submission.exam.roomId}/exams/${answer.submission.examId}/submissions/${answer.submissionId}`,
      );

      return { results, aiScore: 0 };
    }

    // Build the prompt
    const rubricDescription = rubric
      .map((item, i) => `${i + 1}. "${item.criterion}" — ${item.marks} marks`)
      .join("\n");

    const promptText = `You are an exam grading assistant. Evaluate the following examinee answer against each rubric criterion.

**Question:** ${answer.question.text}

**Examinee Answer Text:** ${answerText || "(No text provided)"}

**Rubric Criteria:**
${rubricDescription}

For each criterion, determine if the examinee's answer sufficiently addresses the concept described. Be fair but thorough — the answer doesn't need to use the exact same words, but must clearly demonstrate understanding of each criterion's concept.

Return your evaluation for each criterion.`;

    const { output: object } = await generateText({
      model: google("gemini-3.1-flash-lite"),
      output: Output.object({
        schema: z.object({
          evaluations: z.array(
            z.object({
              criterionIndex: z
                .number()
                .describe("The 0-based index of the rubric criterion"),
              matched: z
                .boolean()
                .describe(
                  "Whether the answer sufficiently addresses this criterion",
                ),
              reasoning: z
                .string()
                .describe(
                  "Brief explanation of why this criterion was or was not met",
                ),
            }),
          ),
        }),
      }),
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: promptText },
            ...(extractedQuestionImages.length > 0
              ? [
                  {
                    type: "text",
                    text: "\n--- IMAGES INCLUDED IN THE QUESTION ---\n",
                  } as const,
                ]
              : []),
            ...extractedQuestionImages.map(
              (imgUrl) => ({ type: "image", image: imgUrl }) as const,
            ),
          ],
        },
      ],
    });

    if (!object) {
      return { error: { message: "AI grading returned no result. Please try again." } };
    }

    // Map results back to rubric items
    const results: RubricResult[] = rubric.map((item, index) => {
      const evaluation = object.evaluations.find(
        (e) => e.criterionIndex === index,
      );
      return {
        criterion: item.criterion,
        marks: item.marks,
        matched: evaluation?.matched ?? false,
        reasoning: evaluation?.reasoning ?? "No evaluation provided.",
      };
    });

    const aiScore = results.reduce(
      (sum, r) => sum + (r.matched ? r.marks : 0),
      0,
    );

    await prisma.answer.update({
      where: { id: answerId },
      data: {
        aiScore,
        aiRubricResult: results as unknown as Prisma.InputJsonValue,
      },
    });

    revalidatePath(
      `/rooms/${answer.submission.exam.roomId}/exams/${answer.submission.examId}/submissions/${answer.submissionId}`,
    );

    return { results, aiScore };
  } catch (error) {
    console.error("Error in AI grading:", error);
    return { error: { message: "AI grading failed. Please try again." } };
  }
}

export async function generateAiPersonalizedFeedback(submissionId: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) return { error: { message: "Unauthorized." } };

    const submission = await prisma.examSubmission.findUnique({
      where: { id: submissionId },
      include: {
        examinee: true,
        exam: {
          include: {
            room: true,
            questions: { orderBy: { order: "asc" } },
          },
        },
        answers: true,
      },
    });

    if (!submission) return { error: { message: "Submission not found." } };

    const membership = await prisma.roomMember.findUnique({
      where: {
        roomId_userId: {
          roomId: submission.exam.roomId,
          userId: session.user.id,
        },
      },
    });

    if (submission.exam.room.ownerId !== session.user.id && (!membership || membership.role !== "EXAMINER")) {
      return { error: { message: "Forbidden: Only examiners can generate feedback." } };
    }

    const totalPoints = submission.exam.questions.reduce((sum, q) => sum + q.points, 0);
    const score = submission.score || 0;
    const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;

    let performanceContext = `The examinee, ${submission.examinee.name}, scored ${score} out of ${totalPoints} points (${percentage}%).\n\nHere is a breakdown of their performance:\n`;

    submission.exam.questions.forEach((q, i) => {
      const ans = submission.answers.find(a => a.questionId === q.id);
      performanceContext += `\nQuestion ${i + 1}: ${q.text.replace(/<[^>]*>?/gm, '')}\n`;
      performanceContext += `Type: ${q.type}, Points Available: ${q.points}\n`;
      
      if (!ans) {
        performanceContext += `Examinee did not answer.\n`;
        return;
      }
      
      if (q.type === 'MULTIPLE_CHOICE') {
        const options = (Array.isArray(q.options) ? q.options : []) as { id: string; text?: string }[];
        const selectedOption = options.find(opt => opt.id === ans.optionValue);
        const correctOption = options.find(opt => opt.id === q.correctOption);
        performanceContext += `Examinee selected: ${selectedOption?.text || ans.optionValue}\n`;
        performanceContext += `Correct answer: ${correctOption?.text || q.correctOption}\n`;
      } else {
        performanceContext += `Examinee answered: ${ans.textValue?.replace(/<[^>]*>?/gm, '') || '(No text)'}\n`;
        if (q.correctOption) {
           performanceContext += `Model answer/Expected: ${q.correctOption}\n`;
        }
      }
      performanceContext += `Points Awarded: ${ans.score || 0} / ${q.points}\n`;
    });

    const promptText = `You are a supportive and constructive exam grading assistant. 
Based on the examinee's performance details provided below, generate a cohesive, personalized feedback report.
The feedback should be addressed directly to the examinee (using "you").
Do not restate their exact answers, but rather identify their strengths, point out the specific topics or concepts they struggled with, and provide actionable advice on what they should study to improve.
Keep the tone encouraging.

Performance Details:
${performanceContext}

Output ONLY the raw text of the feedback. Do not include markdown formatting or extra conversational fluff like "Here is the feedback:".`;

    const { text } = await generateText({
      model: google("gemini-3.1-flash-lite"),
      prompt: promptText,
    });

    const newFeedback = text.trim();

    return { feedback: newFeedback };
  } catch (error) {
    console.error("Error generating AI feedback:", error);
    return { error: { message: "AI feedback generation failed." } };
  }
}
