import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

import { AppHeader } from "@/components/app-header";

export default async function RoomLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  // Verify the user is actually a member of this room
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

  if (!membership) {
    redirect("/rooms");
  }

  return (
    <div className="flex h-full w-full flex-col">
      <AppHeader title={membership.room.name} />

      <div className="flex-1 p-6">
        {children}
      </div>
    </div>
  );
}
