import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const escapeCsv = (str: string | null | undefined) => {
  if (str === null || str === undefined) return '""';
  return `"${String(str).replace(/"/g, '""')}"`;
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ examId: string }> }
) {
  const { examId } = await params;
  
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Find the exam and verify the user is the EXAMINER of the room
  const exam = await prisma.exam.findUnique({
    where: { id: examId },
    include: {
      room: {
        include: {
          roomMembers: {
            where: {
              userId: session.user.id,
              role: "EXAMINER",
            }
          }
        }
      },
      questions: {
        orderBy: { order: "asc" }
      },
      submissions: {
        include: {
          examinee: true,
          answers: true
        },
        orderBy: { submittedAt: "desc" }
      }
    }
  });

  if (!exam || exam.room.roomMembers.length === 0) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const totalPossiblePoints = exam.questions.reduce((sum, q) => sum + q.points, 0);

  // Generate CSV rows
  const headersRow = [
    "Name",
    "Email",
    "Status",
    "Score",
    "Max Score",
    "Percentage",
    "Penalty",
    "Penalty Reason",
    "Started At",
    "Submitted At",
    "Duration (Minutes)",
    "Tab Switches",
    ...exam.questions.map((_, i) => `Q${i + 1} Score`)
  ].join(",");

  const rows = exam.submissions.map(sub => {
    const percentage = totalPossiblePoints > 0 && sub.score !== null 
        ? ((sub.score / totalPossiblePoints) * 100).toFixed(2) + "%" 
        : "N/A";
    
    let durationMins = "N/A";
    if (sub.startedAt && sub.submittedAt) {
      durationMins = ((sub.submittedAt.getTime() - sub.startedAt.getTime()) / 60000).toFixed(2);
    }

    const baseData = [
      escapeCsv(sub.examinee.name),
      escapeCsv(sub.examinee.email),
      escapeCsv(sub.status),
      sub.score ?? "N/A",
      totalPossiblePoints,
      percentage,
      sub.penalty,
      escapeCsv(sub.penaltyReason),
      escapeCsv(sub.startedAt.toISOString()),
      escapeCsv(sub.submittedAt?.toISOString() || ""),
      durationMins,
      sub.tabSwitchCount
    ];

    const questionScores = exam.questions.map(q => {
      const answer = sub.answers.find(a => a.questionId === q.id);
      return answer?.score ?? "N/A";
    });

    return [...baseData, ...questionScores].join(",");
  });

  const csvContent = [headersRow, ...rows].join("\n");

  return new NextResponse(csvContent, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${exam.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_results.csv"`,
    },
  });
}
