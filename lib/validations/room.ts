import { z } from "zod";

export const createRoomSchema = z.object({
  name: z
    .string()
    .min(3, "Room name must be at least 3 characters")
    .max(50, "Room name cannot exceed 50 characters"),
  description: z
    .string()
    .max(70, "Description cannot exceed 70 characters")
    .optional(),
});

export type CreateRoomInput = z.infer<typeof createRoomSchema>;

export const editRoomSchema = createRoomSchema.extend({
  roomId: z.string(),
});

export type EditRoomInput = z.infer<typeof editRoomSchema>;

export const joinRoomSchema = z.object({
  roomCode: z
    .string()
    .length(6, "Room code must be exactly 6 characters")
    .toUpperCase(),
});

export type JoinRoomInput = z.infer<typeof joinRoomSchema>;
