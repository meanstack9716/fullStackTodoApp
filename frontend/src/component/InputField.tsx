"use client";

import { InputFieldProps } from "@/interface/InputFieldProps";

export default function InputField({
    label,
    type = "text",
    name,
    value,
    onChange,
    placeholder,
    icon,
    error,
}: InputFieldProps) {
    return (
        <div>
            <label
                htmlFor={name}
                className="block text-gray-700 mb-1 font-medium"
            >
                {label}
            </label>

            <div className="relative">
                <input
                    id={name}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`peer w-full px-10 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500 text-gray-600 ${error ? "border-red-500" : "border-gray-200"
                        }`}
                />

                {icon && (
                    <div
                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${error
                            ? "text-red-500"
                            : "text-gray-400 peer-focus:text-blue-500"
                            }`}
                    >
                        {icon}
                    </div>
                )}
            </div>

            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        </div>
    );
}
