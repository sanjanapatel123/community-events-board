import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Create account",
};

export default function SignupPage() {
  return (
    <AuthShell
      title="Find your people."
      description="Save your interests. Discover something nearby."
    >
      <SignupForm />
    </AuthShell>
  );
}
