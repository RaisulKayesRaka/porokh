import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemGroup,
} from "@/components/ui/item";
import { InviteMemberDialog } from "@/components/room/invite-member-dialog";
import { MemberActions } from "@/components/room/member-actions";

function canShowDropdown(
  isViewerOwner: boolean,
  isViewerExaminer: boolean,
  isSelf: boolean,
  isTargetOwner: boolean,
  targetRole: "EXAMINER" | "EXAMINEE",
) {
  if (isViewerOwner) {
    return !isSelf;
  }
  if (isViewerExaminer) {
    if (isSelf) return true;
    if (isTargetOwner) return false;
    if (targetRole === "EXAMINER") return false;
    if (targetRole === "EXAMINEE") return true;
  }
  // isViewerExaminee
  if (isSelf) return true;
  return false;
}

export default async function RoomMembersPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: {
      roomMembers: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
        orderBy: [{ role: "asc" }, { user: { name: "asc" } }],
      },
    },
  });

  if (!room) {
    redirect("/rooms");
  }

  const currentUserMembership = room.roomMembers.find(
    (m) => m.userId === session.user.id,
  );

  if (!currentUserMembership) {
    redirect("/rooms");
  }

  const isViewerOwner = room.ownerId === session.user.id;
  const isViewerExaminer = currentUserMembership.role === "EXAMINER";

  const examiners = room.roomMembers
    .filter((m) => m.role === "EXAMINER")
    .sort((a, b) => {
      if (a.userId === room.ownerId) return -1;
      if (b.userId === room.ownerId) return 1;
      return 0;
    });
  const examinees = room.roomMembers.filter((m) => m.role === "EXAMINEE");

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <div className="mb-4 flex items-center justify-between border-b pb-2">
          <h2 className="text-primary text-xl font-semibold">Examiners</h2>
          {isViewerExaminer && (
            <InviteMemberDialog roomId={roomId} role="EXAMINER" />
          )}
        </div>
        <ItemGroup className="grid gap-4">
          {examiners.map((member) => {
            const isSelf = member.userId === session.user.id;

            return (
              <Item key={member.id} variant="outline">
                <ItemMedia>
                  <Avatar className="size-10">
                    <AvatarImage src={member.user.image || ""} />
                    <AvatarFallback>
                      {member.user.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>
                    {member.user.name}
                    {isSelf && (
                      <span className="text-muted-foreground ml-2 text-xs">
                        (You)
                      </span>
                    )}
                  </ItemTitle>
                  <ItemDescription>{member.user.email}</ItemDescription>
                </ItemContent>
                <ItemActions>
                  {canShowDropdown(
                    isViewerOwner,
                    isViewerExaminer,
                    isSelf,
                    room.ownerId === member.userId,
                    "EXAMINER",
                  ) && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground h-8 w-8 rounded-full"
                        >
                          <EllipsisVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-auto">
                        <MemberActions
                          roomId={roomId}
                          targetUserId={member.userId}
                          targetRole="EXAMINER"
                          isViewerOwner={isViewerOwner}
                          isViewerExaminer={isViewerExaminer}
                          isSelf={isSelf}
                        />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </ItemActions>
              </Item>
            );
          })}
        </ItemGroup>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between border-b pb-2">
          <h2 className="text-primary text-xl font-semibold">Examinees</h2>
          {isViewerExaminer && (
            <InviteMemberDialog roomId={roomId} role="EXAMINEE" />
          )}
        </div>

        {examinees.length === 0 ? (
          <p className="text-muted-foreground py-4 text-sm italic">
            No examinees have joined this room yet.
          </p>
        ) : (
          <ItemGroup className="grid gap-4">
            {examinees.map((member) => (
              <Item key={member.id} variant="outline">
                <ItemMedia>
                  <Avatar className="size-10">
                    <AvatarImage src={member.user.image || ""} />
                    <AvatarFallback>
                      {member.user.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>
                    {member.user.name}
                    {member.userId === session.user.id && (
                      <span className="text-muted-foreground ml-2 text-xs">
                        (You)
                      </span>
                    )}
                  </ItemTitle>
                  <ItemDescription>{member.user.email}</ItemDescription>
                </ItemContent>
                <ItemActions>
                  {canShowDropdown(
                    isViewerOwner,
                    isViewerExaminer,
                    member.userId === session.user.id,
                    false,
                    "EXAMINEE",
                  ) && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground h-8 w-8 rounded-full"
                        >
                          <EllipsisVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-auto">
                        <MemberActions
                          roomId={roomId}
                          targetUserId={member.userId}
                          targetRole="EXAMINEE"
                          isViewerOwner={isViewerOwner}
                          isViewerExaminer={isViewerExaminer}
                          isSelf={member.userId === session.user.id}
                        />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </ItemActions>
              </Item>
            ))}
          </ItemGroup>
        )}
      </div>
    </div>
  );
}
