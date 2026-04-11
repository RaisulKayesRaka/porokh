"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import {
  createRoomSchema,
  CreateRoomInput,
  editRoomSchema,
  EditRoomInput,
  joinRoomSchema,
  JoinRoomInput,
} from "@/lib/validations/room";
import { revalidatePath } from "next/cache";


function generateRoomCode(length = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function createRoom(data: CreateRoomInput) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { error: "Unauthorized. You must be logged in to create a room." };
    }

    const parsedData = createRoomSchema.safeParse(data);

    if (!parsedData.success) {
      return { error: "Invalid form data. Please check your inputs." };
    }

    const { name, description } = parsedData.data;

    // Generate a unique room code
    let roomCode = generateRoomCode();
    let isUnique = false;

    // Simple retry mechanism for unique room code collision
    while (!isUnique) {
      const existingRoom = await prisma.room.findUnique({
        where: { roomCode },
      });
      if (!existingRoom) {
        isUnique = true;
      } else {
        roomCode = generateRoomCode();
      }
    }

    const room = await prisma.$transaction(async (tx) => {
      // Create the room
      const newRoom = await tx.room.create({
        data: {
          name,
          description,
          roomCode,
          ownerId: session.user.id,
        },
      });

      // Add the creator as an EXAMINER to the room members
      await tx.roomMember.create({
        data: {
          roomId: newRoom.id,
          userId: session.user.id,
          role: "EXAMINER",
        },
      });

      return newRoom;
    });

    revalidatePath("/(dashboard)", "layout");

    return { success: true, room };
  } catch (error) {
    console.error("Failed to create room:", error);
    return { error: "An unexpected error occurred while creating the room." };
  }
}

export async function joinRoom(data: JoinRoomInput) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { error: "Unauthorized. You must be logged in to join a room." };
    }

    const parsedData = joinRoomSchema.safeParse(data);

    if (!parsedData.success) {
      return { error: "Invalid form data. Please check your inputs." };
    }

    const { roomCode } = parsedData.data;

    // Find the room by code
    const room = await prisma.room.findUnique({
      where: { roomCode },
    });

    if (!room) {
      return { error: "No room found with that code." };
    }

    // Check if user is already a member
    const existingMembership = await prisma.roomMember.findUnique({
      where: {
        roomId_userId: {
          roomId: room.id,
          userId: session.user.id,
        },
      },
    });

    if (existingMembership) {
      return {
        success: true,
        room,
        message: "You are already a member of this room.",
      };
    }

    // Add user as an EXAMINEE
    await prisma.roomMember.create({
      data: {
        roomId: room.id,
        userId: session.user.id,
        role: "EXAMINEE",
      },
    });

    revalidatePath("/(dashboard)", "layout");

    return { success: true, room, message: "Successfully joined the room!" };
  } catch (error) {
    console.error("Failed to join room:", error);
    return { error: "An unexpected error occurred while joining the room." };
  }
}

export async function resetRoomCode(roomId: string) {
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

    // Both Owner and Examiner can reset the room code
    // The owner of the room doesn't strictly need to be an EXAMINER member if they created it and left or their role changed,
    // though the current system guarantees the creator is an EXAMINER. We'll check both.
    const isOwner = membership?.room?.ownerId === session.user.id;
    const isExaminer = membership?.role === "EXAMINER";

    if (!membership || (!isOwner && !isExaminer)) {
      return { error: "You don't have permission to reset the room code." };
    }

    let roomCode = generateRoomCode();
    let isUnique = false;

    while (!isUnique) {
      const existingRoom = await prisma.room.findUnique({
        where: { roomCode },
      });
      if (!existingRoom) {
        isUnique = true;
      } else {
        roomCode = generateRoomCode();
      }
    }

    await prisma.room.update({
      where: { id: roomId },
      data: { roomCode },
    });

    revalidatePath(`/rooms/${roomId}`);
    return { success: true, roomCode };
  } catch (error) {
    console.error("Failed to reset room code:", error);
    return {
      error: "An unexpected error occurred while resetting the room code.",
    };
  }
}

export async function editRoom(data: EditRoomInput) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { error: "Unauthorized. You must be logged in to edit a room." };
    }

    const parsedData = editRoomSchema.safeParse(data);

    if (!parsedData.success) {
      return { error: "Invalid form data. Please check your inputs." };
    }

    const { roomId, name, description } = parsedData.data;

    // Check permissions
    const membership = await prisma.roomMember.findUnique({
      where: {
        roomId_userId: {
          roomId,
          userId: session.user.id,
        },
      },
      include: { room: true },
    });

    const isOwner = membership?.room?.ownerId === session.user.id;
    const isExaminer = membership?.role === "EXAMINER";

    if (!membership || (!isOwner && !isExaminer)) {
      return { error: "You don't have permission to edit this room." };
    }

    const updatedRoom = await prisma.room.update({
      where: { id: roomId },
      data: {
        name,
        description,
      },
    });

    revalidatePath(`/rooms/${roomId}`);
    revalidatePath("/(dashboard)", "layout"); // Also invalidate dashboard to update room cards

    return { success: true, room: updatedRoom };
  } catch (error) {
    console.error("Failed to edit room:", error);
    return { error: "An unexpected error occurred while editing the room." };
  }
}

export async function deleteRoom(roomId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { error: "Unauthorized. You must be logged in to delete a room." };
    }

    // Check permissions
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        exams: {
          include: {
            questions: true,
            submissions: {
              include: { answers: true }
            }
          }
        }
      }
    });

    if (!room) {
      return { error: "Room not found." };
    }

    if (room.ownerId !== session.user.id) {
      return { error: "Only the creator of the room can delete it." };
    }



    // Prisma onDelete: Cascade will handle deleting roomMembers automatically
    await prisma.room.delete({
      where: { id: roomId },
    });

    revalidatePath("/(dashboard)", "layout");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete room:", error);
    return { error: "An unexpected error occurred while deleting the room." };
  }
}

export async function getRoomBrief(roomId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const room = await prisma.room.findUnique({
      where: { id: roomId },
      select: { name: true },
    });

    let role = null;
    if (session?.user && room) {
      const membership = await prisma.roomMember.findUnique({
        where: {
          roomId_userId: {
            roomId,
            userId: session.user.id,
          },
        },
        select: { role: true },
      });
      if (membership) {
        role = membership.role;
      }
    }

    return { success: true, room, role };
  } catch {
    return { error: "Failed to fetch room details" };
  }
}
