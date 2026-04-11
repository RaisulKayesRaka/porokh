import { ExamStatus } from "@/app/generated/prisma/client";

export type ComputedExamState =
  | "DRAFT"
  | "PUBLISHED"
  | "SCHEDULED"
  | "ACTIVE"
  | "CLOSED";

/**
 * Computes the explicit state of an exam based on its database status and time window constraints.
 */
export function getExamState(exam: {
  status: ExamStatus;
  startTime: Date | null;
  endTime: Date | null;
}): ComputedExamState {
  if (exam.status === "DRAFT") {
    return "DRAFT";
  }

  if (exam.status === "COMPLETED") {
    return "CLOSED";
  }

  // At this point, exam.status must be "PUBLISHED".
  // Now we need to factor in time locks.
  const now = new Date();

  // If there's an explicit start time and we haven't reached it yet
  if (exam.startTime && now < exam.startTime) {
    return "SCHEDULED"; // Visible to examinees, but locked.
  }

  // If there's an explicit end time and we've surpassed it
  if (exam.endTime && now > exam.endTime) {
    return "CLOSED";
  }

  // Otherwise, if the exam is past the start time (or has no start time)
  // and before the end time (or has no end time), it's ACTIVE.
  return "ACTIVE";
}
