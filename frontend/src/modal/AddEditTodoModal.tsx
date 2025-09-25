'use client';
import React, { useRef, useState, useEffect } from "react";
import { IoIosCalendar } from "react-icons/io";
import { AiOutlineCalendar, AiOutlineLoading3Quarters } from "react-icons/ai";
import { BiTask } from "react-icons/bi";
import dynamic from "next/dynamic";
import InputField from "@/component/InputField";
import { RichTextEditorHandle } from "@/component/RichTextEditor";
import { validateDate, validateDescription, validateExpireAt, validatePriority, validateTitle } from "../../utils/validators";
import AddEditTodoModalProps from "@/interface/AddEditToDoModalProps";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { addTodo, editTodo } from "@/features/todoSlice";
import ConfirmModal from "./DeleteTodoModal";
import { toast } from "react-toastify";
import { formatDateForInput } from "../../utils/dateUtils";

const RichTextEditor = dynamic(() => import("@/component/RichTextEditor"), {
    ssr: false,
});

export default function AddEditTodoModal({ isOpen, onClose, onSave, task }: AddEditTodoModalProps) {
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error } = useSelector((state: RootState) => state.todos);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
    const [formData, setFormData] = useState({
        title: "",
        date: "",
        priority: "",
        expireAt: ""
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const descriptionRef = useRef<RichTextEditorHandle>(null);

    const resetForm = () => {
        setFormData({ title: "", date: "", priority: "", expireAt: "" });
        setErrors({});
        descriptionRef.current?.setContent("");
    };

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title,
                date: task.date ? formatDateForInput(task.date) : "",
                priority: task.priority,
                expireAt: task.expireAt ? formatDateForInput(task.expireAt) : ""
            });
        } else {
            resetForm();
        }
    }, [task, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
        let error = "";
        if (name === "title") error = validateTitle(value) || "";
        if (name === "date") error = validateDate(value) || "";
        if (name === "priority") error = validatePriority(value) || "";
        if (name === "expireAt") error = validateExpireAt(formData.expireAt, formData.date) || "";
        setErrors((prev) => ({ ...prev, [name]: error }));

    }

    const handleAdd = async () => {
        try {
            const { title, date, priority, expireAt } = formData;
            const description = descriptionRef.current?.getContent() || "";

            await dispatch(addTodo({
                title,
                description,
                date,
                priority: priority as "Extreme" | "Moderate" | "Low",
                expireAt: expireAt || undefined
            })).unwrap();
            toast.success("Task added successfully!");
            resetForm();
            onClose();
        } catch (err) {
            toast.error("Failed to add task");
        }
    }

    const handleEdit = async () => {
        if (!task) return;
        try {
            const { title, date, priority, expireAt } = formData;
            const description = descriptionRef.current?.getContent() || "";

            await dispatch(editTodo({
                id: task._id,
                todoData: {
                    title,
                    description,
                    date,
                    priority: priority as "Extreme" | "Moderate" | "Low",
                    expireAt: expireAt || undefined
                }
            })).unwrap();

            resetForm();
            onClose();
            if (onSave) {
                onSave({
                    ...task,
                    title,
                    description,
                    date,
                    priority: priority as "Extreme" | "Moderate" | "Low",
                    expireAt: expireAt || undefined
                });
            }
        } catch (err) {
            toast.error("Failed to update task");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: { [key: string]: string } = {};
        const { title, date, priority } = formData;
        const rawDesc = descriptionRef.current?.getContent() || '';
        const description = rawDesc;
        const plainText = description.replace(/<(.|\n)*?>/g, '').trim();

        const titleError = validateTitle(title);
        const dateError = validateDate(date);
        const expireAtError = validateExpireAt(formData.expireAt, date);
        const priorityError = validatePriority(priority);
        const descError = validateDescription(plainText);

        if (titleError) newErrors.title = titleError;
        if (dateError) newErrors.date = dateError;
        if (priorityError) newErrors.priority = priorityError;
        if (descError) newErrors.description = descError;
        if (expireAtError) newErrors.expireAt = expireAtError;

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        if (task) {
            setShowConfirmModal(true);
        } else {
            await handleAdd();
        }
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl mx-4 px-6 py-4 relative overflow-y-auto max-h-[90vh]">
                {/* Close */}
                <button
                    onClick={handleClose}
                    className="absolute top-7 right-7 text-sm text-black font-medium hover:underline cursor-pointer"
                >
                    Go Back
                </button>

                {/* Heading */}
                <h2 className="text-lg sm:text-xl font-semibold mb-2 text-gray-700 lg:mb-4">
                    {task ? (
                        <span className="hover:underline underline-offset-4 decoration-blue-600 decoration-2 cursor-pointer"><span className="underline decoration-blue-600">Edit</span> Task</span>
                    ) : (
                        <span className="hover:underline underline-offset-4 decoration-blue-600 decoration-2 cursor-pointer"><span className="underline decoration-blue-600">Add Ne</span>w Task</span>
                    )}
                </h2>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-2 lg:gap-3">
                    {/* Title */}
                    <InputField
                        label="Title"
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter task title"
                        error={errors.title}
                        icon={<BiTask />}
                    />

                    {/* Date */}
                    <InputField
                        label="Date"
                        type="datetime-local"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Select a date"
                        error={errors.date}
                        icon={<AiOutlineCalendar />}
                    />

                    <InputField
                        label="Expire Time"
                        type="datetime-local"
                        name="expireAt"
                        value={formData.expireAt}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Set expiry time"
                        error={errors.expireAt}
                        icon={<IoIosCalendar />}
                    />

                    {/* Priority */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-0.5 text-sm">
                            Priority
                        </label>
                        <div className="flex gap-4 lg:gap-6">
                            {["Extreme", "Moderate", "Low"].map((level) => (
                                <label key={level} className="flex items-center gap-1 text-xs text-gray-500 md:gap-2 md:text-sm">
                                    <span
                                        className={`w-2 h-2 rounded-full md:w-3 md:h-3 ${level === "Extreme"
                                            ? "bg-red-500"
                                            : level === "Moderate"
                                                ? "bg-blue-500"
                                                : "bg-green-500"
                                            }`}
                                    />
                                    {level}
                                    <input
                                        type="radio"
                                        name="priority"
                                        value={level}
                                        checked={formData.priority === level}
                                        onChange={handleChange}
                                    />
                                </label>
                            ))}
                        </div>
                        {errors.priority && <p className="text-red-500 text-xs">{errors.priority}</p>}
                    </div>

                    {/* Description */}
                    <div className="!text-black">
                        <label className="block text-gray-700 font-medium mb-1 text-sm">
                            Task Description
                        </label>
                        <RichTextEditor ref={descriptionRef} value={task?.description || ""} />
                        {errors.description && (
                            <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                        )}
                    </div>
                    {error && (
                        <p className="text-red-500 text-sm mb-2">⚠️ {error}</p>
                    )}

                    {/* Submit */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="px-5 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 cursor-pointer"
                        >
                            {loading ? (
                                <AiOutlineLoading3Quarters className="animate-spin" />
                            ) : task ? (
                                "Update"
                            ) : (
                                "Add"
                            )}

                        </button>
                    </div>
                </form>
            </div>
            {showConfirmModal && (
                <ConfirmModal
                    isOpen={showConfirmModal}
                    onClose={() => setShowConfirmModal(false)}
                    onConfirm={async () => {
                        await handleEdit();
                        setShowConfirmModal(false);
                    }}
                    title="Confirm Update"
                    message={`Are you sure you want to update "${formData.title}"?`}
                    confirmText="Yes, Update"
                    cancelText="Cancel"
                />
            )}
        </div>

    );
}
