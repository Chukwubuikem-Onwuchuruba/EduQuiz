import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import SignInForm from "@/components/auth/SignInForm";

export default async function SignIn() {
  const session = await getAuthSession();

  if (session?.user) {
    redirect("/dashboard");
  }

  return <SignInForm />;
}
