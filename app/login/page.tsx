import { Metadata } from "next";
import LoginClientPage from "./client";

export const metadata: Metadata = {
  title: "Login | Porokh",
  description: "Login to your Porokh account",
};

export default function LoginPage() {
  return <LoginClientPage />;
}
