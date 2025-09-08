"use client";

import { useState } from "react";
import { InputFieldProps } from "@/interface/InputFieldProps";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineLock } from "react-icons/ai";

export default function PasswordField({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <label htmlFor={name} className="block text-gray-700 mb-1 font-medium">
        {label}
      </label>

      <div className="relative">
        <input
          id={name}
          name={name}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`peer w-full px-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 ${
            error ? "border-red-500" : "border-gray-200"
          }`}
        />

        <div
          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
            error ? "text-red-500" : "text-gray-400 peer-focus:text-blue-500"
          }`}
        >
          <AiOutlineLock />
        </div>

        <div
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          {showPassword ? <AiOutlineEye /> :  <AiOutlineEyeInvisible />}
        </div>
      </div>

      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
    </div>
  );
}
