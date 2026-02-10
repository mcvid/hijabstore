"use client";
import React, { useState } from "react";
import Sidebar from "@/components/admin/layout/Sidebar";
import TopBar from "@/components/admin/layout/TopBar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-admin-bg flex font-sans">
            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Main Content */}
            <main
                className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isSidebarOpen ? "lg:ml-64" : "lg:ml-20"
                    }`}
            >
                <TopBar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

                {/* Page Content */}
                <div className="p-6 md:p-8 max-w-[1600px] mx-auto w-full animate-fade-in mb-12">
                    {children}
                </div>
            </main>
        </div>
    );
}
