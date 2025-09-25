"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { validateEmail } from "../../../utils/validators";
import { useRouter } from "next/navigation";
import Button from "@/component/Button";
import InputField from "@/component/InputField";
import PasswordField from "@/component/PasswordField";
import { loginUser } from "@/features/authSlice";
import { AppDispatch, RootState } from "@/store/store";
import { AiOutlineLoading3Quarters, AiOutlineMail } from "react-icons/ai";
import PublicRoute from "@/component/PublicRoute";

export default function Login() {
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error } = useSelector((state: RootState) => state.auth);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});
    const router = useRouter();
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setTouched((prev) => ({ ...prev, [name]: true }));
        let error = "";
        if (name === "email") error = validateEmail(value) ?? "";
        if (name === "password" && !value) error = "Password is required";

        setErrors((prev) => ({ ...prev, [name]: error }));
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: { email?: string; password?: string } = {};
        const emailError = validateEmail(formData.email);
        if (emailError) newErrors.email = emailError;
        if (!formData.password) {
            newErrors.password = "Password is required";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                await dispatch(loginUser({
                    email: formData.email,
                    password: formData.password
                })).unwrap();
                router.push('/pages/dashboard')
                setFormData({
                    email: "",
                    password: "",
                });
                console.log("Login data:", formData);
            } catch (err) {
                console.error("login failed:", err);
            }
        };


    };

    return (
        <PublicRoute>
            <div className="min-h-screen flex flex-col md:flex-row justify-center">
                <div className="md:w-1/2 hidden md:flex items-center justify-center bg-blue-50 min-h-screen">
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

                <div className="md:w-1/2 flex justify-center items-center bg-white">
                    <div className="w-full max-w-md">
                        <div className="flex flex-col md:hidden justify-center items-center w-full mt-5">
                            <Image
                                src="/images/mobile-login.png"
                                alt="login image"
                                width={80}
                                height={80}
                                className="mx-auto"
                            />

                            <h1 className="text-3xl font-bold text-blue-500 font-serif text-center">
                                <span className="underline decoration-blue-400 decoration-2 underline-offset-4">
                                    To-Do
                                </span>
                                App
                            </h1>
                            <p className="text-gray-500 text-sm mt-1">
                                Your productivity, simplified.
                            </p>
                        </div>
                        <div className="px-5 py-2">
                            <h1 className="text-4xl font-bold text-gray-900 mb-1 md:mb-4">Welcome Back</h1>
                            <p className="text-sm text-gray-400 mb-3 md:mb-6">
                                Login to manage your tasks and stay productive
                            </p>

                            <form onSubmit={handleLogin} className="space-y-4">

                                <InputField
                                    label="Email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="you@example.com"
                                    error={errors.email}
                                    icon={<AiOutlineMail />}
                                />

                                <PasswordField
                                    label="Password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="••••••••"
                                    error={errors.password}
                                />

                                <div className="text-right">
                                    <Link href="/forget-password" className="text-sm text-blue-500 hover:underline">
                                        Forgot password?
                                    </Link>
                                </div>

                                {error && <p className="text-red-500 text-sm mb-2.5 -mt-4">{error}</p>}

                                <Button type="submit"
                                    className="py-2 flex items-center justify-center"
                                    text={
                                        loading ? (<AiOutlineLoading3Quarters className="animate-spin" />) : ("Sign In")
                                    } disabled={loading} />
                            </form>

                            <p className="mt-6 text-center text-gray-600 text-sm">
                                Do not have an account?{" "}
                                <Link href="/signup" className="text-blue-500 hover:underline">
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </PublicRoute>
    );
}
