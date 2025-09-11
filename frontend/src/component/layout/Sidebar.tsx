'use client';
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaTasks, FaCog, FaQuestionCircle } from "react-icons/fa";
import { LuLayoutDashboard } from "react-icons/lu";
import { BiTask } from "react-icons/bi";
import { MdOutlineClose } from "react-icons/md";

export default function Sidebar({
    user = { name: "", email: "" },
    isMobile = false,
    isOpen = false,
    onClose = () => { }
}) {
    return (
        <aside
            className={`${isMobile
                ? `fixed top-0 left-0 min-h-screen w-64 bg-blue-700 text-white p-4 z-50 transform transition-transform duration-500 ease-in-out
                 ${isOpen ? "translate-x-0" : "-translate-x-full"}`
                : "hidden md:flex flex-col w-64 xl:w-72 max-h-screen bg-blue-700 text-white p-1 xl:p-4"
                }`}
        >
            <div className="flex flex-col items-center relative">
                {isMobile && (
                    <button
                        className="absolute right-2 top-2 text-white text-xl"
                        onClick={onClose}
                    >
                        <MdOutlineClose />
                    </button>
                )}
                <div className="rounded-full overflow-hidden border-2 border-white p-0.5">
                    <Image
                        src="/images/userLogo.png"
                        alt="User Logo"
                        width={70}
                        height={70}
                        className="object-cover"
                    />
                </div>
                <h2 className="mt-2 text-lg font-semibold">{user.name}</h2>
                <p className="text-sm text-white/80">{user.email}</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 mt-3">
                <ul className="space-y-1 xl:space-y-2">
                    <li>
                        <Link
                            href="/pages/dashboard"
                            className="flex items-center gap-3 py-2 px-4 rounded-lg hover:bg-white/20 transition"
                            onClick={onClose}
                        >
                            <LuLayoutDashboard className="w-4.5 h-4.5" /> Dashboard
                        </Link>
                    </li>

                    <li>
                        <Link
                            href="/pages/myTask"
                            className="flex items-center gap-3 py-2 px-4 rounded-lg hover:bg-white/20 transition"
                            onClick={onClose}
                        >
                            <BiTask className="w-4.5 h-4.5" /> My Task
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/"
                            className="flex items-center gap-3 py-2 px-4 rounded-lg hover:bg-white/20 transition"
                            onClick={onClose}
                        >
                            <FaTasks className="w-4.5 h-4.5" /> Task Categories
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/"
                            className="flex items-center gap-3 py-2 px-4 rounded-lg hover:bg-white/20 transition"
                            onClick={onClose}
                        >
                            <FaCog className="w-4.5 h-4.5" /> Settings
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/"
                            className="flex items-center gap-3 py-2 px-4 rounded-lg hover:bg-white/20 transition"
                            onClick={onClose}
                        >
                            <FaQuestionCircle className="w-4.5 h-4.5" /> Help
                        </Link>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}
