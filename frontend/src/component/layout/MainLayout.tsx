'use client';
import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import ProtectedRoute from "../ProtectedRoute";

interface MainLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export default function MainLayout({ children, title = "Dashboard" }: MainLayoutProps) {

    return (
          <ProtectedRoute>
        <div className="h-screen flex flex-col">
            {/* Header */}
            <Header title={title} />

            <div className="flex flex-1">
                {/* Sidebar */}
                <Sidebar
                    user={{ name: "Hello User", email: "usertest@gmail.com" }}
                />

                {/* Main content */}
                <main className="flex-1 bg-gray-50 ">{children}</main>
            </div>
        </div>
        </ProtectedRoute>
    );
}
