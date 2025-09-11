import React, { useState } from "react";
import InputField from "@/component/InputField";
import AddToDoModalProps from "@/interface/AddToDoModalProps";
import { AiOutlineCalendar } from "react-icons/ai";
import { BiTask } from "react-icons/bi";
import { validateDate, validateDescription, validatePriority, validateTitle } from "../../utils/validators";
import { saveTaskToLocalStorage } from "../../utils/localStorage";
import { Task } from "@/interface/Task";

export default function AddToDoModal({ isOpen, onClose }: AddToDoModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    priority: "",
    description: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {}

    const { title, date, priority, description } = formData;
    const titleError = validateTitle(title);
    const dateError = validateDate(date);
    const priorityError = validatePriority(priority);
    const descError = validateDescription(description);

    if (titleError) newErrors.title = titleError;
    if (dateError) newErrors.date = dateError;
    if (priorityError) newErrors.priority = priorityError;
    if (descError) newErrors.description = descError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const task: Task = {
      id: Date.now(),
      title,
      date,
      priority: priority as "Extreme" | "Moderate" | "Low",
      description,
      completed: false,
      status: "Pending"
    };
    saveTaskToLocalStorage(task);
    console.log("Your Task ", formData);
    setFormData({ title: "", date: "", priority: "", description: "" });
    setErrors({});
    onClose();
  }

  const handleClose = () => {
    setFormData({ title: "", date: "", priority: "", description: "" });
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl mx-4 sm:mx-6 lg:mx-auto p-6  relative overflow-y-auto max-h-[90vh]">

        <button
          onClick={handleClose}
          className="absolute top-7 right-7  text-sm text-black font-medium hover:underline decoration-1 cursor-pointer"
        >
          Go Back
        </button>

        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-700 inline-block">
          <span className="underline underline-offset-4 decoration-blue-700 decoration-2">Add New Ta</span>sk
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">

          {/* Title */}
          <InputField
            label="Title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
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
            placeholder="Select a date"
            error={errors.date}
            icon={<AiOutlineCalendar />}
          />

          {/* Priority */}
          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
              Priority
            </label>
            <div className="flex flex-wrap gap-4 sm:gap-6">
              {["Extreme", "Moderate", "Low"].map((level) => (
                <label key={level} className="flex items-center gap-2 text-sm sm:text-base text-gray-500">
                  <span
                    className={` w-3 h-3 rounded-full ${level === "Extreme"
                      ? "bg-red-500"
                      : level === "Moderate"
                        ? "bg-blue-500"
                        : "bg-green-500"
                      }`}
                  >
                  </span>{" "}
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
            {errors.priority && (
              <p className="text-red-500 text-xs mt-1">{errors.priority}</p>
            )}
          </div>

          {/* Task Description */}
          <div>
            <label className="block text-gray-700 font-medium mb-1 text-sm sm:text-base">
              Task Description
            </label>
            <textarea
              name="description"
              placeholder="Start writing here..."
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full border text-black border-gray-200 rounded-md sm:rounded-lg px-3 py-2 text-sm sm:text-base outline-none focus:ring focus:ring-blue-400 resize-none"
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="mt-2 sm:mt-4 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 rounded-md sm:rounded-lg bg-blue-600 text-white text-sm sm:text-base font-medium hover:bg-blue-700 cursor-pointer"
            >
              Done
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
