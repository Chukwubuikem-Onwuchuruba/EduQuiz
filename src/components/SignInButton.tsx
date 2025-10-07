// "use client";

// import React from "react";
// import { Button } from "./ui/button";
// import { signIn } from "next-auth/react";

// type Props = {
//   text: string;
// };

// const SignInButton = ({ text }: Props) => {
//   return (
//     <Button onClick={() => signIn("google").catch(console.error)}>
//       {text}
//     </Button>
//   );
// };

// export default SignInButton;
"use client";

import React from "react";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

type Props = {
  text: string;
  provider?: "google" | "credentials";
};

const SignInButton = ({ text, provider = "google" }: Props) => {
  const router = useRouter();

  const handleSignIn = async () => {
    if (provider === "google") {
      await signIn("google", { callbackUrl: "/dashboard" });
    } else {
      router.push("/auth/signin");
    }
  };

  return <Button onClick={handleSignIn}>{text}</Button>;
};

export default SignInButton;
