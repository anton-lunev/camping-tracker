import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 bg-[url(/bg.jpeg)] bg-cover bg-center">
      <div className="w-fit h-fit  backdrop-blur-lg rounded-xl shadow-lg">
        <SignUp
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
