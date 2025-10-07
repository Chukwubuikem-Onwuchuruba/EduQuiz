// import SignInButton from "@/components/SignInButton";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { getAuthSession } from "@/lib/nextauth";
// import { redirect } from "next/navigation";

// export default async function Home() {
//   const session = await getAuthSession();
//   if (session?.user) {
//     // means the user is logged in
//     redirect("/dashboard");
//   }
//   return (
//     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
//       <Card className="w-[300px]">
//         <CardHeader>
//           <CardTitle>Welcome to EduQuiz</CardTitle>
//           <CardDescription>This is an app to practice quizzes.</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <SignInButton text="Sign in with Google" />
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getAuthSession();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Welcome to EduQuiz</CardTitle>
          <CardDescription>
            Practice and master your knowledge with interactive quizzes.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Link href="/auth/signup" className="w-full">
            <Button className="w-full">Create an Account</Button>
          </Link>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>
          <Link href="/auth/signin" className="w-full">
            <Button variant="outline" className="w-full">
              Sign In
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
