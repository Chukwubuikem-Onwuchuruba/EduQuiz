import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import SignUpForm from "@/components/auth/SignUpForm";

export default async function SignUp() {
  const session = await getAuthSession();

  if (session?.user) {
    redirect("/dashboard");
  }

  return <SignUpForm />;
}
