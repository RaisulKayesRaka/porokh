"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Reusable function to verify if the active user holds specific roles in a room
async function verifyRoomPermissions(
  roomId: string,
  allowedRoles: ("EXAMINER" | "EXAMINEE")[],
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { error: "Unauthorized.", user: null, room: null };
  }

  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: {
      roomMembers: {
        where: { userId: session.user.id },
      },
    },
  });

  if (!room || room.roomMembers.length === 0) {
    return {
      error: "Room not found or you are not a member.",
      user: null,
      room: null,
    };
  }

  const userRole = room.roomMembers[0].role;
  if (!allowedRoles.includes(userRole)) {
    return {
      error: "You do not have permission to perform this action.",
      user: null,
      room,
    };
  }

  return { error: null, user: session.user, room, userRole };
}

export async function addMember(
  roomId: string,
  email: string,
  role: "EXAMINER" | "EXAMINEE",
) {
  try {
    // Only Examiners can add new members
    const permissions = await verifyRoomPermissions(roomId, ["EXAMINER"]);
    if (permissions.error) return { error: permissions.error };

    // Find the user by email
    const targetUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!targetUser) {
      return { error: "User with this email does not exist." };
    }

    // Check if the user is already a member
    const existingMembership = await prisma.roomMember.findUnique({
      where: {
        roomId_userId: {
          roomId,
          userId: targetUser.id,
        },
      },
    });

    if (existingMembership) {
      return { error: "This user is already a member of the room." };
    }

    // Add them to the room
    await prisma.roomMember.create({
      data: {
        roomId,
        userId: targetUser.id,
        role,
      },
    });

    revalidatePath(`/rooms/${roomId}/members`);
    revalidatePath(`/rooms/${roomId}`);

    return { success: true };
  } catch (error) {
    console.error("Failed to add member:", error);
    return { error: "An unexpected error occurred while adding the member." };
  }
}

export async function removeMember(roomId: string, targetUserId: string) {
  try {
    // Only Examiners can remove members
    const permissions = await verifyRoomPermissions(roomId, ["EXAMINER"]);
    if (permissions.error) return { error: permissions.error };

    // Cannot remove yourself this way (needs a 'leaveRoom' action)
    if (permissions.user!.id === targetUserId) {
      return { error: "You cannot remove yourself." };
    }

    // Identify the target member
    const targetMember = await prisma.roomMember.findUnique({
      where: {
        roomId_userId: {
          roomId,
          userId: targetUserId,
        },
      },
    });

    if (!targetMember) {
      return { error: "Target user is not a member of this room." };
    }

    // Check Owner hierarchy limits
    const room = permissions.room!;
    const isTargetOwner = room.ownerId === targetUserId;
    const isActionCausedByOwner = room.ownerId === permissions.user!.id;

    if (isTargetOwner) {
      return { error: "The owner of the room cannot be removed." };
    }

    if (targetMember.role === "EXAMINER" && !isActionCausedByOwner) {
      return { error: "Only the room owner can remove other examiners." };
    }

    // Execute removal
    await prisma.roomMember.delete({
      where: {
        id: targetMember.id,
      },
    });

    revalidatePath(`/rooms/${roomId}/members`);
    revalidatePath(`/rooms/${roomId}`);

    return { success: true };
  } catch (error) {
    console.error("Failed to remove member:", error);
    return { error: "An unexpected error occurred while removing the member." };
  }
}

export async function transferOwnership(roomId: string, newOwnerId: string) {
  try {
    // This action MUST be validated internally to ONLY allow the current owner
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { error: "Unauthorized." };
    }

    const room = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      return { error: "Room not found." };
    }

    if (room.ownerId !== session.user.id) {
      return { error: "Only the current owner can transfer ownership." };
    }

    if (room.ownerId === newOwnerId) {
      return { error: "You already own this room." };
    }

    // Verify the new owner is an EXAMINER in this room
    const targetMember = await prisma.roomMember.findUnique({
      where: {
        roomId_userId: {
          roomId,
          userId: newOwnerId,
        },
      },
    });

    if (!targetMember || targetMember.role !== "EXAMINER") {
      return {
        error: "Ownership can only be transferred to an existing Examiner.",
      };
    }

    // Transfer the room
    await prisma.room.update({
      where: { id: roomId },
      data: { ownerId: newOwnerId },
    });

    revalidatePath(`/rooms/${roomId}/members`);
    revalidatePath(`/rooms/${roomId}`);
    revalidatePath("/(dashboard)", "layout");

    return { success: true };
  } catch (error) {
    console.error("Failed to transfer ownership:", error);
    return {
      error: "An unexpected error occurred while transferring ownership.",
    };
  }
}

export async function leaveRoom(roomId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { error: "Unauthorized." };
    }

    const membership = await prisma.roomMember.findUnique({
      where: {
        roomId_userId: {
          roomId,
          userId: session.user.id,
        },
      },
      include: { room: true },
    });

    if (!membership) {
      return { error: "You are not a member of this room." };
    }

    if (membership.room.ownerId === session.user.id) {
      return {
        error:
          "The Owner cannot leave the room without transferring ownership first.",
      };
    }

    await prisma.roomMember.delete({
      where: { id: membership.id },
    });

    revalidatePath(`/rooms/${roomId}/members`);
    revalidatePath(`/rooms/${roomId}`);
    revalidatePath("/(dashboard)", "layout");

    return { success: true };
  } catch (error) {
    console.error("Failed to leave room:", error);
    return { error: "An unexpected error occurred while leaving the room." };
  }
}
