'use client';
import React from "react";
import DeleteToDoModalProps from "@/interface/DeleteToDoModalProps";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";
import Button from "@/component/Button";

export default function DeleteToDoModal({
    isOpen,
    onClose,
    onConfirm,
    taskTitle,
}: DeleteToDoModalProps) {
    if (!isOpen) return null;
    const { loading, error } = useSelector((state: RootState) => state.todos);
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 px-6 py-4 relative">
                <Button
                    onClick={onClose}
                    className="absolute top-5 right-5 text-sm text-gray-600 hover:text-gray-900"
                    text={<RxCross2 className="w-5 h-5 cursor-pointer" />}
                />

                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                    Delete Task
                </h2>

                <p className="text-gray-600 mb-4 text-xs sm:text-base sm:mb-6">
                    Are you sure you want to delete{" "}
                    <span className="font-medium text-blue-600">
                        {taskTitle || "this task"}
                    </span>
                    ? This action cannot be undone.
                </p>

                <div className="flex justify-end gap-3">
                    <Button
                        onClick={onClose}
                        className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-300 cursor-pointer"
                        text="Cancel"
                    />
                    <Button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 cursor-pointer"
                        text={loading ? <AiOutlineLoading3Quarters className="animate-spin" /> : "Delete"}
                    />

                </div>
            </div>
        </div>
    );
}
