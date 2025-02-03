import { login, signup } from "./actions";
import AuthForm from "@/app/auth/AuthForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 bg-[url(/bg.jpeg)] bg-cover bg-center">
      <div className="max-w-md w-full space-y-8 p-8 bg-gray-800/70 backdrop-blur-lg rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-white">Welcome</h2>
          <p className="mt-2 text-sm text-gray-300">
            Sign in to your account or create a new one
          </p>
        </div>
        <AuthForm onSignInAction={login} onSignUpAction={signup} />
      </div>
    </div>
  );
}
