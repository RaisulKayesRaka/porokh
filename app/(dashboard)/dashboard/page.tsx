import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getExamState, type ComputedExamState } from "@/lib/exam-state";
import { Countdown } from "@/components/ui/countdown";
import { AppHeader } from "@/components/app-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Boxes,
  Zap,
  CalendarClock,
  Clock,
  Target,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Overview of your exams and rooms",
};

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const userId = session.user.id;

  // Fetch all memberships
  const memberships = await prisma.roomMember.findMany({
    where: { userId },
    select: { role: true, roomId: true },
  });

  const roomIds = memberships.map((m) => m.roomId);

  // Fetch all published exams across user's rooms
  const allExams = await prisma.exam.findMany({
    where: {
      roomId: { in: roomIds },
      status: "PUBLISHED",
    },
    include: {
      room: { select: { name: true } },
      questions: { select: { points: true } },
    },
    orderBy: { startTime: "asc" },
  });

  // Compute states and categorize
  const activeExams: typeof allExams & { _computedState?: ComputedExamState }[] = [];
  const upcomingExams: typeof allExams & { _computedState?: ComputedExamState }[] = [];

  for (const exam of allExams) {
    const state = getExamState(exam);
    if (state === "ACTIVE") {
      activeExams.push(exam);
    } else if (state === "SCHEDULED") {
      upcomingExams.push(exam);
    }
  }

  const totalRooms = memberships.length;

  return (
    <div className="flex w-full flex-col">
      <AppHeader title="Dashboard" />

      <div className="space-y-8 p-4 sm:p-6">
        {/* Three Stat Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border-black/[0.08] dark:border-white/[0.08] rounded-2xl   hover:border-violet-500/30 dark:hover:border-violet-400/20 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-sm font-medium">Rooms</CardDescription>
              <Boxes className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalRooms}</p>
              <p className="text-muted-foreground text-xs">
                {totalRooms === 1 ? "room" : "rooms"} joined
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border-black/[0.08] dark:border-white/[0.08] rounded-2xl hover:border-violet-500/30 dark:hover:border-violet-400/20 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-sm font-medium">
                Active Exams
              </CardDescription>
              <Zap className="h-4 w-4 text-violet-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-violet-600 dark:text-violet-400">
                {activeExams.length}
              </p>
              <p className="text-xs text-muted-foreground">
                live right now
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border-black/[0.08] dark:border-white/[0.08] rounded-2xl   hover:border-violet-500/30 dark:hover:border-violet-400/20 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-sm font-medium">Upcoming Exams</CardDescription>
              <CalendarClock className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{upcomingExams.length}</p>
              <p className="text-muted-foreground text-xs">
                scheduled
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Active Exams List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold tracking-tight">Active Exams</h3>

          {activeExams.length === 0 ? (
            <Card className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border-black/[0.08] dark:border-white/[0.08] rounded-2xl  border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                <Zap className="text-muted-foreground mb-3 h-8 w-8 opacity-30" />
                <p className="text-muted-foreground text-sm">
                  No exams are active right now.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {activeExams.map((exam) => {
                const totalMarks = exam.questions.reduce((s, q) => s + q.points, 0);

                return (
                  <Link key={exam.id} href={`/rooms/${exam.roomId}/exams/${exam.id}`}>
                    <Card className="group bg-white/80 dark:bg-white/5 backdrop-blur-xl border-black/[0.08] dark:border-white/[0.08] rounded-2xl hover:border-violet-500/30 dark:hover:border-violet-400/20 transition-all duration-300">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold group-hover:underline">
                              {exam.title}
                            </p>
                            <p className="text-muted-foreground mt-0.5 truncate text-xs">
                              {exam.room.name}
                            </p>
                          </div>
                          <Badge variant="default" className="shrink-0 bg-green-600 text-[10px] hover:bg-green-600">
                            ACTIVE
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                          <span className="flex items-center gap-1">
                            <Target className="h-3 w-3" />
                            {exam.questions.length} Q • {totalMarks} pts
                          </span>
                          {exam.timeLimitMinutes && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {exam.timeLimitMinutes}m
                            </span>
                          )}
                          {exam.endTime && (
                            <Countdown
                              targetDate={exam.endTime}
                              prefix="Ends"
                              className="text-muted-foreground"
                              iconClassName="h-3 w-3"
                            />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Upcoming Exams List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold tracking-tight">Upcoming Exams</h3>

          {upcomingExams.length === 0 ? (
            <Card className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border-black/[0.08] dark:border-white/[0.08] rounded-2xl  border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                <CalendarClock className="text-muted-foreground mb-3 h-8 w-8 opacity-30" />
                <p className="text-muted-foreground text-sm">
                  No upcoming exams scheduled.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {upcomingExams.map((exam) => {
                const totalMarks = exam.questions.reduce((s, q) => s + q.points, 0);

                return (
                  <Link key={exam.id} href={`/rooms/${exam.roomId}/exams/${exam.id}`}>
                    <Card className="group bg-white/80 dark:bg-white/5 backdrop-blur-xl border-black/[0.08] dark:border-white/[0.08] rounded-2xl hover:border-violet-500/30 dark:hover:border-violet-400/20 transition-all duration-300">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold group-hover:underline">
                              {exam.title}
                            </p>
                            <p className="text-muted-foreground mt-0.5 truncate text-xs">
                              {exam.room.name}
                            </p>
                          </div>
                          <Badge variant="secondary" className="shrink-0 text-[10px]">
                            SCHEDULED
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                          <span className="flex items-center gap-1">
                            <Target className="h-3 w-3" />
                            {exam.questions.length} Q • {totalMarks} pts
                          </span>
                          {exam.timeLimitMinutes && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {exam.timeLimitMinutes}m
                            </span>
                          )}
                          {exam.startTime && (
                            <Countdown
                              targetDate={exam.startTime}
                              prefix="Starts"
                              className="text-muted-foreground"
                              iconClassName="h-3 w-3"
                            />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
