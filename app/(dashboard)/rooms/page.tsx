import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Box, Users, Hash, FileText, ChevronRight } from "lucide-react";
import { CreateRoomDialog } from "@/components/room/create-room-dialog";
import { JoinRoomDialog } from "@/components/room/join-room-dialog";
import { RoomCardActions } from "@/components/room/room-card-actions";
import { RoomActionsNavbar } from "@/components/room/room-actions-navbar";
import { AppHeader } from "@/components/app-header";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default async function RoomsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const rooms = await prisma.room.findMany({
    where: {
      roomMembers: {
        some: {
          userId: session.user.id,
        },
      },
    },
    include: {
      owner: true,
      _count: {
        select: { roomMembers: true, exams: true },
      },
      roomMembers: {
        where: { userId: session.user.id },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="flex w-full flex-col">
      <AppHeader title="Rooms">
        {rooms.length > 0 && <RoomActionsNavbar />}
      </AppHeader>

      <div className="p-6">
        <div className="space-y-6">
          {rooms.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Box />
                </EmptyMedia>
                <EmptyTitle>No Rooms Yet</EmptyTitle>
                <EmptyDescription>
                  You are not in any rooms yet. Get started by creating your
                  first room or join an existing room.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent className="mt-4 flex-row justify-center gap-2">
                <JoinRoomDialog>
                  <Button variant="outline">Join Room</Button>
                </JoinRoomDialog>
                <CreateRoomDialog>
                  <Button>Create Room</Button>
                </CreateRoomDialog>
              </EmptyContent>
            </Empty>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {rooms.map((room) => {
                const isOwner = room.ownerId === session.user.id;
                const isExaminer = room.roomMembers[0]?.role === "EXAMINER";

                const roleLabel = isOwner
                  ? "Owner"
                  : isExaminer
                    ? "Examiner"
                    : "Examinee";
                const roleVariant: "default" | "secondary" | "outline" = isOwner
                  ? "default"
                  : isExaminer
                    ? "secondary"
                    : "outline";

                return (
                  <Card
                    key={room.id}
                    className="group relative flex flex-col bg-white/80 dark:bg-white/5 backdrop-blur-xl border-black/[0.08] dark:border-white/[0.08] rounded-2xl   hover:-translate-y-1 hover:border-violet-500/30 dark:hover:border-violet-400/20 transition-all duration-300"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <CardTitle className="truncate text-lg">
                            {room.name}
                          </CardTitle>
                          <CardDescription className="mt-1 line-clamp-2">
                            {room.description || "No description provided."}
                          </CardDescription>
                        </div>
                        <div className="flex shrink-0 items-center gap-1">
                          <Badge variant={roleVariant} className="text-xs">
                            {roleLabel}
                          </Badge>
                          <RoomCardActions
                            roomId={room.id}
                            roomCode={room.roomCode}
                            isOwner={isOwner}
                            isExaminer={isExaminer}
                          />
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="flex-1 pb-3">
                      <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm">
                        <div className="flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5" />
                          <span>
                            {room._count.roomMembers}{" "}
                            {room._count.roomMembers === 1
                              ? "member"
                              : "members"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <FileText className="h-3.5 w-3.5" />
                          <span>
                            {room._count.exams}{" "}
                            {room._count.exams === 1 ? "exam" : "exams"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Hash className="h-3.5 w-3.5" />
                          <span className="font-mono text-xs">
                            {room.roomCode}
                          </span>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="border-t border-black/[0.08] dark:border-white/[0.08] pt-3">
                      <div className="flex w-full items-center justify-between">
                        <span className="text-muted-foreground text-xs">
                          Created{" "}
                          {formatDistanceToNow(new Date(room.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-foreground -mr-2 gap-1 text-xs"
                          asChild
                        >
                          <Link href={`/rooms/${room.id}`}>
                            Open
                            <ChevronRight className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
