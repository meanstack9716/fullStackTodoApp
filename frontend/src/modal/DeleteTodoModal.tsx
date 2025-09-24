'use client';
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";
import ConfirmModalProps from "@/interface/ConfirmModalProps";

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Action",
    message = "Are you sure you want to proceed?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    loading = false,
}: ConfirmModalProps) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 px-6 py-4 relative">
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 text-sm text-gray-600 hover:text-gray-900"
                >
                    <RxCross2 className="w-5 h-5 cursor-pointer" />
                </button>

                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                    {title}
                </h2>
                <p className="text-gray-600 mb-4 text-xs sm:text-base sm:mb-6">{message}</p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-300 cursor-pointer"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 cursor-pointer"
                    >
                        {loading ? <AiOutlineLoading3Quarters className="animate-spin" /> : (confirmText)}

                    </button>
                </div>
            </div>
        </div>
    );
}
