"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function verifyUserPassword(password: string) {
  try {
    await auth.api.verifyPassword({
      body: { password },
      headers: await headers(),
    });
    return { success: true };
  } catch {
    return { success: false, error: "Incorrect password." };
  }
}
