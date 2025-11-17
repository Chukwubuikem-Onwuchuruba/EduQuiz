import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export default async function ForgotPassword() {
  const session = await getAuthSession();

  if (session?.user) {
    redirect("/dashboard");
  }

  return <ForgotPasswordForm />;
}
