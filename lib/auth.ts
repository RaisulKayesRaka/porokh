import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignIn: true,
    autoSignInAfterVerification: false,
  },
  user: {
    deleteUser: {
      enabled: true,
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  plugins: [
    emailOTP({
      sendVerificationOnSignUp: true,
      overrideDefaultEmailVerification: true,
      otpLength: 6,
      expiresIn: 600,
      changeEmail: {
        enabled: true,
      },
      async sendVerificationOTP({ email, otp, type }) {
        let subject: string;
        let heading: string;
        let message: string;

        if (type === "email-verification") {
          subject = "Verify your email — Porokh";
          heading = "Verify your email";
          message =
            "Use the code below to verify your email address on Porokh.";
        } else if (type === "forget-password") {
          subject = "Reset your password — Porokh";
          heading = "Reset your password";
          message =
            "Use the code below to reset your password. This code expires in 10 minutes.";
        } else {
          subject = "Your verification code — Porokh";
          heading = "Your verification code";
          message = "Use the code below to complete your request on Porokh.";
        }

        await sendEmail({
          to: email,
          subject,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
              <h2 style="color: #111; margin-bottom: 16px;">${heading}</h2>
              <p style="color: #555; line-height: 1.6;">${message}</p>
              <div style="margin: 24px 0; padding: 20px; background-color: #f5f5f5; border-radius: 8px; text-align: center;">
                <span style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #111;">${otp}</span>
              </div>
              <p style="color: #999; font-size: 13px; line-height: 1.5;">
                If you didn't request this code, you can safely ignore this email.
              </p>
            </div>
          `,
        });
      },
    }),
  ],
});
