import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, BarChart3, TrendingUp, TrendingDown, Target, BrainCircuit } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RichTextViewer } from "@/components/ui/rich-text-editor";

export default async function ExamAnalyticsPage({
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

  const exam = await prisma.exam.findUnique({
    where: { id: examId, roomId },
    include: {
      questions: {
        orderBy: { order: "asc" },
      },
      submissions: {
        where: { status: "GRADED" },
        include: {
            answers: true
        }
      },
    },
  });

  if (!exam) {
    redirect(`/rooms/${roomId}/exams`);
  }

  const totalPossiblePoints = exam.questions.reduce((sum, q) => sum + q.points, 0);
  const gradedSubmissions = exam.submissions;

  // Global Metrics
  let avgScore = 0;
  let highestScore = 0;
  let lowestScore = 0;
  let medianScore = 0;

  if (gradedSubmissions.length > 0) {
    const scores = gradedSubmissions.map(s => s.score || 0).sort((a, b) => a - b);
    
    avgScore = scores.reduce((sum, s) => sum + s, 0) / scores.length;
    highestScore = scores[scores.length - 1];
    lowestScore = scores[0];

    const mid = Math.floor(scores.length / 2);
    medianScore = scores.length % 2 !== 0 ? scores[mid] : (scores[mid - 1] + scores[mid]) / 2;
  }

  // Per-Question Metrics
  const questionStats = exam.questions.map(question => {
      let attempts = 0;
      let totalEarned = 0;
      let perfectScores = 0;

      gradedSubmissions.forEach(sub => {
          const answer = sub.answers.find(a => a.questionId === question.id);
          if (answer && answer.score !== null) {
              attempts++;
              totalEarned += answer.score;
              if (answer.score === question.points) {
                  perfectScores++;
              }
          }
      });

      const avgEarned = attempts > 0 ? totalEarned / attempts : 0;
      const accuracyPercentage = attempts > 0 ? (perfectScores / attempts) * 100 : 0;

      return {
          ...question,
          attempts,
          avgEarned,
          accuracyPercentage
      };
  });

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-12">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/rooms/${roomId}/exams/${exam.id}/submissions`}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Analytics</h2>
          <p className="text-muted-foreground">
            Aggregate performance data for {exam.title}
          </p>
        </div>
      </div>

      {gradedSubmissions.length === 0 ? (
          <Card>
              <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                  <h3 className="text-xl font-bold">No Data Available Yet</h3>
                  <p className="text-muted-foreground mt-2 max-w-sm">
                      Analytics will be generated once examinees submit their exams and you have graded them.
                  </p>
              </CardContent>
          </Card>
      ) : (
          <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Average Score</CardDescription>
                        <CardTitle className="text-4xl flex items-baseline gap-2">
                            {avgScore.toFixed(1)} <span className="text-lg font-normal text-muted-foreground">/ {totalPossiblePoints}</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-muted-foreground flex items-center">
                            Based on {gradedSubmissions.length} graded submissions
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Highest Score</CardDescription>
                        <CardTitle className="text-4xl text-green-600 dark:text-green-400">
                            {highestScore}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <TrendingUp className="h-5 w-5 text-green-500/50" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Median Score</CardDescription>
                        <CardTitle className="text-4xl">
                            {medianScore.toFixed(1)}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Target className="h-5 w-5 text-muted-foreground/50" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Lowest Score</CardDescription>
                        <CardTitle className="text-4xl text-red-600 dark:text-red-400">
                            {lowestScore}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <TrendingDown className="h-5 w-5 text-red-500/50" />
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                <h3 className="text-xl font-bold tracking-tight">Question Breakdown</h3>
                <p className="text-muted-foreground text-sm">Analyze which questions the class struggled with the most to inform future teaching and exam design.</p>
                
                <div className="grid gap-4">
                    {questionStats.map((stat, i) => (
                        <Card key={stat.id}>
                            <CardHeader className="flex flex-col gap-3 pb-2 bg-muted/20 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Badge variant="outline">Q{i + 1}</Badge>
                                        <Badge variant="secondary">{stat.type === 'MULTIPLE_CHOICE' ? "MCQ" : "Descriptive"}</Badge>
                                        <span className="text-sm text-muted-foreground font-medium">{stat.points} pts max</span>
                                    </div>
                                    <CardTitle className="text-base leading-snug font-medium">
                                        <RichTextViewer content={stat.text} className="text-sm" />
                                    </CardTitle>
                                </div>
                                <div className="text-left sm:text-right">
                                    <div className={`text-2xl font-bold ${stat.accuracyPercentage < 50 ? 'text-red-500' : stat.accuracyPercentage > 85 ? 'text-green-500' : 'text-primary'}`}>
                                        {stat.accuracyPercentage.toFixed(0)}%
                                    </div>
                                    <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Perfect Score Rate</div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4 flex flex-col sm:flex-row gap-8">
                                <div className="space-y-1 flex-1">
                                    <span className="text-sm text-muted-foreground">Average Earned</span>
                                    <p className="text-lg font-bold">{stat.avgEarned.toFixed(2)} pts</p>
                                </div>
                                <div className="space-y-1 flex-1 border-l pl-4">
                                    <span className="text-sm text-muted-foreground">Graded Attempts</span>
                                    <p className="text-lg font-bold">{stat.attempts} / {gradedSubmissions.length}</p>
                                </div>
                                
                                <div className="flex-2 flex items-center justify-end">
                                   {stat.accuracyPercentage < 50 && (
                                       <div className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-500/10 px-3 py-1.5 rounded-full text-sm font-medium">
                                          <BrainCircuit /> Hard Question
                                       </div>
                                   )}
                                   {stat.accuracyPercentage >= 90 && (
                                       <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-500/10 px-3 py-1.5 rounded-full text-sm font-medium">
                                          <TrendingUp /> Easy Question
                                       </div>
                                   )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
          </>
      )}
    </div>
  );
}
