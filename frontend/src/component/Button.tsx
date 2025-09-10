"use client";

import ButtonProps from "@/interface/ButtonProps";
export default function Button({
    text,
    type = "button",
    onClick,
    className = "",
}: ButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`w-full bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer ${className}`}
        >
            {text}
        </button>
    );
}
