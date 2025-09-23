"use client";
import Link from "next/link";
import Image from "next/image";
import PublicRoute from "@/component/PublicRoute";

export default function Home() {
  return (
    <PublicRoute>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-8">
        <div className="mb-8">
          <Image
            src="/images/todo.png"
            alt="Todo Illustration"
            width={150}
            height={100}
          />
        </div>

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl xl:text-5xl font-bold text-blue-700 mb-4 text-center">
          Welcome to Todo App
        </h1>

        <p className="text-gray-600 text-center mb-6 max-w-md text-sm sm:text-base md:text-lg">
          Organize your tasks, set reminders, and stay productive.
          Sign up or log in to get started!
        </p>


        {/* Action Buttons */}
        <div className="flex flex-row gap-4">
          <Link
            href="/signup"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Sign Up
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200 transition"
          >
            Log In
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-7 text-gray-400 text-sm text-center">
          Small steps every day lead to big achievements ❤️.
        </div>
      </div>
    </PublicRoute>
  );
}
