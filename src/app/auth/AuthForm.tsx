"use client";

import { InputHTMLAttributes, useState } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

function Input({ id, label, ...props }: InputProps) {
  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-500/60 placeholder-gray-400 text-white bg-gray-800/40 focus:outline-hidden focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
        placeholder={label}
        {...props}
      />
    </div>
  );
}

type AuthForm = {
  onSignIn: (formData: FormData) => void | Promise<void>;
  onSignUp: (formData: FormData) => void | Promise<void>;
};
export default function AuthForm({ onSignIn, onSignUp }: AuthForm) {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form className="mt-8 space-y-6">
      <Input
        id="email"
        type="email"
        name="email"
        label="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        id="password"
        type="password"
        name="password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <div>
        <button
          type="submit"
          formAction={isSignIn ? onSignIn : onSignUp}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isSignIn ? "Sign In" : "Sign Up"}
        </button>
      </div>
      <div className="text-sm text-center">
        <button
          type="button"
          onClick={() => setIsSignIn(!isSignIn)}
          className="font-medium text-indigo-400 hover:text-indigo-300"
        >
          {isSignIn
            ? "Need an account? Sign Up"
            : "Already have an account? Sign In"}
        </button>
      </div>
    </form>
  );
}
