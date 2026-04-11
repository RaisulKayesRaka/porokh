import { Metadata } from "next";
import ForgotPasswordClient from "./client";

export const metadata: Metadata = {
  title: "Forgot Password | Porokh",
  description: "Reset your Porokh account password",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordClient />;
}
