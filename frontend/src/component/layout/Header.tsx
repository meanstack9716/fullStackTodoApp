'use client'
import React, { useState } from "react";
import { MdCalendarMonth } from "react-icons/md";
import { CiBellOn } from "react-icons/ci";
import { FiMenu } from "react-icons/fi";
import Button from "../Button";
import Sidebar from "./Sidebar";

export default function Header({ title = "Dashboard" }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <>
            <header className="flex items-center justify-between px-4 py-2 bg-indigo-50 shadow-sm xl:px-6 xl:py-2.5">
                {/* Title */}
                <h1 className="text-xl font-semibold text-gray-800 font-[cursive] md:pl-2 xl:pl-9 md:text-2xl xl:text-4xl">{title}</h1>

                <div className="flex items-center gap-2.5 md:gap-4 xl:gap-8">
                    <div className="hidden items-center gap-2 xl:gap-3 md:flex">
                        <MdCalendarMonth className="w-5 h-5 text-gray-700 cursor-pointer xl:w-6 xl:h-6" />
                        <CiBellOn className="w-5 h-5 text-gray-700 cursor-pointer xl:w-6 xl:h-6" />
                    </div>
                    <div className="hidden flex-col md:flex">
                        <p className="text-gray-700 text-sm font-bold font-sans md:text-base">Today</p>
                        <p className="text-blue-500 text-xs font-medium font-sans md:text-sm">08.03.2025</p>
                    </div>
                    <Button type="button" text="Add Task" className="px-2 py-1.5 rounded-md text-xs md:text-sm xl:px-4 xl:py-2 xl:text-base" />
                    <FiMenu
                        className="block md:hidden w-8 h-8 text-gray-800 cursor-pointer"
                        onClick={() => setIsSidebarOpen(true)}
                    />
                </div>
            </header>

            {/* Sidebar Drawer for Mobile */}
            {isSidebarOpen && (
                <div className="fixed inset-0 z-50 flex">
                    <div
                        className="fixed inset-0 bg-black/20"
                        onClick={() => setIsSidebarOpen(false)}
                    ></div>
                    <Sidebar user={{ name: "Hello User", email: "usertest@gmail.com" }} isMobile={true} onClose={() => setIsSidebarOpen(false)} />
                </div>
            )}
        </>
    );
}
