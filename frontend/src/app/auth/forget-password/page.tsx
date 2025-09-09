"use client";

import { useState, useRef, useEffect } from "react";
import Button from "@/component/Button";
import InputField from "@/component/InputField";
import PasswordField from "@/component/PasswordField";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineMail } from "react-icons/ai";
import { validateEmail, validatePassword } from "../../../../utils/validators";
import { HtmlContext } from "next/dist/server/route-modules/pages/vendored/contexts/entrypoints";

export default function ForgetPassword() {
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");

  const [formData, setFormData] = useState({
    email: "",
    otp: Array(5).fill(""),
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleOtpChange = (val: string, index: number) => {
    if (/[^0-9]/.test(val)) return;
    const otpArray = [...formData.otp];
    otpArray[index] = val.slice(-1);

    setFormData((prev) => ({ ...prev, otp: otpArray }));

    if (val && index < 4) otpRefs.current[index + 1]?.focus();
    if (!val && index > 0) otpRefs.current[index - 1]?.focus();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;
    if (name === "email") {
      formattedValue = value.trim().toLowerCase();
    }
    setFormData((prev) => ({ ...prev, [name]: formattedValue }));

    let error = "";
    if (name === "email") error = validateEmail(formattedValue) ?? "";
    if (name === "password") error = validatePassword(value) ?? "";
    if (name === "confirmPassword")
      error = value !== formData.password ? "Passwords do not match" : "";

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const otpPaste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 5);
    if (!otpPaste) return;
    const otpArray = otpPaste.split("");
    while (otpArray.length < 5) otpArray.push("");
    setFormData((prev) => ({ ...prev, otp: otpArray }));
    const lastIndex = Math.min(otpPaste.length - 1, 4);
    otpRefs.current[lastIndex]?.focus();
  }

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !formData.otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 4) {
      otpRefs.current[index + 1]?.focus();
    }
  }

  useEffect(()=>{
    if(step === "email"){
      document.querySelector<HTMLInputElement>('input[name="email"]')?.focus();
    }
    if(step === "otp"){
      otpRefs.current[0]?.focus();
    }
    if(step === "reset"){
      document.querySelector<HTMLInputElement>('input[name="password"]')?.focus();
    }
  },[step])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (step === "email") {
      const emailError = validateEmail(formData.email);
      if (emailError) {
        setErrors({ email: emailError });
        return;
      }
      console.log("Send OTP to:", formData.email);
      setStep("otp");
      return;
    }

    if (step === "otp") {
      const otpValue = formData.otp.join("");
      if (otpValue.length !== 5) {
        setErrors({ otp: "Enter a valid 5-digit OTP" });
        return;
      }
      console.log("Verify OTP:", otpValue);
      setStep("reset");
      return;
    }

    if (step === "reset") {
      const passwordError = validatePassword(formData.password);
      const confirmError =
        formData.password !== formData.confirmPassword
          ? "Passwords do not match"
          : "";

      if (passwordError || confirmError) {
        setErrors({
          password: passwordError ?? "",
          confirmPassword: confirmError ?? "",
        });
        return;
      }

      console.log("Reset password:", formData.password);

      setFormData({
        email: "",
        otp: Array(5).fill(""),
        password: "",
        confirmPassword: "",
      });
      setErrors({});
      setStep("email");
    }
  };

  return (
    <div className=" flex flex-col md:flex-row min-h-screen items-center justify-center">
      {/* Left Side */}
      <div className="md:w-1/2 hidden md:flex items-center justify-center bg-blue-50 min-h-screen">
        <div className="text-center">
          <Image
            src="/images/forget-password.png"
            alt="Forget Password"
            width={400}
            height={300}
            className="mx-auto w-3/4 h-auto"
          />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Reset Your Password
          </h2>
          <p className="text-sm lg:text-base text-gray-600 lg:mx-10">
            Follow the steps to recover access to your account.{" "}
            <span className="font-bold text-blue-400 cursor-pointer">
              Stay secure
            </span>
            .
          </p>
        </div>
      </div>

      {/* Right Side (Form) */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-white px-4 lg:px-8">
        <div className="items-center md:hidden shadow-sm  rounded-full bg-cyan-50  pb-2 mb-3" >
          <Image
            src="/images/lock.png"
            alt="Forget Password"
            width={175}
            height={200}
            className="mx-auto h-auto"
          />
        </div>
        <div className="w-full max-w-md">
          <h1 className="text-2xl xl:text-4xl font-bold text-gray-900">
            {step === "email"
              ? "Forgot Your Password?"
              : step === "otp"
                ? "Verify with OTP"
                : "Create New Password"}
          </h1>
          <p className="text-gray-400 py-1.5 text-sm lg:text-base">{step === "email"
            ? "Enter your email we can send OTP ..."
            : step === "otp"
              ? "Please enter the OTP sent to your register email below ..."
              : "Please kindly set your new password ..."}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === "email" && (
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
            )}

            {step === "otp" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter OTP
                </label>
                <div className="flex justify-center space-x-2.5 lg:space-x-3.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <input
                      key={i}
                      ref={(el) => {
                        otpRefs.current[i] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      className={`w-12 h-12 lg:w-15 lg:h-15 text-center text-black border rounded-md text-lg focus:ring focus:outline-none 
                       ${errors.otp ? "border-red-500 " : "border-gray-200"}`}
                      onPaste={i === 0 ? handleOtpPaste : undefined}
                      onKeyDown={(e) => handleOtpKeyDown(e, i)}
                      value={formData.otp[i]}
                      onChange={(e) => handleOtpChange(e.target.value, i)}
                    />
                  ))}

                </div>
                {errors.otp && (
                  <p className="mt-2 text-sm text-red-600">{errors.otp}</p>
                )}
              </div>
            )}

            {step === "reset" && (
              <>
                <PasswordField
                  label="New Password"
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
              </>
            )}

            <Button
              type="submit"
              text={
                step === "email"
                  ? "Send OTP"
                  : step === "otp"
                    ? "Verify OTP"
                    : "Reset Password"
              }
            />
          </form>

          <p className="mt-6 text-center text-gray-600 text-sm">
            Remember your password?{" "}
            <Link href="/auth/login" className="text-blue-500 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
