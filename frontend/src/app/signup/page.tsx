"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { validateConfirmPassword, validateEmail, validateName, validatePassword, validateUsername } from "../../../utils/validators";
import { AppDispatch, RootState } from "@/store/store";
import { signupUser } from "@/features/authSlice";
import { AiOutlineMail, AiOutlineUser, AiOutlineLoading3Quarters } from "react-icons/ai";
import Button from "@/component/Button";
import InputField from "@/component/InputField";
import PasswordField from "@/component/PasswordField";
import PublicRoute from "@/component/PublicRoute";

export default function Signup() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validators: { [key: string]: (val: string) => string | null } = {
    firstName: (val) => validateName(val, "First Name"),
    lastName: (val) => validateName(val, "Last Name"),
    username: validateUsername,
    email: validateEmail,
    password: validatePassword,
    confirmPassword: (val) => validateConfirmPassword(formData.password, val),
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    const error = validators[name] ? validators[name](value) || "" : "";

    setErrors((prev) => {
      const newErrors = { ...prev, [name]: error };

      if (name === "password" && formData.confirmPassword) {
        newErrors.confirmPassword = validateConfirmPassword(value, formData.confirmPassword) || "";
      }

      return newErrors;
    });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};
    Object.keys(formData).forEach((key) => {
      newErrors[key] = validators[key] ? validators[key](formData[key as keyof typeof formData]) || "" : "";
    });

    setErrors(newErrors);

    if (Object.values(newErrors).every((err) => err === "")) {
      try {
        await dispatch(
          signupUser({
            firstName: formData.firstName,
            lastName: formData.lastName,
            username: formData.username,
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
          })
        ).unwrap();
        router.push('/')
        setFormData({
          firstName: "",
          lastName: "",
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setErrors({});
        console.log("Signup data:", formData);
      } catch (err) {
        console.error("Signup failed:", err);
      }
    }
  };

  return (
    <PublicRoute>
      <div className="min-h-screen flex flex-col md:flex-row">
        <div className="md:w-1/2 flex items-center justify-center bg-white px-5 lg:px-0 py-5">
          <div className="w-full max-w-md">
            <h1 className="text-5xl font-bold text-blue-500 font-[cursive] md:hidden text-center mb-3">
              <span className="underline decoration-blue-400 decoration-2 underline-offset-4">
                To-Do
              </span>
              App
            </h1>

            <h1 className="text-2xl xl:text-4xl font-bold text-gray-900 mb-1 lg:mb-2">Create Account</h1>
            <p className="text-sm xl:text-base text-gray-600 mb-2 lg:mb-4">
              Sign up to manage your tasks and stay productive
            </p>

            <form onSubmit={handleSignup} className="space-y-4">
              <InputField
                label="First Name"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter your first name "
                error={errors.firstName}
                icon={<AiOutlineUser />}
              />

              <InputField
                label="Last Name"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter your last name"
                error={errors.lastName}
                icon={<AiOutlineUser />}
              />

              <InputField
                label="Username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="test12"
                error={errors.username}
                icon={<AiOutlineUser />}
              />

              <InputField
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                error={errors.email}
                icon={<AiOutlineMail />}
              />

              <PasswordField
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                error={errors.password}
              />

              <PasswordField
                label="Confirm Password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                error={errors.confirmPassword}
              />
              {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
              <Button
                type="submit"
                className="py-2 flex items-center justify-center"
                text={
                  loading ? (
                    <AiOutlineLoading3Quarters className="animate-spin" />
                  ) : (
                    "Sign Up"
                  )
                }
                disabled={loading}
              />
            </form>

            <p className="mt-4 text-center text-gray-600 text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-500 hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>

        <div className="md:w-1/2 hidden md:flex items-center justify-center bg-blue-50 px-5">
          <div className="text-center">
            <Image
              src="/images/signUp.png"
              alt="signup image"
              width={300}
              height={100}
              className="mx-auto"
            />
            <h2 className="text-xl xl:text-3xl font-bold text-gray-800 my-2">Plan. Track. Achieve.</h2>
            <p className="text-sm xl:text-base text-gray-600 lg:mx-10">
              Turn your ideas into actions and reach your goals faster. <span className="font-bold text-blue-400 cursor-pointer">Get started</span> now.
            </p>

          </div>
        </div>
      </div>
    </PublicRoute>
  );
}
