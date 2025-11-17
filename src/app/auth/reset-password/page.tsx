import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

interface ResetPasswordPageProps {
  searchParams: {
    token?: string;
  };
}

export default async function ResetPassword({
  searchParams,
}: ResetPasswordPageProps) {
  const session = await getAuthSession();

  if (session?.user) {
    redirect("/dashboard");
  }

  // Decode the token
  const token = searchParams.token
    ? decodeURIComponent(searchParams.token)
    : undefined;

  return <ResetPasswordForm token={searchParams.token} />;
}
