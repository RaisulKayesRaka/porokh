import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { EditRoomForm } from "@/components/room/edit-room-form";
import { CopyButton } from "@/components/room/copy-button";
import { ResetRoomCodeButton } from "@/components/room/reset-room-code-button";
import { DeleteRoomDialog } from "@/components/room/delete-room-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default async function RoomSettingsPage({
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
    redirect(`/rooms/${roomId}`);
  }

  const { room } = membership;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your room settings and preferences.
        </p>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Room Details</CardTitle>
          <CardDescription>
            Update your room&apos;s name and description. These changes will be
            visible to all members.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EditRoomForm
            roomId={room.id}
            initialName={room.name}
            initialDescription={room.description}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Room Code</CardTitle>
          <CardDescription>
            Share this code with examinees so they can join the room.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted flex items-center justify-between rounded-md p-3">
            <span className="text-primary font-mono text-lg font-bold tracking-wider">
              {room.roomCode}
            </span>
            <div className="flex items-center gap-2">
              <CopyButton text={room.roomCode} />
              <ResetRoomCodeButton roomId={room.id} />
            </div>
          </div>
        </CardContent>
      </Card>

      {room.ownerId === session.user.id && (
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible and destructive actions for this room.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col justify-between gap-4 rounded-lg border p-4 sm:flex-row sm:items-center">
              <div className="space-y-0.5">
                <h4 className="text-sm font-medium">Delete this room</h4>
                <p className="text-muted-foreground text-sm">
                  Once you delete a room, there is no going back. Please be
                  certain.
                </p>
              </div>
              <DeleteRoomDialog roomId={room.id} roomName={room.name} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
