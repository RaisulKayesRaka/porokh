import { Metadata } from "next";
import SignupClientPage from "./client";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create your Porokh account",
};

export default function SignupPage() {
  return <SignupClientPage />;
}
