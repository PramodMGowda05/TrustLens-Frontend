"use client";

import React, { useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Header } from "@/components/layout/header";

type AppLayoutProps = {
    children: React.ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    return (
        <SidebarProvider open={isSidebarOpen} onOpenChange={setSidebarOpen}>
            <div className="flex min-h-screen bg-muted/40">
                <SidebarNav />
                <div className="flex flex-1 flex-col">
                    <Header />
                    <main className="flex-1 p-4 sm:p-6">{children}</main>
                </div>
            </div>
        </SidebarProvider>
    );
}
