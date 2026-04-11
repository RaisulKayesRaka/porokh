import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  updateUser,
  changePassword,
  deleteUser,
  emailOtp,
} = createAuthClient({
  plugins: [emailOTPClient()],
});
