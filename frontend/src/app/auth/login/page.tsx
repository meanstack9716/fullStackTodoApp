"use client";

import Button from "@/component/Button";
import InputField from "@/component/InputField";
import PasswordField from "@/component/PasswordField";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AiOutlineMail } from "react-icons/ai";
import { validateEmail, validatePassword } from "../../../../utils/validators";

export default function Login() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        let errorMsg = "";
        if (name === "email") {
            errorMsg = validateEmail(value) ?? "";
        } else if (name === "password") {
            errorMsg = validatePassword(value) ?? "";
        }

        setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: { email?: string; password?: string } = {};
        const emailError = validateEmail(formData.email);
        const passwordError = validatePassword(formData.password);
        if (emailError) newErrors.email = emailError;
        if (passwordError) newErrors.password = passwordError;

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;

        console.log("Login data:", formData);
    };


    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            <div className="md:w-1/2 hidden md:flex items-center justify-center bg-blue-50 p-8">
                <div className="text-center">
                    <Image
                        src="/images/login.png"
                        alt="login image"
                        width={400}
                        height={300}
                        className="mx-auto w-3/4 h-auto"
                    />

                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Stay Organized</h2>
                    <p className="text-sm lg:text-base text-gray-600 lg:mx-10">
                        Achieve more, stress less. <span className="font-bold text-blue-400 cursor-pointer">Log in</span> to your To-Do App and unlock your full productivity potential
                    </p>
                </div>
            </div>

            <div className="md:w-1/2 flex items-center justify-center bg-white p-8">
                <div className="w-full max-w-md">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome Back</h1>
                    <p className="text-gray-600 mb-6">
                        Login to manage your tasks and stay productive
                    </p>

                    <form onSubmit={handleLogin} className="space-y-4">

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


                        <div className="text-right">
                            <Link href="/auth/forget-password" className="text-sm text-blue-500 hover:underline">
                                Forgot password?
                            </Link>
                        </div>

                        <Button type="submit" text="Login" />
                    </form>

                    <p className="mt-6 text-center text-gray-600 text-sm">
                        Do not have an account?{" "}
                        <Link href="/auth/signup" className="text-blue-500 hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
