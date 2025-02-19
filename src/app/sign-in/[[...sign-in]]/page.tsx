import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In - Camping Tracker",
};

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 bg-[url(/bg.jpeg)] bg-cover bg-center">
      <div className="h-fit w-fit rounded-xl shadow-lg backdrop-blur-lg">
        <SignIn
          appearance={{
            variables: {
              colorBackground: "rgba(30,41,57,0.80)",
            },
          }}
        />
      </div>
    </div>
  );
}
